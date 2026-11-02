const pool = require('../db/db');
const EventoTurno = require('../models/EventoTurno');

const emitirTurno = async (req, res) => {
    const { servicio_id } = req.body;

    try {
        // 1. Obtener la sucursal y el prefijo del servicio (Ej: "CAJ")
        const servicioRes = await pool.query(
            'SELECT prefijo, sucursal_id FROM servicios WHERE id = $1', 
            [servicio_id]
        );
        
        if (servicioRes.rows.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        const { prefijo, sucursal_id } = servicioRes.rows[0];

        // 2. Calcular el siguiente número para ese servicio
        const countRes = await pool.query(
            'SELECT COUNT(*) FROM turnos WHERE servicio_id = $1', 
            [servicio_id]
        );
        const numero = parseInt(countRes.rows[0].count) + 1;
        const codigo = `${prefijo}-${numero.toString().padStart(3, '0')}`; // Resultado: CAJ-001

        // 3. Persistencia SQL: Guardar el turno transaccional
        const insertTurno = await pool.query(
            'INSERT INTO turnos (codigo, servicio_id, estado) VALUES ($1, $2, $3) RETURNING *',
            [codigo, servicio_id, 'PENDIENTE']
        );
        const nuevoTurno = insertTurno.rows[0];

        // 4. Persistencia NoSQL: Registrar el evento de trazabilidad
        await EventoTurno.create({
            turno_codigo: nuevoTurno.codigo,
            sucursal_id: sucursal_id,
            accion: 'EMITIDO',
            detalles: { mensaje: 'Turno emitido exitosamente' }
        });

        // 5. Responder al frontend
        res.status(201).json(nuevoTurno);

    } catch (error) {
        console.error('Error al emitir turno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
// Obtener lista de turnos pendientes
const obtenerPendientes = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM turnos WHERE estado = 'PENDIENTE' ORDER BY fecha_creacion ASC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener pendientes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Llamar al siguiente turno en la fila
const llamarSiguiente = async (req, res) => {
    const { modulo_id } = req.body; // El ID del módulo que está llamando

    try {
        // 1. Buscar el turno pendiente más antiguo
        const buscarRes = await pool.query(
            "SELECT * FROM turnos WHERE estado = 'PENDIENTE' ORDER BY fecha_creacion ASC LIMIT 1"
        );

        if (buscarRes.rows.length === 0) {
            return res.status(404).json({ mensaje: 'No hay turnos pendientes en la fila' });
        }

        const turnoALlamar = buscarRes.rows[0];

        // 2. SQL: Actualizar el estado del turno a 'LLAMADO'
        const updateRes = await pool.query(
            "UPDATE turnos SET estado = 'LLAMADO', modulo_id = $1 WHERE id = $2 RETURNING *",
            [modulo_id || null, turnoALlamar.id]
        );
        const turnoActualizado = updateRes.rows[0];

        // 3. NoSQL: Registrar el evento de que fue llamado en MongoDB
        await EventoTurno.create({
            turno_codigo: turnoActualizado.codigo,
            sucursal_id: turnoActualizado.servicio_id, // Usamos el ID del servicio como referencia temporal
            accion: 'LLAMADO',
            detalles: { modulo_llamada: modulo_id, mensaje: 'Turno llamado a módulo' }
        });

        res.json(turnoActualizado);
    } catch (error) {
        console.error('Error al llamar turno:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
module.exports = { emitirTurno, obtenerPendientes, llamarSiguiente };