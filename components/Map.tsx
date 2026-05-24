'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useMemo } from 'react'
import StatsBar from './StatsBar'
import { updateLabelsVisibility } from './map/labels'
import { openCityPopup } from './map/cityClick'
import CitiesPanel from './CitiesPanel'
import { supabase } from '@/lib/supabase'
import SearchBar from './SearchBar'

type MapProps = {
  visited: number[]
  setVisited: React.Dispatch<React.SetStateAction<number[]>>

  view: 'map' | 'cities'
  setView: React.Dispatch<
    React.SetStateAction<'map' | 'cities'>
  >

  selectedCity: {
    lng: number
    lat: number
  } | null

  search: string
    setSearch: React.Dispatch<
      React.SetStateAction<string>
  >

  setSelectedCity: React.Dispatch<
    React.SetStateAction<{
      lng: number
      lat: number
    } | null>
  > 

  setCountriesCount: React.Dispatch<
    React.SetStateAction<number>
  >  
}

export default function Map({
  visited,
  setVisited,
  view,
  setView,
  selectedCity,
  setSelectedCity,
  setCountriesCount,
  search,
  setSearch,    
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const visitedRef = useRef<number[]>([])
  //calcaulate StatusBar height
  const statsBarRef = useRef<HTMLDivElement | null>(null)
  const [statsBarHeight, setStatsBarHeight] = useState(0)
  useEffect(() => {
    const updateStatsBarHeight = () => {
      if (statsBarRef.current) {
        setStatsBarHeight(statsBarRef.current.offsetHeight)
      }
    }

    updateStatsBarHeight()
    window.addEventListener('resize', updateStatsBarHeight)

    return () => {
      window.removeEventListener('resize', updateStatsBarHeight)
    }
  }, [])	  
 
  const [dataLoaded, setDataLoaded] = useState(false) 
  const [mapLoaded, setMapLoaded] = useState(false)  
  const citiesDataRef = useRef<any>(null)
  const [searchOpen, setSearchOpen] =
   useState(false)
  const MAP_VIEW_KEY = 'pinomap-map-view'
const [isMobile, setIsMobile] =
  useState(false)

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 640)
  }

  checkMobile()

  window.addEventListener('resize', checkMobile)

  return () => {
    window.removeEventListener(
      'resize',
      checkMobile
    )
  }
}, [])

	const fitToVisited = () => {
	  if (!mapRef.current || visited.length === 0 || !citiesDataRef.current) return

	  const visitedFeatures = citiesDataRef.current.features.filter((f: any) =>
		visited.includes(Number(f.properties.id))
	  )

	  if (visitedFeatures.length === 0) return

	  if (visitedFeatures.length === 1) {
		const [lng, lat] = visitedFeatures[0].geometry.coordinates
		mapRef.current.flyTo({
		  center: [lng, lat],
		  zoom: 7
		})
		return
	  }

	  const bounds = new maplibregl.LngLatBounds()

	  visitedFeatures.forEach((f: any) => {
		bounds.extend(f.geometry.coordinates)
	  })

	  mapRef.current.fitBounds(bounds, {
		padding: 40,
		maxZoom: 7
	  })
	}

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
	  setCountriesCount(countriesCount)
	}, [countriesCount])	
	
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
	  const loadCities = async () => {
		if (citiesDataRef.current) return

		const response = await fetch('/data/cities.geojson')
		const data = await response.json()

		citiesDataRef.current = data
		setDataLoaded(true)
	  }

	  loadCities()
	}, [])	
  useEffect(() => {
	let initialCenter: [number, number] = [0, 20]
	let initialZoom = 1.5
	//если это не map, то map не рендерим
	if (view !== 'map') return
	
	if (mapContainer.current?.children.length) return
	
	const savedView = localStorage.getItem(MAP_VIEW_KEY)

	if (savedView) {
	  try {
		const parsed = JSON.parse(savedView)

		if (
		  Array.isArray(parsed.center) &&
		  parsed.center.length === 2 &&
		  typeof parsed.zoom === 'number'
		) {
		  initialCenter = parsed.center
		  initialZoom = parsed.zoom
		}
	  } catch {}
	}
    const map = new maplibregl.Map({
      container: mapContainer.current!,
      style: 'https://demotiles.maplibre.org/style.json',
	center: initialCenter,
	zoom: initialZoom
    })
    map.on('load', async () => {
	  const saveMapView = () => {
		const center = map.getCenter()

		  localStorage.setItem(
			MAP_VIEW_KEY,
			JSON.stringify({
			  center: [center.lng, center.lat],
			  zoom: map.getZoom()
			})
		)
	  }	  
	  setMapLoaded(true)
	  const data = citiesDataRef.current
	  map.on('moveend', saveMapView)

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
		  'circle-radius': [
			'interpolate',
			['linear'],
			['zoom'],
			1, 4,
			5, 6,
			10, 10
		  ],
		  'circle-color': '#9ca3af', // серый
		}
      })

      // visited города (красные)
      map.addLayer({
        id: 'visited-layer',
        type: 'circle',
        source: 'cities',
		paint: {
		  'circle-radius': [
			'interpolate',
			['linear'],
			['zoom'],
			1, 4,
			5, 6,
			10, 10
		  ],
		  'circle-color': '#ef4444', // красный ✅
		},
        filter: ['in', 'id', -1]
      })
	  // добавляем слой в котором будем показыавет city labels
		map.addLayer({
		  id: 'city-labels',
		  type: 'symbol',
		  source: 'cities',
		  layout: {
			'text-field': ['get', 'city'],
			'text-size': 14,
			'text-offset': [0, 1.1],
			'text-anchor': 'top',
			'visibility': 'none'
		  },
		  paint: {
			'text-color': '#374151'
		  }
		})	  
		map.on('moveend', () => updateLabelsVisibility(map, citiesDataRef))
		map.on('zoomend', () => updateLabelsVisibility(map, citiesDataRef))

		updateLabelsVisibility(map, citiesDataRef)	
		
		
      // клик по городу
		map.on('click', (e) => {
		  const bbox: [[number, number], [number, number]] = [
			[e.point.x - 10, e.point.y - 10],
			[e.point.x + 10, e.point.y + 10]
		  ]

		  const features = map.queryRenderedFeatures(bbox, {
			layers: ['cities-layer']
		  })

		  if (!features.length) return

		  const feature = features[0] as maplibregl.MapGeoJSONFeature & {
			geometry: GeoJSON.Point
		  }

		  const cityId = Number(feature.properties.id)
		  const cityName = feature.properties.city
		  const countryName = feature.properties.country

		  const countryVisitedCount = citiesDataRef.current.features.filter((f: any) => {
			return (
			  f.properties.country === countryName &&
			  visitedRef.current.includes(Number(f.properties.id))
			)
		  }).length

		  const isVisited = visitedRef.current.includes(cityId)

		  openCityPopup({
			map,
			feature,
			cityName,
			countryName,
			cityId,
			isVisited,
			countryVisitedCount,
			setVisited,
			supabase
		  })
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
	return () => {
	  map.remove()
	  mapRef.current = null
	}	
  }, [view])

  // обновление слоя visited
	useEffect(() => {
	  const map = mapRef.current
	  if (!map) return

	  if (!mapLoaded) return
	  if (!map.getLayer('visited-layer')) return

	  console.log('Applying filter:', visited)

	  map.setFilter('visited-layer', [
		'in',
		'id',
		...visited
	  ])
	}, [visited, mapLoaded])
	//делает Fly to
	useEffect(() => {
	  if (!selectedCity) return
	  if (!mapRef.current) return

	  mapRef.current.flyTo({
		center: [selectedCity.lng, selectedCity.lat],
		zoom: 9,
		duration: 2000
	  })

	  setSelectedCity(null)
	}, [selectedCity])	
	//показывает список городов
	const visitedCities =
	  citiesDataRef.current?.features.filter((f: any) =>
		visited.includes(Number(f.properties.id))
	  ) || []

	const searchResults =
	search.length < 3 || !citiesDataRef.current
		? []
		: citiesDataRef.current.features
			.filter((city: any) =>
			city.properties.city
				.toLowerCase()
				.includes(search.toLowerCase())
			)
			.slice(0, 8)  

	if (view === 'cities') {
	  return (
		<CitiesPanel
		  visitedCities={visitedCities}
		  onBackToMap={() => setView('map')}
		  onCitySelect={(city) => {
			const [lng, lat] = city.geometry.coordinates

			setSelectedCity({ lng, lat })
			setView('map')
		  }}
		/>
	  )
	}	

	return (
	<>
		{isMobile && view === 'map' && !searchOpen && (
		<button
			onClick={() => setSearchOpen(true)}
			style={{
			position: 'fixed',
			top: statsBarHeight + 8,
			left: 12,
			zIndex: 30,
			background: 'white',
			border: '1px solid #ddd',
			borderRadius: 8,
			width: 36,
			height: 36,
			fontSize: 16,
			cursor: 'pointer',
			boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
			}}
		>
			🔍
		</button>
		)}

		{isMobile &&
		view === 'map' &&
		visited.length > 0 && (
			<button
			onClick={() => setView('cities')}
			style={{
				position: 'fixed',
				top: statsBarHeight + 56,
				left: 12,
				zIndex: 30,
				background: 'white',
				color: '#111827',
				border: '1px solid #ddd',
				borderRadius: 8,
				padding: '6px 10px',
				fontSize: 12,
				fontWeight: 500,
				cursor: 'pointer',
				boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
				height: 32
			}}
			>
			Cities
			</button>
		)}

		{visited.length > 0 && view === 'map' && (
		<button
			onClick={fitToVisited}
			style={{
			position: 'fixed',
			top: statsBarHeight + 8,
			right: 12,
			zIndex: 30,
			background: 'white',
			border: '1px solid #ddd',
			borderRadius: 8,
			padding: '0 14px',
			height: 40,
			fontSize: 14,
			cursor: 'pointer',
			boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
			}}
		>
			{isMobile ? 'Fit map' : 'Fit to visited'}
		</button>
		)}

		{!isMobile && (
		<div
			style={{
			position: 'fixed',
			top: 16,
			left: 16,
			zIndex: 30
			}}
		>
			<SearchBar
			search={search}
			setSearch={setSearch}
			results={searchResults}
			onSelectCity={(city) => {
				setSelectedCity({
				lng: city.geometry.coordinates[0],
				lat: city.geometry.coordinates[1]
				})

				setView('map')
			}}
			/>
		</div>
		)}

		{searchOpen && (
		<div
			style={{
			position: 'fixed',
			top: 12,
			left: 12,
			right: 12,
			zIndex: 40,
			background: 'white',
			borderRadius: 12,
			boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
			padding: 12
			}}
		>
			<div
			style={{
				display: 'flex',
				gap: 8,
				marginBottom: 8
			}}
			>
			<button
				onClick={() => setSearchOpen(false)}
				style={{
				border: 'none',
				background: '#f3f4f6',
				borderRadius: 8,
				padding: '0 12px',
				cursor: 'pointer'
				}}
			>
				←
			</button>

			<SearchBar
				search={search}
				setSearch={setSearch}
				results={searchResults}
				onSelectCity={(city) => {
				setSelectedCity({
					lng: city.geometry.coordinates[0],
					lat: city.geometry.coordinates[1]
				})

				setSearchOpen(false)
				setView('map')
				}}
			/>
			</div>
		</div>
		)}

		<div
		style={{
			position: 'relative',
			width: '100%',
			height: '100dvh',
			overflow: 'hidden'
		}}
		>
		<div
			ref={mapContainer}
			style={{
			width: '100%',
			height: '100%'
			}}
		/>
		</div>
	</>
	)	
	}