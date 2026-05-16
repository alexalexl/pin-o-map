'use client'

import { useState } from 'react'
import Map from '@/components/Map'
import StatsBar from '@/components/StatsBar'

export type SelectedCity = {
  lng: number
  lat: number
} | null

export default function Home() {
  const [visited, setVisited] = useState<number[]>([])

  const [view, setView] = useState<'map' | 'cities'>('map')

  const [selectedCity, setSelectedCity] =
    useState<SelectedCity>(null)
  const countriesCount = 0

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
  />
</>
)
}