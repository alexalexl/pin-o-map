type SearchBarProps = {
  search: string

  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >

  results: any[]

  recentSearches: any[]

  onClearRecentSearches: () => void

  onSelectCity: (city: any) => void
}

export default function SearchBar({
  search,
  setSearch,
  results,
  recentSearches,
  onClearRecentSearches,
  onSelectCity
}: SearchBarProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 320,
        minWidth: 0,
        boxSizing: 'border-box'
      }}
    >
      <div style={{ position: 'relative' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search city..."
          style={{
            width: '100%',
            height: 52,
            padding: '0 14px',
            borderRadius: 8,
            border: '1px solid #ddd',

            // Важно для iPhone Safari.
            // Если меньше 16px, Safari может зумить страницу при фокусе.
            fontSize: 16,

            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            background: 'white'
          }}
        />
      {search && (
        <button
          onClick={() => setSearch('')}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 18,
            color: '#666'
          }}
        >
          ×
        </button>
      )}
      </div>
{search.length === 0 && recentSearches.length > 0 && (
  <div
    style={{
      marginTop: 8,
      background: 'white',
      borderRadius: 12,
      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f3f4f6'
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#6b7280'
        }}
      >
        Recent searches
      </span>

      <button
        onClick={onClearRecentSearches}
        style={{
          border: 'none',
          background: 'transparent',
          color: '#6b7280',
          cursor: 'pointer',
          fontSize: 12
        }}
      >
        Clear history
      </button>
    </div>

      {recentSearches.map((city) => (
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
            borderBottom: '1px solid #f3f4f6'
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center'
            }}
          >
            <span>↺</span>

            <div>
              <div style={{ fontWeight: 600 }}>
                {city.properties.city}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  marginTop: 2
                }}
              >
                {city.properties.country}
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )}      
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
                  color: '#6b7280',
                  marginTop: 2
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