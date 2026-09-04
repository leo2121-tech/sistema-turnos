# Sistema de Atención y Gestión de Turnos

Un sistema web interactivo para gestionar turnos de atención al público (como farmacias, bancos, o clínicas).

## Características

- **Panel Público**: Muestra el turno actual en atención y la lista de espera
- **Panel de Operador**: Permite obtener nuevos turnos y llamar al siguiente cliente
- **Asignación Automática**: Los turnos se asignan a módulos aleatorios automáticamente
- **Persistencia**: Los datos se guardan en el navegador (localStorage)
- **Estadísticas**: Muestra contador de personas en espera y personas atendidas
- **Sonidos**: Efectos de sonido al pedir turno y al llamar
- **Responsive**: Interfaz adaptable a dispositivos móviles

## Estructura del Proyecto

```
sistema-turnos/
├── index.html          # Interfaz HTML
├── css/
│   └── styles.css      # Estilos personalizados (complementa Bootstrap)
├── js/
│   └── app.js          # Lógica de la aplicación
└── readme.md           # Este archivo
```

## Cómo Usar

1. Abre el archivo `index.html` en un navegador web
2. **Operador**: Haz clic en "Obtener Nuevo Turno" para crear un turno
3. **Operador**: Haz clic en "Llamar Siguiente Turno" para atender al cliente
4. **Público**: Observa el turno actual y espera tu turno en la lista

## Tecnologías Utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3**: Estilos personalizados con Bootstrap 5
- **JavaScript Vanilla**: Lógica sin dependencias externas (excepto Bootstrap)
- **Bootstrap 5**: Framework CSS para la interfaz

## Almacenamiento de Datos

Los datos se guardan automáticamente en:
- `localStorage.appTurnos`: Estado de la aplicación (turnos, contadores)

Los datos persisten mientras no se limpie el caché del navegador.

## Sonidos

- **Beep simple (800Hz)**: Al obtener un nuevo turno
- **Beep agudo (1000Hz)**: Al llamar el siguiente turno

Los sonidos se generan usando Web Audio API del navegador.

## Características Responsive

La interfaz se adapta automáticamente a:
- Pantallas grandes (desktops)
- Tablets
- Dispositivos móviles

## Correcciones Realizadas

- Se reemplazó el código incompleto original
- Se implementó la funcionalidad completa de turnos
- Se arreglaron todas las referencias del DOM
- Se agregaron estilos CSS compatibles con Bootstrap
- Se implementó persistencia de datos con localStorage
- Se agregaron efectos de sonido
- Se optimizó para dispositivos móviles

## Notas
- Los turnos son numerados secuencialmente (001, 002, 003, etc.)
- Los módulos se asignan aleatoriamente entre 1 y 5
- La información se reinicia si se limpia el caché del navegador
- No se requiere conexión a internet (aplicación completamente local)
#terminado#