import { useEffect, useState } from 'react'
import { getAvailableCountries, getCountryHolidays } from '../services/holidaysApi'

const COUNTRY_STORAGE_KEY = 'appTurnosCountry'
const regionNames = new Intl.DisplayNames(['es'], { type: 'region' })

function getSavedCountry() {
  try {
    return localStorage.getItem(COUNTRY_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function getCountryName(country) {
  return regionNames.of(country.countryCode) || country.name
}

function getLocalDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function formatHolidayDate(date) {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export function HolidayNotice() {
  const [countries, setCountries] = useState([])
  const [countryCode, setCountryCode] = useState(getSavedCountry)
  const [holidays, setHolidays] = useState([])
  const [countriesStatus, setCountriesStatus] = useState('loading')
  const [holidaysStatus, setHolidaysStatus] = useState(() => (
    getSavedCountry() ? 'loading' : 'idle'
  ))
  const [countriesRetry, setCountriesRetry] = useState(0)
  const [holidaysRetry, setHolidaysRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getAvailableCountries(controller.signal)
      .then((availableCountries) => {
        setCountries(availableCountries)
        setCountriesStatus('success')
        setCountryCode((currentCode) => (
          availableCountries.some((country) => country.countryCode === currentCode)
            ? currentCode
            : ''
        ))
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setCountriesStatus('error')
      })

    return () => controller.abort()
  }, [countriesRetry])

  useEffect(() => {
    if (!countryCode) return undefined

    const controller = new AbortController()
    const year = new Date().getFullYear()

    getCountryHolidays(countryCode, year, controller.signal)
      .then((countryHolidays) => {
        setHolidays(countryHolidays)
        setHolidaysStatus('success')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setHolidaysStatus('error')
      })

    return () => controller.abort()
  }, [countryCode, holidaysRetry])

  function handleCountryChange(event) {
    const nextCountryCode = event.target.value
    setCountryCode(nextCountryCode)
    setHolidays([])
    setHolidaysStatus(nextCountryCode ? 'loading' : 'idle')
    try {
      if (nextCountryCode) localStorage.setItem(COUNTRY_STORAGE_KEY, nextCountryCode)
      else localStorage.removeItem(COUNTRY_STORAGE_KEY)
    } catch {
      // El calendario sigue disponible aunque el navegador no permita guardar la selección.
    }
  }

  function retryCountries() {
    setCountriesStatus('loading')
    setCountriesRetry((attempt) => attempt + 1)
  }

  function retryHolidays() {
    setHolidaysStatus('loading')
    setHolidaysRetry((attempt) => attempt + 1)
  }

  const selectedCountry = countries.find((country) => country.countryCode === countryCode)
  const nationalHolidays = holidays.filter((holiday) => holiday.nationalHoliday)
  const today = getLocalDateKey(new Date())
  const holidayToday = nationalHolidays.find((holiday) => holiday.date === today)
  const nextHoliday = nationalHolidays.find((holiday) => holiday.date > today)

  return (
    <section className="holiday-panel" aria-labelledby="holiday-title">
      <div className="holiday-panel-heading">
        <div>
          <p className="eyebrow">Calendario del servicio</p>
          <h2 id="holiday-title">Feriados nacionales</h2>
        </div>
        <label className="country-field" htmlFor="service-country">
          <span>País de la sucursal</span>
          <select
            id="service-country"
            value={countryCode}
            onChange={handleCountryChange}
            disabled={countriesStatus !== 'success'}
          >
            <option value="">
              {countriesStatus === 'loading' ? 'Cargando países...' : 'Selecciona un país'}
            </option>
            {countries.map((country) => (
              <option key={country.countryCode} value={country.countryCode}>
                {getCountryName(country)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="holiday-result" aria-live="polite">
        {countriesStatus === 'error' && (
          <div className="holiday-state holiday-state--error" role="alert">
            <span>No se pudo cargar la lista de países.</span>
            <button type="button" onClick={retryCountries}>
              Reintentar
            </button>
          </div>
        )}

        {countriesStatus === 'success' && !countryCode && (
          <p className="holiday-state">Selecciona el país donde opera la sucursal.</p>
        )}

        {countryCode && holidaysStatus === 'loading' && (
          <p className="holiday-state">Consultando el calendario de {selectedCountry ? getCountryName(selectedCountry) : 'la sucursal'}...</p>
        )}

        {countryCode && holidaysStatus === 'error' && (
          <div className="holiday-state holiday-state--error" role="alert">
            <span>No se pudo consultar el calendario. Los turnos siguen disponibles.</span>
            <button type="button" onClick={retryHolidays}>
              Reintentar
            </button>
          </div>
        )}

        {countryCode && holidaysStatus === 'success' && holidayToday && (
          <div className="holiday-summary holiday-summary--today">
            <span className="holiday-date-label">Hoy</span>
            <strong>{holidayToday.name}</strong>
            <span>Feriado nacional en {selectedCountry ? getCountryName(selectedCountry) : countryCode}</span>
          </div>
        )}

        {countryCode && holidaysStatus === 'success' && !holidayToday && nextHoliday && (
          <div className="holiday-summary">
            <span className="holiday-date-label">Próximo feriado</span>
            <strong>{nextHoliday.name}</strong>
            <span>{formatHolidayDate(nextHoliday.date)}</span>
          </div>
        )}

        {countryCode && holidaysStatus === 'success' && !holidayToday && !nextHoliday && (
          <p className="holiday-state">No hay más feriados nacionales este año.</p>
        )}
      </div>
    </section>
  )
}