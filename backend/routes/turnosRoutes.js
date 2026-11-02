const express = require('express');
const router = express.Router();
const {
	emitirTurno,
	obtenerPendientes,
	llamarSiguiente,
	reiniciarSistema,
} = require('../controllers/turnosController');
/**
 * @swagger
 * /api/turnos/pendientes:
 *   get:
 *     summary: Obtiene todos los turnos en estado PENDIENTE
 *     responses:
 *       200:
 *         description: Lista de turnos pendientes
 * 
 * /api/turnos:
 *   post:
 *     summary: Emite un nuevo turno para un servicio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               servicio_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Turno creado exitosamente
 * 
 * /api/turnos/llamar:
 *   put:
 *     summary: Llama al siguiente turno pendiente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               modulo_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Turno llamado exitosamente
 *
 * /api/turnos/reiniciar:
 *   delete:
 *     summary: Elimina turnos pendientes y conserva atendidos y auditoría
 *     responses:
 *       200:
 *         description: Fila reiniciada
 */
// Crear un turno nuevo
router.post('/', emitirTurno);

// Obtener todos los turnos pendientes
router.get('/pendientes', obtenerPendientes);

// Llamar al siguiente turno
router.put('/llamar', llamarSiguiente);

// Eliminar los turnos pendientes
router.delete('/reiniciar', reiniciarSistema);

module.exports = router;