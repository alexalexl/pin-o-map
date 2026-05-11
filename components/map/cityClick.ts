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

export async function openCityPopup({
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

  const visitBtn = document.getElementById('visit-btn')
  const removeBtn = document.getElementById('remove-btn')

  if (visitBtn) {
    visitBtn.onclick = async () => {
      const user = (await supabase.auth.getUser()).data.user

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
      const user = (await supabase.auth.getUser()).data.user

      if (user) {
        await supabase
          .from('visited_cities')
          .delete()
          .eq('user_id', user.id)
          .eq('city_id', cityId)
      }

      setVisited((prev) => prev.filter((id) => id !== cityId))

      popup.remove()
    }
  }
}