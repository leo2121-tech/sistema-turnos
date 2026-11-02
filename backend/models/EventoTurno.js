const mongoose = require('mongoose');

const eventoTurnoSchema = new mongoose.Schema({
    turno_codigo: { type: String, required: true },
    sucursal_id: { type: Number, required: true },
    accion: { type: String, required: true }, // Ej: 'EMITIDO', 'LLAMADO', 'FINALIZADO'
    detalles: { type: Object, default: {} },
    fecha_evento: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EventoTurno', eventoTurnoSchema);