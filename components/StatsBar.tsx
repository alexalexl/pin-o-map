type Props = {
  citiesCount: number
  countriesCount: number
}

export default function StatsBar({ citiesCount, countriesCount }: Props) {
  const totalCountries = 195
  const worldPercent = Math.round((countriesCount / totalCountries) * 100)

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
        zIndex: 1
      }}
    >
      <Stat label="Cities" value={citiesCount} />
      <Stat label="Countries" value={countriesCount} />
      <Stat label="World" value={`${worldPercent}%`} />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#666' }}>{label}</div>
    </div>
  )
}