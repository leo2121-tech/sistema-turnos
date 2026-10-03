import { useState } from 'react'

export function OperatorPanel({ onAdd, onCallNext, onReset }) {
  const [nombreCliente, setNombreCliente] = useState('')
  const [tipo, setTipo] = useState('General')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const cleanName = nombreCliente.trim()
    if (!cleanName) {
      setError('Escribe el nombre de la persona para continuar.')
      return
    }

    onAdd({ nombreCliente: cleanName, tipo })
    setNombreCliente('')
    setTipo('General')
    setError('')
  }

  function handleReset() {
    if (!onReset()) return
    setNombreCliente('')
    setTipo('General')
    setError('')
  }

  return (
    <section className="operator-panel" aria-labelledby="operator-title">
      <div className="operator-heading">
        <div>
          <p className="eyebrow">Estación de trabajo</p>
          <h2 id="operator-title">Panel del operador</h2>
        </div>
        <span className="operator-tag">Operador</span>
      </div>

      <form className="ticket-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="customer-name">Nombre de la persona</label>
        <input
          id="customer-name"
          name="nombreCliente"
          type="text"
          autoComplete="off"
          maxLength={60}
          placeholder="Ej. Camila Rojas"
          value={nombreCliente}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'name-error' : undefined}
          onChange={(event) => {
            setNombreCliente(event.target.value)
            if (error) setError('')
          }}
        />
        {error && <span className="field-error" id="name-error" role="alert">{error}</span>}

        <label htmlFor="attention-type">Tipo de atención</label>
        <select
          id="attention-type"
          name="tipo"
          value={tipo}
          onChange={(event) => setTipo(event.target.value)}
        >
          <option value="General">Atención general</option>
          <option value="Preferencial">Atención preferencial</option>
        </select>

        <button className="button button-primary" type="submit">
          <span aria-hidden="true">+</span> Registrar turno
        </button>
      </form>

      <div className="operator-actions">
        <button className="button button-call" type="button" onClick={onCallNext}>
          Llamar siguiente <span aria-hidden="true">&#8594;</span>
        </button>
        <button className="button button-reset" type="button" onClick={handleReset}>
          Reiniciar sistema
        </button>
      </div>
    </section>
  )
}