type CitiesPanelProps = {
  visitedCities: any[]
  onCitySelect: (city: any) => void
}

export default function CitiesPanel({
  visitedCities,
  onCitySelect
}: CitiesPanelProps) {
  const grouped = visitedCities.reduce((acc: any, city: any) => {
    const country = city.properties.country

    if (!acc[country]) {
      acc[country] = []
    }

    acc[country].push(city)

    return acc
  }, {})

  const sortedCountries = Object.keys(grouped).sort()

  return (
    <div
      style={{
        padding: 16,
        overflowY: 'auto',
        height: '100vh',
        background: '#fff'
      }}
    >
      {sortedCountries.map((country) => {
        const cities = grouped[country].sort((a: any, b: any) =>
          a.properties.city.localeCompare(b.properties.city)
        )

        return (
          <div
            key={country}
            style={{ marginBottom: 24 }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 8
              }}
            >
              {country}
            </div>

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
          </div>
        )
      })}
    </div>
  )
}