type CityPopupParams = {
  cityName: string
  countryName: string
  countryVisitedCount: number
  isVisited: boolean
}

export function buildCityPopup({
  cityName,
  countryName,
  countryVisitedCount,
  isVisited
}: CityPopupParams) {
  const buttonStyle = `
    width: 100%;
    min-height: 44px;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    touch-action: manipulation;
  `

  return `
    <div style="min-width: 150px;">
      <div style="font-weight: 600; margin-bottom: 2px;">
        ${cityName}
      </div>

      <div
        style="
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 10px;
        "
      >
        ${countryName} · ${countryVisitedCount} visited
      </div>

      ${
        isVisited
          ? `
            <div style="margin-bottom: 8px;">
              ✔ Visited
            </div>

            <button
              id="remove-btn"
              style="
                ${buttonStyle}
                background: #f3f4f6;
                color: #374151;
              "
            >
              Remove mark
            </button>
          `
          : `
            <button
              id="visit-btn"
              style="
                ${buttonStyle}
                background: #111827;
                color: white;
              "
            >
              Mark visited
            </button>
          `
      }
    </div>
  `
}