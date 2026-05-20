import { useState } from 'react'
type CitiesPanelProps = {
  visitedCities: any[]
  onCitySelect: (city: any) => void

  onBackToMap: () => void
}
const countryFlags: Record<string, string> = {
  Afghanistan: '🇦🇫',
  Albania: '🇦🇱',
  Algeria: '🇩🇿',
  Andorra: '🇦🇩',
  Angola: '🇦🇴',
  'Antigua and Barbuda': '🇦🇬',
  Argentina: '🇦🇷',
  Armenia: '🇦🇲',
  Australia: '🇦🇺',
  Austria: '🇦🇹',
  Azerbaijan: '🇦🇿',
  Bahamas: '🇧🇸',
  Bahrain: '🇧🇭',
  Bangladesh: '🇧🇩',
  Barbados: '🇧🇧',
  Belarus: '🇧🇾',
  Belgium: '🇧🇪',
  Belize: '🇧🇿',
  Benin: '🇧🇯',
  Bhutan: '🇧🇹',
  Bolivia: '🇧🇴',
  'Bosnia and Herzegovina': '🇧🇦',
  Botswana: '🇧🇼',
  Brazil: '🇧🇷',
  Brunei: '🇧🇳',
  Bulgaria: '🇧🇬',
  'Burkina Faso': '🇧🇫',
  Burundi: '🇧🇮',
  CaboVerde: '🇨🇻',
  Cambodia: '🇰🇭',
  Cameroon: '🇨🇲',
  Canada: '🇨🇦',
  'Central African Republic': '🇨🇫',
  Chad: '🇹🇩',
  Chile: '🇨🇱',
  China: '🇨🇳',
  Colombia: '🇨🇴',
  Comoros: '🇰🇲',
  Congo: '🇨🇬',
  CostaRica: '🇨🇷',
  Croatia: '🇭🇷',
  Cuba: '🇨🇺',
  Cyprus: '🇨🇾',
  Czechia: '🇨🇿',
  Denmark: '🇩🇰',
  Djibouti: '🇩🇯',
  Dominica: '🇩🇲',
  'Dominican Republic': '🇩🇴',
  Ecuador: '🇪🇨',
  Egypt: '🇪🇬',
  ElSalvador: '🇸🇻',
  'Equatorial Guinea': '🇬🇶',
  Eritrea: '🇪🇷',
  Estonia: '🇪🇪',
  Eswatini: '🇸🇿',
  Ethiopia: '🇪🇹',
  Fiji: '🇫🇯',
  Finland: '🇫🇮',
  France: '🇫🇷',
  Gabon: '🇬🇦',
  Gambia: '🇬🇲',
  Georgia: '🇬🇪',
  Germany: '🇩🇪',
  Ghana: '🇬🇭',
  Greece: '🇬🇷',
  Grenada: '🇬🇩',
  Guatemala: '🇬🇹',
  Guinea: '🇬🇳',
  'Guinea Bissau': '🇬🇼',
  Guyana: '🇬🇾',
  Haiti: '🇭🇹',
  Honduras: '🇭🇳',
  Hungary: '🇭🇺',
  Iceland: '🇮🇸',
  India: '🇮🇳',
  Indonesia: '🇮🇩',
  Iran: '🇮🇷',
  Iraq: '🇮🇶',
  Ireland: '🇮🇪',
  Israel: '🇮🇱',
  Italy: '🇮🇹',
  Jamaica: '🇯🇲',
  Japan: '🇯🇵',
  Jordan: '🇯🇴',
  Kazakhstan: '🇰🇿',
  Kenya: '🇰🇪',
  Kiribati: '🇰🇮',
  Kuwait: '🇰🇼',
  Kyrgyzstan: '🇰🇬',
  Laos: '🇱🇦',
  Latvia: '🇱🇻',
  Lebanon: '🇱🇧',
  Lesotho: '🇱🇸',
  Liberia: '🇱🇷',
  Libya: '🇱🇾',
  Liechtenstein: '🇱🇮',
  Lithuania: '🇱🇹',
  Luxembourg: '🇱🇺',
  Madagascar: '🇲🇬',
  Malawi: '🇲🇼',
  Malaysia: '🇲🇾',
  Maldives: '🇲🇻',
  Mali: '🇲🇱',
  Malta: '🇲🇹',
  'Marshall Islands': '🇲🇭',
  Mauritania: '🇲🇷',
  Mauritius: '🇲🇺',
  Mexico: '🇲🇽',
  Micronesia: '🇫🇲',
  Moldova: '🇲🇩',
  Monaco: '🇲🇨',
  Mongolia: '🇲🇳',
  Montenegro: '🇲🇪',
  Morocco: '🇲🇦',
  Mozambique: '🇲🇿',
  Myanmar: '🇲🇲',
  Namibia: '🇳🇦',
  Nauru: '🇳🇷',
  Nepal: '🇳🇵',
  Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿',
  Nicaragua: '🇳🇮',
  Niger: '🇳🇪',
  Nigeria: '🇳🇬',
  NorthKorea: '🇰🇵',
  'North Macedonia': '🇲🇰',
  Norway: '🇳🇴',
  Oman: '🇴🇲',
  Pakistan: '🇵🇰',
  Palau: '🇵🇼',
  Palestine: '🇵🇸',
  Panama: '🇵🇦',
  'Papua New Guinea': '🇵🇬',
  Paraguay: '🇵🇾',
  Peru: '🇵🇪',
  Philippines: '🇵🇭',
  Poland: '🇵🇱',
  Portugal: '🇵🇹',
  Qatar: '🇶🇦',
  Romania: '🇷🇴',
  Russia: '🇷🇺',
  Rwanda: '🇷🇼',
  'Saint Kitts and Nevis': '🇰🇳',
  'Saint Lucia': '🇱🇨',
  'Saint Vincent and The Grenadines': '🇻🇨',
  Samoa: '🇼🇸',
  'San Marino': '🇸🇲',
  'Sao Tome and Principe': '🇸🇹',
  'Saudi Arabia': '🇸🇦',
  Senegal: '🇸🇳',
  Serbia: '🇷🇸',
  Seychelles: '🇸🇨',
  'Sierra Leone': '🇸🇱',
  Singapore: '🇸🇬',
  Slovakia: '🇸🇰',
  Slovenia: '🇸🇮',
  'Solomon Islands': '🇸🇧',
  Somalia: '🇸🇴',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  'South Sudan': '🇸🇸',
  Spain: '🇪🇸',
  'Sri Lanka': '🇱🇰',
  Sudan: '🇸🇩',
  Suriname: '🇸🇷',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  Syria: '🇸🇾',
  Taiwan: '🇹🇼',
  Tajikistan: '🇹🇯',
  Tanzania: '🇹🇿',
  Thailand: '🇹🇭',
  'Timor Leste': '🇹🇱',
  Togo: '🇹🇬',
  Tonga: '🇹🇴',
  'Trinidad and Tobago': '🇹🇹',
  Tunisia: '🇹🇳',
  Turkey: '🇹🇷',
  Turkmenistan: '🇹🇲',
  Tuvalu: '🇹🇻',
  Uganda: '🇺🇬',
  Ukraine: '🇺🇦',
  'United Arab Emirates': '🇦🇪',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Uruguay: '🇺🇾',
  Uzbekistan: '🇺🇿',
  Vanuatu: '🇻🇺',
  'Vatican City': '🇻🇦',
  Venezuela: '🇻🇪',
  Vietnam: '🇻🇳',
  Yemen: '🇾🇪',
  Zambia: '🇿🇲',
  Zimbabwe: '🇿🇼'
}

const capitals: Record<string, string> = {
  France: 'Paris',
  Italy: 'Rome',
  Spain: 'Madrid',
  Portugal: 'Lisbon',
  Germany: 'Berlin',
  Netherlands: 'Amsterdam',
  Japan: 'Tokyo',
  Thailand: 'Bangkok',
  Georgia: 'Tbilisi',
  Turkey: 'Ankara',
  Indonesia: 'Jakarta',
  Vietnam: 'Hanoi',
  Singapore: 'Singapore',
  'United Arab Emirates': 'Abu Dhabi',
  'United States': 'Washington',
  Canada: 'Ottawa',
  Mexico: 'Mexico City',
  Brazil: 'Brasília',
  Argentina: 'Buenos Aires',
  China: 'Beijing',
  'South Korea': 'Seoul',
  India: 'New Delhi',
  Australia: 'Canberra'
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
const cities = grouped[country].sort(
  (a: any, b: any) => {
    const capital = capitals[country]

    if (a.properties.city === capital) {
      return -1
    }

    if (b.properties.city === capital) {
      return 1
    }

    return a.properties.city.localeCompare(
      b.properties.city
    )
  }
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
			  {countryFlags[country] || '🌍'} {country} · {cities.length} cities
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
{city.properties.city === capitals[country]
  ? '★ '
  : ''}
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