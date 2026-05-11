export function updateLabelsVisibility(
  map: any,
  citiesDataRef: any
) {
  const zoom = map.getZoom()

  if (!map.getLayer('city-labels')) return

  const bounds = map.getBounds()

  const visibleCities = citiesDataRef.current.features.filter((f: any) => {
    const [lng, lat] = f.geometry.coordinates
    return bounds.contains([lng, lat])
  })

  const shouldShow = zoom >= 3.5 && visibleCities.length <= 40

  map.setLayoutProperty(
    'city-labels',
    'visibility',
    shouldShow ? 'visible' : 'none'
  )
}