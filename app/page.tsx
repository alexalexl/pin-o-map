'use client'

import { useEffect, useState } from 'react'
import Map from '@/components/Map'
import StatsBar from '@/components/StatsBar'
import SearchBar from '@/components/SearchBar'

export type SelectedCity = {
  lng: number
  lat: number
} | null

export default function Home() {
  const [visited, setVisited] = useState<number[]>([])

  const [view, setView] = useState<'map' | 'cities'>('map')

  const [selectedCity, setSelectedCity] =
    useState<SelectedCity>(null)

  const [search, setSearch] = useState('')
  const [recentSearches, setRecentSearches] =
   useState<any[]>([])
useEffect(() => {
  const saved = localStorage.getItem(
    'pinomap-recent-searches'
  )

  if (!saved) return

  try {
    setRecentSearches(JSON.parse(saved))
  } catch {
    // если localStorage почему-то поврежден —
    // просто начинаем с пустой истории
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
  localStorage.removeItem('pinomap-recent-searches')
}


  const [countriesCount, setCountriesCount] =
   useState(0)

return (
<>
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
	  setCountriesCount={setCountriesCount}	
    search={search}
    setSearch={setSearch}
    recentSearches={recentSearches}
    addRecentSearch={addRecentSearch}
    clearRecentSearches={clearRecentSearches}    
  />
</>
)
}