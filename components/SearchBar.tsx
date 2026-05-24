type SearchBarProps = {
  search: string
  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >

  results: any[]

  onSelectCity: (city: any) => void
}

export default function SearchBar({
  search,
  setSearch,
  results,
  onSelectCity
}: SearchBarProps) {
  return (
      <div
        style={{
          width: 320
        }}
      >
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search city..."
        style={{
          width: '100%',
          height: 40,
          padding: '0 14px',
          borderRadius: 8,
          border: '1px solid #ddd',
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          background: 'white'
        }}
      />

      {results.length > 0 && (
        <div
          style={{
            marginTop: 8,
            background: 'white',
            borderRadius: 12,
            boxShadow:
              '0 4px 12px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            maxHeight: 320,
            overflowY: 'auto'
          }}
        >
          {results.map((city) => (
            <button
              key={city.properties.id}
              onClick={() => {
                onSelectCity(city)
                setSearch('')
              }}
              style={{
                width: '100%',
                border: 'none',
                background: 'white',
                padding: '12px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                borderBottom:
                  '1px solid #f3f4f6'
              }}
            >
              <div
                style={{
                  fontWeight: 600
                }}
              >
                {city.properties.city}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: '#666'
                }}
              >
                {city.properties.country}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}