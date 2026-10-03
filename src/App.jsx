import { useEffect, useState } from 'react'
import './App.css'
import { CurrentTurn } from './components/CurrentTurn'
import { HolidayNotice } from './components/HolidayNotice'
import { OperatorPanel } from './components/OperatorPanel'
import { QueuePanel } from './components/QueuePanel'
import { Stats } from './components/Stats'

const STORAGE_KEY = 'appTurnos'

const EMPTY_STATE = {
  turnoActual: null,
  turnosEnEspera: [],
  historial: [],
  turnosAtendidos: 0,
  contador: 0,
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved) return EMPTY_STATE

    const turnosEnEspera = Array.isArray(saved.turnosEnEspera)
      ? saved.turnosEnEspera
      : []
    const historial = Array.isArray(saved.historial) ? saved.historial : []
    const highestNumber = [
      saved.turnoActual?.numero || 0,
      ...turnosEnEspera.map((turno) => Number(turno.numero) || 0),
      ...historial.map((turno) => Number(turno.numero) || 0),
    ].reduce((highest, number) => Math.max(highest, number), 0)

    return {
      turnoActual: saved.turnoActual || null,
      turnosEnEspera,
      historial,
      turnosAtendidos: Number(saved.turnosAtendidos) || historial.length,
      contador: Math.max(Number(saved.contador) || 0, highestNumber),
    }
  } catch {
    return EMPTY_STATE
  }
}

function App() {
  const [data, setData] = useState(loadState)
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('No fue posible guardar los turnos:', error)
    }
  }, [data])

  useEffect(() => {
    if (!notice) return undefined
    const timeoutId = window.setTimeout(() => setNotice(null), 3600)
    return () => window.clearTimeout(timeoutId)
  }, [notice])

  function registerTicket({ nombreCliente, tipo }) {
    const numero = data.contador + 1
    const nuevoTurno = {
      numero,
      modulo: Math.floor(Math.random() * 5) + 1,
      tipo,
      nombreCliente,
      creadoEn: new Date().toISOString(),
    }

    setData((current) => ({
      ...current,
      contador: numero,
      turnosEnEspera: [...current.turnosEnEspera, nuevoTurno],
    }))
    setNotice({
      type: 'success',
      text: `Turno ${String(numero).padStart(3, '0')} registrado para ${nombreCliente}.`,
    })
  }

  function callNextTicket() {
    if (data.turnosEnEspera.length === 0) {
      setNotice({ type: 'warning', text: 'No hay turnos en espera.' })
      return
    }

    const [nextTicket, ...remaining] = data.turnosEnEspera
    const attendedTicket = { ...nextTicket, atendidoEn: new Date().toISOString() }

    setData((current) => ({
      ...current,
      turnoActual: attendedTicket,
      turnosEnEspera: remaining,
      historial: [attendedTicket, ...current.historial],
      turnosAtendidos: current.turnosAtendidos + 1,
    }))
    setNotice({
      type: 'info',
      text: `Turno ${String(nextTicket.numero).padStart(3, '0')} llamado al módulo ${nextTicket.modulo}.`,
    })
  }

  function resetSystem() {
    if (!window.confirm('¿Reiniciar el sistema y borrar la cola y el historial?')) return false

    setData(EMPTY_STATE)
    setNotice({ type: 'info', text: 'Sistema reiniciado.' })
    return true
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
          <span>Sistema operativo</span>
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
        <span>Datos guardados en este dispositivo</span>
      </footer>
    </main>
  )
}

export default App
