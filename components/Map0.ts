'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function Map() {
  const mapContainer = useRef(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

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

      map.addSource('cities', {
        type: 'geojson',
        data
      })

      map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
          'circle-radius': 3,
          'circle-color': '#888'
        }
      })
    })

    mapRef.current = map
  }, [])

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100vh' }}
    />
  )
}

