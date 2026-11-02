import { useEffect, useState } from 'react'
import './App.css'
import { CurrentTurn } from './components/CurrentTurn'
import { HolidayNotice } from './components/HolidayNotice'
import { OperatorPanel } from './components/OperatorPanel'
import { QueuePanel } from './components/QueuePanel'
import { Stats } from './components/Stats'

const TURNOS_API_URL = '/api/turnos'

const EMPTY_STATE = {
  turnoActual: null,
  turnosEnEspera: [],
  historial: [],
  turnosAtendidos: 0,
  contador: 0,
}

function adaptarTurno(turno, datosLocales = {}) {
  return {
    ...turno,
    numero: Number(turno.codigo?.match(/\d+$/)?.[0]) || Number(turno.id) || 0,
    modulo: turno.modulo_id || datosLocales.modulo || 1,
    nombreCliente: datosLocales.nombreCliente || `Cliente General`,
    tipo: datosLocales.tipo || 'General',
    creadoEn: turno.fecha_creacion,
  }
}

async function cargarTurnosPendientes() {
  const respuesta = await fetch(`${TURNOS_API_URL}/pendientes`)
  if (!respuesta.ok) throw new Error('Error al obtener la fila')

  const turnos = await respuesta.json()
  if (!Array.isArray(turnos)) throw new Error('La respuesta de turnos no es válida')
  return turnos.map((turno) => adaptarTurno(turno))
}

function App() {
  // Inicializamos el estado vacío, ya no usamos localStorage
  const [data, setData] = useState(EMPTY_STATE)
  const [notice, setNotice] = useState(null)

  // Carga inicial desde la API de PostgreSQL
  useEffect(() => {
    let active = true

    cargarTurnosPendientes()
      .then((turnos) => {
        if (active) {
          setData((current) => ({ ...current, turnosEnEspera: turnos }))
        }
      })
      .catch((error) => console.error('Error conectando con la API:', error))

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timeoutId = window.setTimeout(() => setNotice(null), 3600)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  async function registerTicket({ nombreCliente, tipo }) {
    try {
      const respuesta = await fetch(TURNOS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicio_id: 1 }),
      })
      if (!respuesta.ok) throw new Error('Error al emitir el turno')

      const nuevoTurno = await respuesta.json()
      const ticketCreado = adaptarTurno(nuevoTurno, { nombreCliente, tipo })

      // Actualizamos la fila consultando nuevamente a la base de datos
      const turnosPendientes = await cargarTurnosPendientes()

      setData((current) => ({
        ...current,
        contador: Math.max(current.contador, ticketCreado.numero),
        turnosEnEspera: turnosPendientes,
      }))

      setNotice({
        type: 'success',
        text: `Turno ${nuevoTurno.codigo} registrado en la base de datos.`,
      })

      return true
    } catch (error) {
      console.error('Error emitiendo el turno:', error)
      setNotice({ type: 'warning', text: 'No fue posible conectar con el servidor.' })
      return false
    }
  }

  async function callNextTicket(moduloId) {
    try {
      const respuesta = await fetch(`${TURNOS_API_URL}/llamar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modulo_id: moduloId }),
      })
      const turnoLlamado = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(turnoLlamado.mensaje || turnoLlamado.error || 'No fue posible llamar el turno.')
      }

      const turnoActual = {
        ...adaptarTurno(turnoLlamado, { modulo: moduloId }),
        atendidoEn: new Date().toISOString(),
      }

      // Refrescamos la fila desde la API
      const turnosPendientes = await cargarTurnosPendientes()

      setData((current) => ({
        ...current,
        turnoActual,
        turnosEnEspera: turnosPendientes,
        historial: [turnoActual, ...current.historial],
        turnosAtendidos: current.turnosAtendidos + 1,
      }))

      setNotice({
        type: 'info',
        text: `Turno ${turnoLlamado.codigo} llamado al módulo ${moduloId}.`,
      })
    } catch (error) {
      console.error('Error llamando al turno:', error)
      setNotice({ type: 'warning', text: error.message || 'No fue posible llamar el turno.' })
    }
  }

  async function resetSystem() {
    if (!window.confirm('¿Vaciar los turnos pendientes? Se conservarán los turnos atendidos y la auditoría.')) return false

    try {
      const respuesta = await fetch(`${TURNOS_API_URL}/reiniciar`, {
        method: 'DELETE'
      })

      if (!respuesta.ok) throw new Error('Error al reiniciar la base de datos')

      setData((current) => ({ ...current, turnosEnEspera: [] }))
      setNotice({ type: 'info', text: 'Fila vaciada. Historial y auditoría conservados.' })
      return true
    } catch (error) {
      console.error('Error al reiniciar:', error)
      setNotice({ type: 'warning', text: 'No se pudo conectar con el servidor para reiniciar.' })
      return false
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <a className="brand" href="#inicio" aria-label="Sistema de Atención, inicio">
          <span className="brand-mark" aria-hidden="true">SA</span>
          <span>
            <span className="brand-name">Sistema de Atención</span>
            <span className="brand-caption">Centro de atención</span>
          </span>
        </a>
        <div className="header-status">
          <span className="live-indicator" aria-hidden="true" />
          <span>Servidor API Conectado</span>
        </div>
      </header>

      <section className="page-intro" id="inicio">
        <div>
          <p className="eyebrow">Atención presencial / Panel principal</p>
          <h1>Gestión de turnos</h1>
        </div>
      </section>

      {notice && (
        <div className={`notice notice--${notice.type}`} role="status">
          <span>{notice.text}</span>
          <button type="button" aria-label="Cerrar aviso" onClick={() => setNotice(null)}>
            ×
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        <section className="public-column" aria-label="Estado público de los turnos">
          <CurrentTurn turn={data.turnoActual} />
          <HolidayNotice />
          <QueuePanel waiting={data.turnosEnEspera} history={data.historial} />
        </section>

        <aside className="operator-column" aria-label="Controles del operador">
          <OperatorPanel
            onAdd={registerTicket}
            onCallNext={callNextTicket}
            onReset={resetSystem}
          />
          <Stats waiting={data.turnosEnEspera.length} attended={data.turnosAtendidos} />
        </aside>
      </div>

      <footer className="app-footer">
        <span>Sistema de Atención</span>
        <span>Sincronizado con PostgreSQL y MongoDB</span>
      </footer>
    </main>
  )
}

export default App