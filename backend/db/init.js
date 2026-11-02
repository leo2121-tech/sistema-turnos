require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

const createTables = async () => {
    const queryText = `
        CREATE TABLE IF NOT EXISTS sucursales (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            direccion VARCHAR(200),
            estado VARCHAR(20) DEFAULT 'ACTIVA'
        );

        CREATE TABLE IF NOT EXISTS servicios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            prefijo VARCHAR(10) NOT NULL,
            sucursal_id INT REFERENCES sucursales(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS funcionarios (
            id SERIAL PRIMARY KEY,
            nombre VARCHAR(150) NOT NULL,
            rut VARCHAR(12) UNIQUE NOT NULL,
            rol VARCHAR(50) DEFAULT 'ATENCION'
        );

        CREATE TABLE IF NOT EXISTS modulos_atencion (
            id SERIAL PRIMARY KEY,
            numero_modulo INT NOT NULL,
            servicio_id INT REFERENCES servicios(id),
            funcionario_id INT REFERENCES funcionarios(id) ON DELETE SET NULL,
            estado VARCHAR(20) DEFAULT 'DISPONIBLE'
        );

        CREATE TABLE IF NOT EXISTS turnos (
            id SERIAL PRIMARY KEY,
            codigo VARCHAR(20) NOT NULL,
            estado VARCHAR(20) DEFAULT 'PENDIENTE',
            servicio_id INT REFERENCES servicios(id),
            modulo_id INT REFERENCES modulos_atencion(id),
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await pool.query(queryText);
        console.log('✅ Tablas creadas exitosamente en PostgreSQL');
    } catch (err) {
        console.error('❌ Error creando las tablas:', err);
    } finally {
        pool.end();
    }
};

createTables();