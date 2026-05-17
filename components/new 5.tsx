) : (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}
  >
    {view === 'map' && (
      <button
        onClick={() => setView('cities')}
        style={{
          border: 'none',
          borderRadius: 8,
          padding: '6px 10px',
          cursor: 'pointer',
          background: '#111827',
          color: 'white'
        }}
      >
        Cities
      </button>
    )}
  </div>
)}