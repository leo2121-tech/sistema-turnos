export function Stats({ waiting, attended }) {
  return (
    <section className="stats-panel" aria-labelledby="stats-title">
      <div className="stats-heading">
        <h2 id="stats-title">Resumen de hoy</h2>
        <span>EN VIVO</span>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{waiting}</span>
          <span className="stat-label">En espera</span>
        </div>
        <div className="stat-item stat-item--attended">
          <span className="stat-value">{attended}</span>
          <span className="stat-label">Atendidos</span>
        </div>
      </div>
    </section>
  )
}