# Diseño previo: Sistema de atención y turnos

## Problema y usuarios

El sistema organiza la fila de una sucursal de atención presencial. El operador registra personas, llama al siguiente turno y consulta el estado de la fila; el público ve el turno atendido y las personas que esperan.

## Navegación y flujo principal

La aplicación tendrá una vista principal, sin navegación entre páginas. El panel público permitirá alternar entre la cola activa y el historial reciente. El panel del operador permanecerá disponible junto a esa información.

Flujo principal: abrir la vista -> registrar nombre y tipo de atención -> confirmar que el turno se agregó a la cola -> llamar al siguiente -> mostrar turno y módulo asignado -> guardar el turno en el historial.

Flujos secundarios:

- Validar el nombre antes de registrar un turno y mostrar el error junto al formulario.
- Consultar el calendario de feriados por país para advertir si la fecha de atención es festiva o mostrar el próximo feriado.
- Mostrar carga, error y opción de reintento si la API no está disponible.
- Confirmar antes de vaciar la cola y el historial al reiniciar.

## Wireframe

```text
ESCRITORIO
+------------------------------------------------------------+
| Turnos / Centro de atención       Calendario: país [v]     |
| Aviso de feriado, próximo feriado o estado de conexión     |
+-----------------------------------+------------------------+
| TURNO EN ATENCIÓN                 | PANEL DEL OPERADOR     |
|             001                   | Nombre                 |
|          Módulo 2                 | Tipo de atención       |
|                                   | [ Registrar turno ]   |
| [En espera] [Historial]           | [ Llamar siguiente ]   |
| 002  Nombre          General      | Espera        Atendidos|
| 003  Nombre      Preferencial     | [ Reiniciar ]         |
+-----------------------------------+------------------------+

MÓVIL
+---------------------------+
| Turnos / Atención         |
| Estado de feriados        |
| Turno actual y módulo     |
| Panel del operador        |
| Formulario y acciones     |
| Indicadores               |
| [En espera] [Historial]   |
| Lista de turnos           |
+---------------------------+
```

## Jerarquía visual

1. Turno que se está atendiendo y su módulo.
2. Acción principal del operador: registrar o llamar al siguiente.
3. Cola activa e historial, con número, nombre y tipo de atención.
4. Indicadores de espera y atenciones completadas.
5. Estado del calendario de feriados, visible pero secundario.

La propuesta visual usará fondo claro, texto de alto contraste y una combinación de verde azulado, coral y amarillo para distinguir acciones y estados. Se evitará reutilizar la paleta morada actual. La tipografía será legible en pantallas de atención y los números de turno tendrán una escala claramente dominante.

## Componentes previstos

- `App`: coordina estado global, persistencia y estructura de la vista.
- Encabezado de `App`: nombre del sistema y estado del servicio.
- `HolidayNotice`: selector de país, aviso de feriado y estados de carga/error.
- `CurrentTurn`: turno y módulo en atención.
- `QueuePanel`: pestañas de espera e historial, estados vacíos y filas de turnos.
- `OperatorPanel`: formulario, llamada, reinicio y validaciones.
- `Stats`: contadores derivados de la cola y el historial.
- `holidaysApi`: servicio separado para consultar países y feriados.

## Datos y estados

Los turnos serán objetos con número, nombre, tipo, módulo y fechas de creación y atención. La cola, el turno actual, el historial y los contadores se manejarán en estado React y se conservarán en `localStorage`. Los datos iniciales serán locales; no se implementará backend.

El calendario de feriados se consultará mediante `fetch` y tendrá estados de carga, resultado vacío/error y éxito. La información de la API complementa la operación: permite señalar días festivos en el territorio donde atiende la sucursal.

## API propuesta

- Nombre: Nager.Date Public Holidays API.
- Documentación oficial: https://nagerholidays.com/Api
- Países: `GET https://date.nager.at/api/v3/AvailableCountries`.
- Feriados: `GET https://nagerholidays.com/api/v4/Holidays/{countryCode}/{year}`.
- Datos mostrados: nombre, fecha y condición de feriado nacional (`nationalHoliday`).
- Uso en pantalla: seleccionar el país de la sucursal y mostrar el feriado de hoy o el siguiente feriado nacional.
- Método y acceso: GET público, sin clave; requiere conexión a internet.
- Manejo de fallos: conservar funcionales los turnos, informar que el calendario no se pudo cargar y permitir reintentar.

## Responsive y accesibilidad

En escritorio, la información pública ocupará el área principal y los controles del operador una columna lateral. En móvil, las secciones se apilarán; los botones y campos ocuparán el ancho disponible, el historial seguirá siendo accesible y ninguna acción dependerá solo del color.

Los campos tendrán etiquetas visibles, los mensajes se anunciarán como alertas y los controles podrán usarse con teclado. La interfaz contemplará estados vacíos, errores de validación, carga de calendario y confirmación de reinicio.