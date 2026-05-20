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
  Afghanistan: 'Kabul',
  Albania: 'Tirana',
  Algeria: 'Algiers',
  Andorra: 'Andorra la Vella',
  Angola: 'Luanda',
  'Antigua and Barbuda': 'Saint John’s',
  Argentina: 'Buenos Aires',
  Armenia: 'Yerevan',
  Australia: 'Canberra',
  Austria: 'Vienna',
  Azerbaijan: 'Baku',
  Bahamas: 'Nassau',
  Bahrain: 'Manama',
  Bangladesh: 'Dhaka',
  Barbados: 'Bridgetown',
  Belarus: 'Minsk',
  Belgium: 'Brussels',
  Belize: 'Belmopan',
  Benin: 'Porto-Novo',
  Bhutan: 'Thimphu',
  Bolivia: 'Sucre',
  'Bosnia and Herzegovina': 'Sarajevo',
  Botswana: 'Gaborone',
  Brazil: 'Brasília',
  Brunei: 'Bandar Seri Begawan',
  Bulgaria: 'Sofia',
  'Burkina Faso': 'Ouagadougou',
  Burundi: 'Gitega',
  CaboVerde: 'Praia',
  Cambodia: 'Phnom Penh',
  Cameroon: 'Yaoundé',
  Canada: 'Ottawa',
  'Central African Republic': 'Bangui',
  Chad: 'N’Djamena',
  Chile: 'Santiago',
  China: 'Beijing',
  Colombia: 'Bogotá',
  Comoros: 'Moroni',
  Congo: 'Brazzaville',
  CostaRica: 'San José',
  Croatia: 'Zagreb',
  Cuba: 'Havana',
  Cyprus: 'Nicosia',
  Czechia: 'Prague',
  Denmark: 'Copenhagen',
  Djibouti: 'Djibouti',
  Dominica: 'Roseau',
  'Dominican Republic': 'Santo Domingo',
  Ecuador: 'Quito',
  Egypt: 'Cairo',
  ElSalvador: 'San Salvador',
  'Equatorial Guinea': 'Malabo',
  Eritrea: 'Asmara',
  Estonia: 'Tallinn',
  Eswatini: 'Mbabane',
  Ethiopia: 'Addis Ababa',
  Fiji: 'Suva',
  Finland: 'Helsinki',
  France: 'Paris',
  Gabon: 'Libreville',
  Gambia: 'Banjul',
  Georgia: 'Tbilisi',
  Germany: 'Berlin',
  Ghana: 'Accra',
  Greece: 'Athens',
  Grenada: 'Saint George’s',
  Guatemala: 'Guatemala City',
  Guinea: 'Conakry',
  'Guinea Bissau': 'Bissau',
  Guyana: 'Georgetown',
  Haiti: 'Port-au-Prince',
  Honduras: 'Tegucigalpa',
  Hungary: 'Budapest',
  Iceland: 'Reykjavík',
  India: 'New Delhi',
  Indonesia: 'Jakarta',
  Iran: 'Tehran',
  Iraq: 'Baghdad',
  Ireland: 'Dublin',
  Israel: 'Jerusalem',
  Italy: 'Rome',
  Jamaica: 'Kingston',
  Japan: 'Tokyo',
  Jordan: 'Amman',
  Kazakhstan: 'Astana',
  Kenya: 'Nairobi',
  Kiribati: 'South Tarawa',
  Kuwait: 'Kuwait City',
  Kyrgyzstan: 'Bishkek',
  Laos: 'Vientiane',
  Latvia: 'Riga',
  Lebanon: 'Beirut',
  Lesotho: 'Maseru',
  Liberia: 'Monrovia',
  Libya: 'Tripoli',
  Liechtenstein: 'Vaduz',
  Lithuania: 'Vilnius',
  Luxembourg: 'Luxembourg',
  Madagascar: 'Antananarivo',
  Malawi: 'Lilongwe',
  Malaysia: 'Kuala Lumpur',
  Maldives: 'Malé',
  Mali: 'Bamako',
  Malta: 'Valletta',
  'Marshall Islands': 'Majuro',
  Mauritania: 'Nouakchott',
  Mauritius: 'Port Louis',
  Mexico: 'Mexico City',
  Micronesia: 'Palikir',
  Moldova: 'Chișinău',
  Monaco: 'Monaco',
  Mongolia: 'Ulaanbaatar',
  Montenegro: 'Podgorica',
  Morocco: 'Rabat',
  Mozambique: 'Maputo',
  Myanmar: 'Naypyidaw',
  Namibia: 'Windhoek',
  Nauru: 'Yaren',
  Nepal: 'Kathmandu',
  Netherlands: 'Amsterdam',
  'New Zealand': 'Wellington',
  Nicaragua: 'Managua',
  Niger: 'Niamey',
  Nigeria: 'Abuja',
  NorthKorea: 'Pyongyang',
  'North Macedonia': 'Skopje',
  Norway: 'Oslo',
  Oman: 'Muscat',
  Pakistan: 'Islamabad',
  Palau: 'Ngerulmud',
  Palestine: 'East Jerusalem',
  Panama: 'Panama City',
  'Papua New Guinea': 'Port Moresby',
  Paraguay: 'Asunción',
  Peru: 'Lima',
  Philippines: 'Manila',
  Poland: 'Warsaw',
  Portugal: 'Lisbon',
  Qatar: 'Doha',
  Romania: 'Bucharest',
  Russia: 'Moscow',
  Rwanda: 'Kigali',
  'Saint Kitts and Nevis': 'Basseterre',
  'Saint Lucia': 'Castries',
  'Saint Vincent and The Grenadines': 'Kingstown',
  Samoa: 'Apia',
  'San Marino': 'San Marino',
  'Sao Tome and Principe': 'São Tomé',
  'Saudi Arabia': 'Riyadh',
  Senegal: 'Dakar',
  Serbia: 'Belgrade',
  Seychelles: 'Victoria',
  'Sierra Leone': 'Freetown',
  Singapore: 'Singapore',
  Slovakia: 'Bratislava',
  Slovenia: 'Ljubljana',
  'Solomon Islands': 'Honiara',
  Somalia: 'Mogadishu',
  'South Africa': 'Pretoria',
  'South Korea': 'Seoul',
  'South Sudan': 'Juba',
  Spain: 'Madrid',
  'Sri Lanka': 'Sri Jayawardenepura Kotte',
  Sudan: 'Khartoum',
  Suriname: 'Paramaribo',
  Sweden: 'Stockholm',
  Switzerland: 'Bern',
  Syria: 'Damascus',
  Taiwan: 'Taipei',
  Tajikistan: 'Dushanbe',
  Tanzania: 'Dodoma',
  Thailand: 'Bangkok',
  'Timor Leste': 'Dili',
  Togo: 'Lomé',
  Tonga: 'Nukuʻalofa',
  'Trinidad and Tobago': 'Port of Spain',
  Tunisia: 'Tunis',
  Turkey: 'Ankara',
  Turkmenistan: 'Ashgabat',
  Tuvalu: 'Funafuti',
  Uganda: 'Kampala',
  Ukraine: 'Kyiv',
  'United Arab Emirates': 'Abu Dhabi',
  'United Kingdom': 'London',
  'United States': 'Washington',
  Uruguay: 'Montevideo',
  Uzbekistan: 'Tashkent',
  Vanuatu: 'Port Vila',
  'Vatican City': 'Vatican City',
  Venezuela: 'Caracas',
  Vietnam: 'Hanoi',
  Yemen: 'Sana’a',
  Zambia: 'Lusaka',
  Zimbabwe: 'Harare'
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