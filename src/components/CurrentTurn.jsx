function formatNumber(number) {
  return String(number).padStart(3, '0')
}

export function CurrentTurn({ turn }) {
  return (
    <section className="current-turn" aria-labelledby="current-turn-title">
      <div className="current-turn-copy">
        <p className="current-turn-kicker">
          <span className="live-indicator" aria-hidden="true" />
          Atendiendo ahora
        </p>
        <h2 id="current-turn-title">Turno actual</h2>
        <p className="current-turn-number" aria-live="polite">
          {turn ? formatNumber(turn.numero) : '---'}
        </p>
        <p className="current-turn-name">
          {turn ? turn.nombreCliente : 'Aún no hay turnos llamados'}
        </p>
      </div>
      <div className="module-display">
        <span>Módulo</span>
        <strong>{turn ? String(turn.modulo).padStart(2, '0') : '--'}</strong>
      </div>
      <span className="current-turn-index" aria-hidden="true">01 / ATENCIÓN</span>
    </section>
  )
}