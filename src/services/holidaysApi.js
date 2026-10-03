const COUNTRIES_URL = 'https://date.nager.at/api/v3/AvailableCountries'
const HOLIDAYS_URL = 'https://nagerholidays.com/api/v4/Holidays'

async function requestJson(url, signal) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`La API respondió con estado ${response.status}.`)
  }

  return response.json()
}

export async function getAvailableCountries(signal) {
  const countries = await requestJson(COUNTRIES_URL, signal)
  if (!Array.isArray(countries)) {
    throw new Error('La API devolvió una lista de países no válida.')
  }
  return countries
}

export async function getCountryHolidays(countryCode, year, signal) {
  const url = `${HOLIDAYS_URL}/${encodeURIComponent(countryCode)}/${year}`
  const holidays = await requestJson(url, signal)
  if (!Array.isArray(holidays)) {
    throw new Error('La API devolvió un calendario no válido.')
  }
  return holidays
}