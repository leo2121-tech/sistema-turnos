require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const pool = require('./db/db');
const turnosRoutes = require('./routes/turnosRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de Swagger (OpenAPI 3.0)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Turnos',
            version: '1.0.0',
            description: 'Documentación de la API REST para el Hito 3'
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./routes/*.js']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Conexión a MongoDB (NoSQL - Bitácora de eventos)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/turnos_db';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Conexión e Inicialización automática de PostgreSQL (SQL - Transaccional)
const inicializarBaseDeDatos = async () => {
    try {
        // 1. Crear tablas si no existen
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sucursales (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                direccion VARCHAR(200)
            );

            CREATE TABLE IF NOT EXISTS servicios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                prefijo VARCHAR(10) NOT NULL,
                sucursal_id INTEGER REFERENCES sucursales(id)
            );

            CREATE TABLE IF NOT EXISTS modulos_atencion (
                id SERIAL PRIMARY KEY,
                numero_modulo INTEGER NOT NULL,
                servicio_id INTEGER REFERENCES servicios(id)
            );

            CREATE TABLE IF NOT EXISTS turnos (
                id SERIAL PRIMARY KEY,
                codigo VARCHAR(20) NOT NULL,
                estado VARCHAR(20) DEFAULT 'PENDIENTE',
                servicio_id INTEGER REFERENCES servicios(id),
                modulo_id INTEGER REFERENCES modulos_atencion(id),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Poblar datos iniciales (Sucursal 1, Servicio 1 y Módulos 1 al 6)
        await pool.query(`
            INSERT INTO sucursales (id, nombre, direccion)
            VALUES (1, 'Sucursal Central', 'Av. Principal 123')
            ON CONFLICT (id) DO NOTHING;

            INSERT INTO servicios (id, nombre, prefijo, sucursal_id)
            VALUES (1, 'Caja General', 'CAJ', 1)
            ON CONFLICT (id) DO NOTHING;

            INSERT INTO modulos_atencion (id, numero_modulo, servicio_id)
            VALUES
                (1, 1, 1),
                (2, 2, 1),
                (3, 3, 1),
                (4, 4, 1),
                (5, 5, 1),
                (6, 6, 1)
            ON CONFLICT (id) DO NOTHING;
        `);

        console.log('✅ Conectado a PostgreSQL (Tablas y módulos 1-6 listos)');
    } catch (error) {
        console.error('❌ Error al inicializar PostgreSQL (reintentando en 3s...):', error.message);
        setTimeout(inicializarBaseDeDatos, 3000);
    }
};

inicializarBaseDeDatos();

// Rutas de la API y Documentación
app.get('/', (req, res) => {
    res.send('Bienvenido a la API del Sistema de Turnos 🚀. Ve a /api-docs para ver la documentación.');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/turnos', turnosRoutes);

// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});