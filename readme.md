# Sistema de Atención y Turnos

Aplicación full stack para administrar una fila de atención con React, Express, PostgreSQL y MongoDB.

## Requisitos

- Docker y Docker Compose.

## Ejecución con Docker Compose

Desde la raíz del repositorio:

```bash
docker-compose up --build
```

La configuración de desarrollo usa `admin`, `adminpassword` y `sistema_turnos` por defecto. Para personalizarlos, crea un `.env` en la raíz con `PG_USER`, `PG_PASSWORD` y `PG_DB`. No subas ese archivo al repositorio.

- Frontend: http://localhost:5173
- API: http://localhost:3000/api/health
- Swagger: http://localhost:3000/api-docs

Para ejecutar el backend directamente fuera de Docker, crea `backend/.env` basándote en `backend/.env.example`.

## Funcionalidades

- Registro, consulta y llamado de turnos con persistencia en PostgreSQL.
- Registro de eventos de emisión y llamado en MongoDB.
- Reinicio de fila que elimina solo turnos pendientes y conserva los atendidos y la auditoría.
- Consulta de feriados nacionales.

El diseño de interfaz se documenta en `docs/diseno-previo.md`.