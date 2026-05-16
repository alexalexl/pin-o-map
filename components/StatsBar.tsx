type StatsBarProps = {
  citiesCount: number
  countriesCount: number

  view: 'map' | 'cities'
  setView: React.Dispatch<
    React.SetStateAction<'map' | 'cities'>
  >
}

export default function StatsBar({
  citiesCount,
  countriesCount,
  view,
  setView
}: StatsBarProps) {
  const totalCountries = 195

  const worldPercent = Math.round(
    (countriesCount / totalCountries) * 100
  )

  const isMobile =
    typeof window !== 'undefined' &&
    window.innerWidth < 640

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        padding: '10px 16px',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        gap: 24,
        fontFamily: 'sans-serif',
        zIndex: 20,
        alignItems: 'center'
      }}
    >
      <Stat label="Cities" value={citiesCount} />

      <Stat label="Countries" value={countriesCount} />

      <Stat label="World" value={`${worldPercent}%`} />

      {!isMobile && (
        <div
          style={{
            display: 'flex',
            gap: 8
          }}
        >
          <button
            onClick={() => setView('map')}
            style={{
              border: 'none',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              background:
                view === 'map'
                  ? '#111827'
                  : '#e5e7eb',
              color:
                view === 'map'
                  ? 'white'
                  : 'black'
            }}
          >
            Map
          </button>

          <button
            onClick={() => setView('cities')}
            style={{
              border: 'none',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              background:
                view === 'cities'
                  ? '#111827'
                  : '#e5e7eb',
              color:
                view === 'cities'
                  ? 'white'
                  : 'black'
            }}
          >
            Cities
          </button>
        </div>
      )}
    </div>
  )
}

function Stat({
  label,
  value
}: {
  label: string
  value: string | number
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 12,
          color: '#666'
        }}
      >
        {label}
      </div>
    </div>
  )
}