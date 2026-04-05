'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useMemo } from 'react'
import StatsBar from './StatsBar'
import { supabase } from '@/lib/supabase'

export default function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const visitedRef = useRef<number[]>([])

  const [visited, setVisited] = useState<number[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)  
  const citiesDataRef = useRef<any>(null)

	const countriesCount = useMemo(() => {
	  if (!dataLoaded || visited.length === 0) return 0

	  const countries = new Set<string>()

	  visited.forEach((id) => {
		const feature = citiesDataRef.current.features.find(
		  (f: any) => Number(f.properties.id) === id
		)

		if (feature) {
		  countries.add(feature.properties.country)
		}
	  })

	  return countries.size
	}, [visited, dataLoaded]) 
	useEffect(() => {
		visitedRef.current = visited
	}, [visited])
	useEffect(() => {
	  const initUser = async () => {
		const { data } = await supabase.auth.getUser()

		if (!data.user) {
		  const { data: newUser } = await supabase.auth.signInAnonymously()
		  console.log('NEW USER CREATED:', newUser)
		} else {
		  console.log('EXISTING USER:', data.user)
		}
	  }

	  initUser()
	}, [])
	useEffect(() => {
	  const initAndLoad = async () => {
		// 1. получаем или создаём user
		let { data } = await supabase.auth.getUser()
		let user = data.user

		if (!user) {
		  const { data: newUser } = await supabase.auth.signInAnonymously()
		  user = newUser.user
		}

		if (!user) {
		  console.log('NO USER AFTER INIT')
		  return
		}

		console.log('USER READY:', user.id)

		// 2. загружаем visited
		const { data: cities, error } = await supabase
		  .from('visited_cities')
		  .select('city_id')
		  .eq('user_id', user.id)

		console.log('LOADED CITIES:', cities, error)

		if (cities) {
		  setVisited(cities.map((c) => c.city_id))
		}
	  }

	  initAndLoad()
	}, [])
  useEffect(() => {
	visitedRef.current = visited
  }, [visited])
  useEffect(() => {
    if (mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [0, 20],
      zoom: 2
    })
    map.on('load', async () => {
      const response = await fetch('/data/cities.geojson')
      const data = await response.json()
	  citiesDataRef.current = data
	  setDataLoaded(true)

      // источник
      map.addSource('cities', {
        type: 'geojson',
        data
      })

      // все города (серые)
      map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
          'circle-radius': 3,
          'circle-color': '#888'
        }
      })

      // visited города (красные)
      map.addLayer({
        id: 'visited-layer',
        type: 'circle',
        source: 'cities',
        paint: {
          'circle-radius': 4,
          'circle-color': '#e63946'
        },
        filter: ['in', 'id', -1]
      })

      // клик по городу
      map.on('click', 'cities-layer', (e) => {
        const feature = e.features?.[0]
        if (!feature) return

        const props = feature.properties as any
        const coords = (feature.geometry as any).coordinates.slice()

        const cityId = Number(props.id)
        const cityName = String(props.city || 'Unknown')
        const country = String(props.country || '')

        const isVisited = visitedRef.current.includes(cityId)

        const popupHtml = `
          <div style="font-family: sans-serif">
            <strong>${cityName}</strong><br/>
            ${country}<br/><br/>
            ${
              isVisited
                ? `
                  <div style="color: green; margin-bottom: 8px;">
                    ✔ Visited
                  </div>
                  <button id="remove-btn">Remove mark</button>
                `
                : `<button id="visit-btn">Mark visited</button>`
            }
          </div>
        `

        const popup = new maplibregl.Popup()
          .setLngLat(coords)
          .setHTML(popupHtml)
          .addTo(map)

        // обработка кнопок
        setTimeout(() => {
          const visitBtn = document.getElementById('visit-btn')
          const removeBtn = document.getElementById('remove-btn')

		if (visitBtn) {
		  visitBtn.onclick = async () => {
			let { data } = await supabase.auth.getUser()
			let user = data.user

			if (!user) {
			  const { data: newUser } = await supabase.auth.signInAnonymously()
			  user = newUser.user
			}

			console.log('USER FOR INSERT:', user)

			if (user) {
			  await supabase.from('visited_cities').insert({
				user_id: user.id,
				city_id: cityId
			  })
			}

			setVisited((prev) =>
			  prev.includes(cityId) ? prev : [...prev, cityId]
			)

			popup.remove()
		  }
		}

		if (removeBtn) {
		  removeBtn.onclick = async () => {
			const { data } = await supabase.auth.getUser()
			const user = data.user

			if (user) {
			  await supabase
				.from('visited_cities')
				.delete()
				.eq('user_id', user.id)
				.eq('city_id', cityId)
			}

			setVisited((prev) =>
			  prev.filter((id) => id !== cityId)
			)

			popup.remove()
		  }
		}
        }, 0)
      })
	  // применяем visited сразу после загрузки карты
		if (visitedRef.current.length > 0) {
		  map.setFilter('visited-layer', [
			'in',
			'id',
			...visitedRef.current
		  ])
		}
    })

    mapRef.current = map
  }, [])

  // обновление слоя visited
	useEffect(() => {
	  const map = mapRef.current
	  if (!map) return

	  if (!map.isStyleLoaded()) return
	  if (!map.getLayer('visited-layer')) return

	  map.setFilter('visited-layer', ['in', 'id', ...visited])
	}, [visited])

	return (
	  <>
		<StatsBar
		  citiesCount={visited.length}
		  countriesCount={countriesCount}
		/>

		<div
		  ref={mapContainer}
		  style={{ width: '100%', height: '100vh' }}
		/>
	  </>
	)
}