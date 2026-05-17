import { useState } from 'react'
type CitiesPanelProps = {
  visitedCities: any[]
  onCitySelect: (city: any) => void

  onBackToMap: () => void
}

export default function CitiesPanel({
  visitedCities,
  onCitySelect,
  onBackToMap
}: CitiesPanelProps) {
  const grouped = visitedCities.reduce((acc: any, city: any) => {
    const country = city.properties.country

    if (!acc[country]) {
      acc[country] = []
    }

    acc[country].push(city)

    return acc
  }, {})
  
  const [expandedCountries, setExpandedCountries] =
    useState<Record<string, boolean>>({})

  const toggleCountry = (country: string) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [country]: !prev[country]
    }))
  }
	
  const sortedCountries = Object.keys(grouped).sort()
  const isMobile =
    typeof window !== 'undefined' &&
    window.innerWidth < 640
return (
  <div
    style={{
      padding: 16,
      overflowY: 'auto',
      height: '100vh',
      background: '#fff'
    }}
  >
	{isMobile && (
	  <button
		onClick={onBackToMap}
		style={{
		  border: 'none',
		  background: '#e5e7eb',
		  borderRadius: 8,
		  padding: '10px 14px',
		  marginBottom: 16,
		  cursor: 'pointer',
		  fontSize: 14
		}}
	  >
		← Back to map
	  </button>
	)}

    {sortedCountries.map((country) => {
      const cities = grouped[country].sort((a: any, b: any) =>
        a.properties.city.localeCompare(b.properties.city)
      )

      return (
        <div
          key={country}
          style={{ marginBottom: 24 }}
        >
		<button
		  onClick={() => toggleCountry(country)}
		  style={{
			width: '100%',
			border: 'none',
			background: '#f9fafb',
			borderRadius: 10,
			padding: '12px 14px',
			display: 'flex',
			alignItems: 'center',
			gap: 10,
			cursor: 'pointer',
			marginBottom: 8
		  }}
		>
			<div
			  style={{
				fontSize: 14,
				color: '#666'
			  }}
			>
			  {expandedCountries[country] ? '▼' : '▶'}
			</div>

			<div
			  style={{
				fontWeight: 700,
				fontSize: 16
			  }}
			>
			  {country} · {cities.length} cities
			</div>
		</button>

		{expandedCountries[country] && (
		  <div
			style={{
			  display: 'flex',
			  flexDirection: 'column',
			  gap: 6
			}}
		  >
            {cities.map((city: any) => (
              <button
                key={city.properties.id}
                onClick={() => onCitySelect(city)}
                style={{
                  border: 'none',
                  background: '#f3f4f6',
                  borderRadius: 8,
                  padding: '10px 12px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                {city.properties.city}
              </button>
            ))}
          </div>
		)}
        </div>
      )
    })}
  </div>
)
}