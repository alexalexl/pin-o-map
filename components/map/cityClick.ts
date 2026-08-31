import maplibregl from 'maplibre-gl'
import { buildCityPopup } from './cityPopup'

type CityClickParams = {
  map: maplibregl.Map
  feature: any
  cityName: string
  countryName: string
  cityId: number
  isVisited: boolean
  countryVisitedCount: number
  setVisited: React.Dispatch<React.SetStateAction<number[]>>
  supabase: any
}

export function openCityPopup({
  map,
  feature,
  cityName,
  countryName,
  cityId,
  isVisited,
  countryVisitedCount,
  setVisited,
  supabase
}: CityClickParams) {
  const popupContent = buildCityPopup({
    cityName,
    countryName,
    countryVisitedCount,
    isVisited
  })

  const popup = new maplibregl.Popup()
    .setLngLat(feature.geometry.coordinates as [number, number])
    .setHTML(popupContent)
    .addTo(map)

  // Ищем кнопки только внутри именно этого popup.
  const popupElement = popup.getElement()

  const visitBtn =
    popupElement.querySelector<HTMLButtonElement>('#visit-btn')

  const removeBtn =
    popupElement.querySelector<HTMLButtonElement>('#remove-btn')

  if (visitBtn) {
    visitBtn.onclick = () => {
      // Сразу даём пользователю визуальный отклик.
      visitBtn.disabled = true
      visitBtn.textContent = '✓ Saved'

      // Optimistic update:
      // город становится красным немедленно,
      // не ждём ответа Supabase.
      setVisited((prev) =>
        prev.includes(cityId) ? prev : [...prev, cityId]
      )

      // Немного показываем Saved, потом закрываем popup.
      setTimeout(() => {
        popup.remove()
      }, 250)

      // Сохраняем в Supabase в фоне.
      void (async () => {
        try {
          const {
            data: { user },
            error: userError
          } = await supabase.auth.getUser()

          if (userError || !user) {
            throw userError || new Error('User not found')
          }

          const { error } = await supabase
            .from('visited_cities')
            .insert({
              user_id: user.id,
              city_id: cityId
            })

          // Duplicate означает, что город уже был
          // сохранён. Это не считаем настоящей ошибкой.
          if (error && error.code !== '23505') {
            throw error
          }
        } catch (error) {
          console.error(
            'Failed to save visited city:',
            error
          )

          // Сервер не сохранил — возвращаем состояние назад.
          setVisited((prev) =>
            prev.filter((id) => id !== cityId)
          )

          alert(
            `Could not save ${cityName}. Please try again.`
          )
        }
      })()
    }
  }

  if (removeBtn) {
    removeBtn.onclick = () => {
      removeBtn.disabled = true
      removeBtn.textContent = '✓ Removed'

      // Сразу убираем красную отметку.
      setVisited((prev) =>
        prev.filter((id) => id !== cityId)
      )

      setTimeout(() => {
        popup.remove()
      }, 250)

      // Supabase — в фоне.
      void (async () => {
        try {
          const {
            data: { user },
            error: userError
          } = await supabase.auth.getUser()

          if (userError || !user) {
            throw userError || new Error('User not found')
          }

          const { error } = await supabase
            .from('visited_cities')
            .delete()
            .eq('user_id', user.id)
            .eq('city_id', cityId)

          if (error) {
            throw error
          }
        } catch (error) {
          console.error(
            'Failed to remove visited city:',
            error
          )

          // Не удалось удалить с сервера —
          // возвращаем красную отметку.
          setVisited((prev) =>
            prev.includes(cityId)
              ? prev
              : [...prev, cityId]
          )

          alert(
            `Could not remove ${cityName}. Please try again.`
          )
        }
      })()
    }
  }
}