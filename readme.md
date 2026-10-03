# Sistema de Atención

Aplicación frontend para organizar turnos de atención presencial. Permite registrar personas, gestionar la fila, llamar al siguiente turno y consultar feriados nacionales del país de la sucursal. No utiliza backend.

## Equipo

- Leonardo Burgos.

## Problema y usuarios

Una sucursal necesita ordenar la atención y mostrar el estado de la fila. El operador administra los turnos; las personas que esperan pueden consultar el turno que se está atendiendo, la cola y el historial reciente.

## Funcionalidades

- Registrar turnos con nombre y tipo de atención general o preferencial; el formulario valida nombres vacíos.
- Asignar un módulo entre 1 y 5 al registrar el turno.
- Llamar al siguiente turno y actualizar el turno actual, la cola, el historial y los indicadores.
- Consultar los turnos en espera o atendidos.
- Guardar los turnos en `localStorage` para restaurarlos al recargar el navegador.
- Consultar los feriados nacionales por país, con estados de carga, error y reintento.
- Reiniciar la cola y el historial con confirmación.

## Diseño

La propuesta de navegación, wireframe, jerarquía visual, flujos y componentes está en [docs/diseno-previo.md](docs/diseno-previo.md). La aplicación usa una vista única responsive para público y operador.

## Tecnologías

- React 19 y JSX.
- Vite 7 para desarrollo y compilación.
- JavaScript y CSS.
- Fetch API para consultar feriados.
- `localStorage` para persistencia local, sin backend.
- ESLint para validaciones estáticas.

## Ejecución

Requisito: Node.js 20.19 o posterior y npm. Desde la raíz del proyecto:

```sh
npm install
npm run dev
```

Abre la URL local que indique Vite, normalmente `http://localhost:5173/`. Para validar o generar la versión de producción:

```sh
npm run lint
npm run build
```

En Windows PowerShell, si la política del sistema bloquea `npm.ps1`, usa `npm.cmd` en lugar de `npm` (por ejemplo, `npm.cmd run dev`). Node.js también debe estar disponible en el `PATH` de la terminal.

## Estructura

```text
src/
	components/
		CurrentTurn.jsx
		HolidayNotice.jsx
		OperatorPanel.jsx
		QueuePanel.jsx
		Stats.jsx
	services/
		holidaysApi.js
	App.jsx
	App.css
	index.css
docs/
	diseno-previo.md
legacy/
	index.html
	css/styles.css
	js/app.js
index.html
```

La versión React/Vite es la aplicación principal. `legacy/` conserva la versión original HTML/CSS/JavaScript para consulta; no participa en el build de Vite.

## API pública

**Nager.Date Public Holidays API** aporta información útil para planificar la atención de una sucursal: permite advertir al operador sobre un feriado nacional en el país elegido.

- Documentación: [Nager.Date API](https://nagerholidays.com/Api).
- Países: `GET https://date.nager.at/api/v3/AvailableCountries`.
- Feriados: `GET https://nagerholidays.com/api/v4/Holidays/{CountryCode}/{Year}`.
- Parámetros: código de país ISO 3166-1 alfa-2 y año actual del navegador.
- Datos usados: código/nombre de país; fecha, nombre y condición de feriado nacional.
- Presentación: el selector y el resultado se muestran en el panel “Feriados nacionales”. Se indica el feriado de hoy o el siguiente feriado nacional.
- Autenticación: los endpoints comunitarios usados no requieren clave. Se necesita conexión a internet.
- Errores: si no se puede cargar la lista de países o el calendario, se presenta un mensaje y una acción para reintentar. La gestión de turnos sigue funcionando.
- Condiciones: consultar los [términos de uso](https://nagerholidays.com/legal/termsofservice) y la [licencia del proyecto](https://github.com/nager/Nager.Date/blob/main/LICENSE). La API v4 entrega el nombre del feriado en inglés; la fecha se presenta en español.

El endpoint de países corresponde a la API comunitaria v3, cuyo soporte oficial está anunciado hasta el 31 de enero de 2027. Revisar la migración de ese endpoint antes de esa fecha.

## Datos y limitaciones

- Los turnos se guardan solo en el navegador actual bajo la clave `appTurnos`; no se sincronizan entre dispositivos ni operadores.
- Reiniciar borra la cola, el historial y los contadores guardados.
- La consulta de feriados requiere internet. La indisponibilidad de la API no bloquea las funciones principales.
- El calendario muestra feriados nacionales, no confirma horarios de apertura de una sucursal ni todos los feriados regionales.
- La lista de países usa el endpoint v3 indicado en la sección API.

## Git y colaboración

El remoto `origin` apunta a [leo2121-tech/sistema-turnos](https://github.com/leo2121-tech/sistema-turnos). GitHub ya contiene `main`, `develop` y `feature/interfaz-turnos`. Esta entrega se preparará en una rama nueva `feature/react-migration` basada en `develop`; después de subirla, crear un Pull Request hacia `develop` para revisión.

## Uso de Inteligencia Artificial

- **Herramienta:** GitHub Copilot.
- **Propósito:** ayudar a comprender partes de la tarea que resultaban difíciles, especialmente cómo pasar la aplicación inicial basada en `index.html` y JavaScript a React con Vite. También se usó como apoyo para organizar componentes, integrar la API y resolver errores.
- **Consulta representativa (resumen):** “¿Cómo migro el sistema de turnos que ya tengo en HTML y JavaScript a React con Vite, conservando sus funciones?”. Es una síntesis, no una transcripción literal.
- **Resultado:** propuesta de componentes, interfaz React, persistencia local, consulta de feriados y estados de carga/error.
- **Revisión y cambios:** se verificaron endpoints con respuestas reales; se ejecutaron build y ESLint y se probó el flujo en navegador. El nombre institucional y la retirada de la frase promocional se ajustaron a petición del usuario.
- **Aprendizaje:** Leonardo debe completar antes de la defensa qué comprendió sobre la migración de `index.html` a Vite/React y qué partes revisó o modificó personalmente.
