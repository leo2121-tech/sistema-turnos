# Sistema de Atención

Esta es una aplicación frontend diseñada para organizar turnos de atención presencial de manera ágil e intuitiva. Permite registrar usuarios, gestionar el avance de la fila, llamar al siguiente turno y consultar los feriados nacionales según el país de la sucursal. Todo funciona directamente en el navegador, sin necesidad de un backend.

## Equipo
- Leonardo Burgos

## Problema y Usuarios
El sistema está pensado para sucursales que necesitan ordenar su flujo de atención y mantener a las personas informadas sobre el estado de la fila. El operador es el encargado de administrar los turnos, mientras que los usuarios en la sala de espera pueden ver en pantalla qué turno se está atendiendo en ese momento, cómo avanza la cola y el historial de los últimos llamados.

## Funcionalidades
- **Registro de turnos:** Permite ingresar el nombre de la persona (validando que el campo no esté vacío) y definir si requiere atención general o preferencial.
- **Asignación de módulos:** Al crear el turno, se le asigna automáticamente un módulo del 1 al 5.
- **Gestión de la fila:** El operador puede llamar al siguiente turno, lo que actualiza de inmediato el turno actual, la lista de espera, el historial y las estadísticas visuales.
- **Consulta de estados:** Visualización clara de los turnos que siguen en espera y los que ya fueron atendidos.
- **Persistencia de datos:** Los turnos se guardan en el `localStorage`, garantizando que la información no se pierda si se recarga la página por accidente.
- **Consulta de feriados:** Integración para revisar feriados nacionales por país, incluyendo un manejo fluido de los estados de carga, errores de red y opciones de reintento.
- **Reinicio del sistema:** Opción para limpiar la cola y el historial por completo, protegida por un cuadro de confirmación para evitar borrados accidentales.

## Diseño
La planificación de la interfaz, que abarca la navegación, los wireframes, la jerarquía visual, los flujos y los componentes, se encuentra detallada en `docs/diseno-previo.md`. La aplicación está construida bajo una vista única y adaptable (responsive), sirviendo tanto para el público como para el operador desde la misma pantalla.

## Tecnologías
- React 19 y JSX
- Vite 7 (para el entorno de desarrollo y la compilación)
- JavaScript y CSS nativo
- Fetch API (para consumir la información de los feriados)
- `localStorage` (para guardar datos de forma local, prescindiendo de una base de datos)
- ESLint (para validaciones estáticas y mantener la calidad del código)

## Ejecución
Para correr el proyecto necesitas tener instalado Node.js (versión 20.19 o superior) y npm.

Sitúate en la carpeta raíz del proyecto y ejecuta en tu terminal:

```bash
npm install
npm run dev
