require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
    apis: ['./routes/*.js'] // Le dice a Swagger dónde buscar la documentación
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const app = express();
const port = process.env.PORT || 3000;

// Middlewares obligatorios
app.use(cors());
app.use(express.json()); // Permite recibir JSON en las peticiones
const turnosRoutes = require('./routes/turnosRoutes');
app.use('/api/turnos', turnosRoutes);

// Conexión a PostgreSQL (Transaccional)
const pgPool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pgPool.connect()
    .then(() => console.log('✅ Conectado a PostgreSQL'))
    .catch(err => console.error('❌ Error conectando a PostgreSQL', err.stack));

// Conexión a MongoDB (Eventos y Trazabilidad)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error conectando a MongoDB', err));

// Endpoint de prueba
app.get('/api/health', (req, res) => {
    res.json({ estado: 'API del Sistema de Turnos funcionando 🚀' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.listen(port, () => {
    console.log(`Servidor backend corriendo en el puerto ${port}`);
});