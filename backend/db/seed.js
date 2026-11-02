require('dotenv').config();
const pool = require('./db');

const seedData = async () => {
    try {
        // Insertar Sucursal
        const sucursalRes = await pool.query(
            "INSERT INTO sucursales (nombre, direccion) VALUES ($1, $2) RETURNING id",
            ['Sucursal Viña del Mar', 'Calle Valparaíso 123']
        );
        const sucursalId = sucursalRes.rows[0].id;

        // Insertar Servicio de Caja
        await pool.query(
            "INSERT INTO servicios (nombre, prefijo, sucursal_id) VALUES ($1, $2, $3)",
            ['Atención de Caja', 'CAJ', sucursalId]
        );

        console.log('✅ Datos iniciales (Sucursal y Servicio) creados exitosamente');
    } catch (err) {
        console.error('❌ Error poblando datos:', err);
    } finally {
        pool.end();
    }
};

seedData();