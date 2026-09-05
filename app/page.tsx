'use client'

import { useEffect, useState } from 'react'
import Map from '@/components/Map'
import StatsBar from '@/components/StatsBar'
import { supabase } from '@/lib/supabase'

export type SelectedCity = {
  lng: number
  lat: number
} | null

const PENDING_MERGE_KEY = 'pinomap-pending-merge'

export default function Home() {
  const [visited, setVisited] = useState<number[]>([])

  const [view, setView] =
    useState<'map' | 'cities'>('map')

  const [selectedCity, setSelectedCity] =
    useState<SelectedCity>(null)

  const [search, setSearch] = useState('')

  const [recentSearches, setRecentSearches] =
    useState<any[]>([])

  const [countriesCount, setCountriesCount] =
    useState(0)

  // Auth state
  const [authReady, setAuthReady] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [authBusy, setAuthBusy] = useState(false)

  const [userEmail, setUserEmail] =
    useState<string | null>(null)

  const [authError, setAuthError] =
    useState<string | null>(null)

  // ----------------------------
  // Recent searches
  // ----------------------------

  useEffect(() => {
    const saved = localStorage.getItem(
      'pinomap-recent-searches'
    )

    if (!saved) return

    try {
      setRecentSearches(JSON.parse(saved))
    } catch {
      // повреждённый localStorage просто игнорируем
    }
  }, [])

  const addRecentSearch = (city: any) => {
    const recentCity = {
      properties: {
        id: city.properties.id,
        city: city.properties.city,
        country: city.properties.country
      },
      geometry: {
        coordinates: city.geometry.coordinates
      }
    }

    setRecentSearches((prev) => {
      const updated = [
        recentCity,
        ...prev.filter(
          (item) =>
            Number(item.properties.id) !==
            Number(recentCity.properties.id)
        )
      ].slice(0, 8)

      localStorage.setItem(
        'pinomap-recent-searches',
        JSON.stringify(updated)
      )

      return updated
    })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])

    localStorage.removeItem(
      'pinomap-recent-searches'
    )
  }

  // ----------------------------
  // Auth + visited cities
  // ----------------------------

  useEffect(() => {
    let cancelled = false

    const initAuthAndVisited = async () => {
      try {
        // 1. Получаем существующего пользователя
        const {
          data: userData
        } = await supabase.auth.getUser()

        let user = userData.user

        // 2. Если сессии ещё нет —
        // создаём anonymous user
        if (!user) {
          const {
            data: anonymousData,
            error: anonymousError
          } =
            await supabase.auth.signInAnonymously()

          if (
            anonymousError ||
            !anonymousData.user
          ) {
            throw (
              anonymousError ||
              new Error(
                'Could not create anonymous user'
              )
            )
          }

          user = anonymousData.user
        }

        // 3. Загружаем карту текущего пользователя
        const {
          data: cities,
          error: citiesError
        } = await supabase
          .from('visited_cities')
          .select('city_id')
          .eq('user_id', user.id)

        if (citiesError) {
          throw citiesError
        }

        let serverVisited =
          (cities ?? []).map((city) =>
            Number(city.city_id)
          )

        // 4. Если после Google OAuth мы уже
        // permanent user — проверяем,
        // нет ли локальной карты для merge
        if (!user.is_anonymous) {
          const pendingRaw =
            localStorage.getItem(
              PENDING_MERGE_KEY
            )

          if (pendingRaw) {
            let pendingVisited: number[] = []

            try {
              const parsed =
                JSON.parse(pendingRaw)

              if (Array.isArray(parsed)) {
                pendingVisited = parsed
                  .map(Number)
                  .filter(Number.isFinite)
              }
            } catch {
              localStorage.removeItem(
                PENDING_MERGE_KEY
              )
            }

            const mergedVisited =
              Array.from(
                new Set([
                  ...serverVisited,
                  ...pendingVisited
                ])
              )

            const serverSet =
              new Set(serverVisited)

            const missingCities =
              mergedVisited.filter(
                (cityId) =>
                  !serverSet.has(cityId)
              )

            if (missingCities.length > 0) {
              const {
                error: mergeError
              } = await supabase
                .from('visited_cities')
                .insert(
                  missingCities.map(
                    (cityId) => ({
                      user_id: user.id,
                      city_id: cityId
                    })
                  )
                )

              if (mergeError) {
                console.error(
                  'MERGE ERROR:',
                  mergeError
                )

                // Не удаляем pending.
                // На следующей загрузке
                // попробуем синхронизировать снова.
                if (!cancelled) {
                  setAuthError(
                    'Some cities are waiting to sync.'
                  )
                }
              } else {
                localStorage.removeItem(
                  PENDING_MERGE_KEY
                )
              }
            } else {
              localStorage.removeItem(
                PENDING_MERGE_KEY
              )
            }

            // Даже если сервер временно
            // не сохранил merge,
            // пользователь ничего визуально
            // не теряет.
            serverVisited = mergedVisited
          }
        }

        if (cancelled) return

        setVisited(serverVisited)
        setIsAnonymous(
          Boolean(user.is_anonymous)
        )
        setUserEmail(user.email ?? null)
        setAuthReady(true)
      } catch (error) {
        console.error(
          'AUTH INIT ERROR:',
          error
        )

        if (!cancelled) {
          setAuthError(
            'Could not load your account.'
          )
          setAuthReady(true)
        }
      }
    }

    initAuthAndVisited()

    return () => {
      cancelled = true
    }
  }, [])

  // ----------------------------
  // Google Sign In
  // ----------------------------

  const signInWithGoogle = async () => {
    setAuthBusy(true)
    setAuthError(null)

    // Перед уходом на Google сохраняем
    // текущую anonymous-карту.
    localStorage.setItem(
      PENDING_MERGE_KEY,
      JSON.stringify(visited)
    )

    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })

    if (error) {
      console.error(
        'GOOGLE SIGN IN ERROR:',
        error
      )

      setAuthError(
        'Could not sign in with Google.'
      )

      setAuthBusy(false)
    }
  }

  const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('SIGN OUT ERROR:', error)
    return
  }

  // После logout создадим нового anonymous user
  const {
    data,
    error: anonymousError
  } = await supabase.auth.signInAnonymously()

  if (anonymousError || !data.user) {
    console.error(
      'ANONYMOUS SIGN IN ERROR:',
      anonymousError
    )
    return
  }

  setVisited([])
  setIsAnonymous(true)
  setUserEmail(null)

  localStorage.removeItem('pinomap-pending-merge')
}

  return (
    <>
      {/* Google account button */}
      {authReady && (
        <div
          className="auth-control"
          style={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 30,
            textAlign: 'right'
          }}
        >
          <button
            onClick={
              isAnonymous
                ? signInWithGoogle
                : signOut
            }
                        disabled={authBusy}
            title={
              isAnonymous
                ? 'Sync your map with Google'
                : userEmail ??
                  'Your map is synced'
            }
            style={{
              border: '1px solid #ddd',
              background: 'white',
              borderRadius: 8,
              padding: '0 12px',
              height: 40,
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',              
              fontSize: 14,
              fontWeight: 400,
              cursor:
                isAnonymous
                  ? 'pointer'
                  : 'default',
              boxShadow:
                '0 2px 8px rgba(0,0,0,0.15)'
            }}
          >
            <>
              <span className="auth-text-desktop">
                {!isAnonymous
                  ? '✓ Synced'
                  : authBusy
                    ? 'Opening Google...'
                    : visited.length > 0
                      ? 'Save & sync'
                      : 'Sign in'}
              </span>

              <span className="auth-text-mobile">
                {!isAnonymous
                  ? '✓ Synced'
                  : authBusy
                    ? '...'
                    : visited.length > 0
                      ? 'Sync'
                      : 'Sign in'}
              </span>
            </>
          </button>

          {authError && (
            <div
              style={{
                marginTop: 6,
                maxWidth: 220,
                padding: '6px 8px',
                background: 'white',
                borderRadius: 6,
                fontSize: 12,
                color: '#b91c1c',
                boxShadow:
                  '0 2px 8px rgba(0,0,0,0.12)'
              }}
            >
              {authError}
            </div>
          )}
        </div>
      )}

      {!(
        typeof window !== 'undefined' &&
        window.innerWidth < 640 &&
        view === 'cities'
      ) && (
        <StatsBar
          citiesCount={visited.length}
          countriesCount={countriesCount}
          view={view}
          setView={setView}
        />
      )}

      <Map
        visited={visited}
        setVisited={setVisited}
        view={view}
        setView={setView}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setCountriesCount={
          setCountriesCount
        }
        search={search}
        setSearch={setSearch}
        recentSearches={recentSearches}
        addRecentSearch={addRecentSearch}
        clearRecentSearches={
          clearRecentSearches
        }
      />
    </>
  )
}