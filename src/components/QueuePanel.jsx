function formatNumber(number) {
  return String(number).padStart(3, '0')
}

function formatTime(value) {
  if (!value) return 'Hora no disponible'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Hora no disponible'

  return new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function TicketRow({ ticket, attended }) {
  return (
    <li className="ticket-row">
      <span className="ticket-number">{formatNumber(ticket.numero)}</span>
      <span className="ticket-details">
        <strong>{ticket.nombreCliente || 'Cliente sin nombre'}</strong>
        <span>{attended ? `Atendido ${formatTime(ticket.atendidoEn)}` : `Registrado ${formatTime(ticket.creadoEn || ticket.timestamp)}`}</span>
      </span>
      <span className={`ticket-type ${ticket.tipo === 'Preferencial' ? 'ticket-type--priority' : ''}`}>
        {ticket.tipo || 'General'}
      </span>
    </li>
  )
}

export function QueuePanel({ waiting, history }) {
  const [activeList, setActiveList] = React.useState('waiting')
  const visibleTickets = activeList === 'waiting' ? waiting : history

  return (
    <section className="queue-panel" aria-labelledby="queue-title">
      <div className="queue-heading">
        <div>
          <p className="eyebrow">Seguimiento</p>
          <h2 id="queue-title">Fila de atención</h2>
        </div>
        <span className="queue-total">{activeList === 'waiting' ? waiting.length : history.length}</span>
      </div>

      <div className="queue-tabs" role="group" aria-label="Lista de turnos">
        <button
          type="button"
          className={activeList === 'waiting' ? 'queue-tab is-active' : 'queue-tab'}
          aria-pressed={activeList === 'waiting'}
          onClick={() => setActiveList('waiting')}
        >
          En espera <span>{waiting.length}</span>
        </button>
        <button
          type="button"
          className={activeList === 'history' ? 'queue-tab is-active' : 'queue-tab'}
          aria-pressed={activeList === 'history'}
          onClick={() => setActiveList('history')}
        >
          Historial <span>{history.length}</span>
        </button>
      </div>

      {visibleTickets.length > 0 ? (
        <ul className="ticket-list">
          {visibleTickets.map((ticket) => (
            <TicketRow
              key={`${ticket.numero}-${ticket.creadoEn || ticket.timestamp || ticket.atendidoEn}`}
              ticket={ticket}
              attended={activeList === 'history'}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <span className="empty-mark" aria-hidden="true">—</span>
          <p>{activeList === 'waiting' ? 'La fila está despejada.' : 'Todavía no hay turnos atendidos.'}</p>
        </div>
      )}
    </section>
  )
}

import React from 'react'