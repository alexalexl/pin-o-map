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
  return `
    <div style="min-width: 120px;">
      <div style="font-weight: 600;">${cityName}</div>

      <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">
        ${countryName} · ${countryVisitedCount} visited
      </div>

      ${
        isVisited
          ? `
            <div style="margin-bottom: 6px;">✔ Visited</div>
            <button id="remove-btn">Remove mark</button>
          `
          : `
            <button id="visit-btn">Mark visited</button>
          `
      }
    </div>
  `
}