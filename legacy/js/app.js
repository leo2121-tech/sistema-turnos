// Sistema de Atención y Turnos

const app = {
    turnoActual: null,
    turnosEnEspera: [],
    turnosAtendidos: 0,
    contador: 0
};

const btnLlamar = document.getElementById('btn-llamar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const turnoActualDisplay = document.getElementById('turno-actual');
const moduloActualDisplay = document.getElementById('modulo-actual');
const listaEspera = document.getElementById('lista-espera');
const contadorEspera = document.getElementById('contador-espera');
const contadorAtendidos = document.getElementById('contador-atendidos');
const formTurno = document.getElementById('form-turno');
const nombreClienteInput = document.getElementById('nombre-cliente');
const tipoAtencion = document.querySelector('#tipo-atencion');
const contenedorMensajes = document.querySelector('#contenedor-mensajes');

document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarPantalla();
});

formTurno?.addEventListener('submit', (event) => {
    event.preventDefault();
    pedirTurno();
});

btnLlamar?.addEventListener('click', llamarSiguienteTurno);
btnReiniciar?.addEventListener('click', reiniciarSistema);

function reiniciarSistema() {
    app.turnoActual = null;
    app.turnosEnEspera = [];
    app.turnosAtendidos = 0;
    app.contador = 0;

    guardarDatos();
    actualizarPantalla();
    mostrarMensaje('Sistema reiniciado y cola eliminada.', 'info');
}

function pedirTurno() {
    const nombreCliente = nombreClienteInput ? nombreClienteInput.value.trim() : '';
    const tipo = tipoAtencion ? tipoAtencion.value : 'General';

    if (!nombreCliente) {
        mostrarMensaje('Debes escribir el nombre del cliente.', 'warning');
        nombreClienteInput?.focus();
        return;
    }

    app.contador++;
    const nuevoTurno = {
        numero: app.contador,
        modulo: obtenerModuloAleatorio(),
        tipo,
        nombreCliente,
        timestamp: new Date()
    };

    app.turnosEnEspera.push(nuevoTurno);
    guardarDatos();
    actualizarPantalla();
    reproducirSonido();
    mostrarMensaje(`Turno ${nuevoTurno.numero} (${tipo}) generado para ${nombreCliente}.`, 'success');

    if (formTurno) {
        formTurno.reset();
        tipoAtencion.value = 'General';
        nombreClienteInput.focus();
    }
}

function llamarSiguienteTurno() {
    if (app.turnosEnEspera.length === 0) {
        mostrarMensaje('No hay turnos en espera.', 'warning');
        return;
    }

    app.turnoActual = app.turnosEnEspera.shift();
    app.turnosAtendidos++;
    guardarDatos();
    actualizarPantalla();
    reproducirSonidoLlamada();
    mostrarMensaje(`Se llamó al turno ${app.turnoActual.numero}.`, 'info');
}

function actualizarPantalla() {
    if (app.turnoActual) {
        turnoActualDisplay.textContent = String(app.turnoActual.numero).padStart(3, '0');
        moduloActualDisplay.textContent = `Módulo ${app.turnoActual.modulo}`;
    } else {
        turnoActualDisplay.textContent = '---';
        moduloActualDisplay.textContent = 'Módulo ---';
    }

    if (listaEspera) {
        listaEspera.innerHTML = app.turnosEnEspera.length
            ? app.turnosEnEspera.map(turno => {
                const tipo = turno.tipo || 'General';
                const badgeClass = tipo === 'Preferencial' ? 'bg-danger' : 'bg-secondary';

                return `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <span class="d-block">${turno.numero}</span>
                            <small class="text-muted fw-normal">${turno.nombreCliente || 'Cliente sin nombre'}</small>
                        </div>
                        <span class="badge ${badgeClass} rounded-pill text-uppercase" style="font-size: 0.7rem;">${tipo}</span>
                    </li>
                `;
            }).join('')
            : '<li class="list-group-item text-muted text-center">Sin personas en espera</li>';
    }

    if (contadorEspera) contadorEspera.textContent = app.turnosEnEspera.length;
    if (contadorAtendidos) contadorAtendidos.textContent = app.turnosAtendidos;
}

function obtenerModuloAleatorio() {
    const modulos = [1, 2, 3, 4, 5];
    return modulos[Math.floor(Math.random() * modulos.length)];
}

function guardarDatos() {
    localStorage.setItem('appTurnos', JSON.stringify({
        turnoActual: app.turnoActual,
        turnosEnEspera: app.turnosEnEspera,
        turnosAtendidos: app.turnosAtendidos,
        contador: app.contador
    }));
}

function cargarDatos() {
    const datosGuardados = localStorage.getItem('appTurnos');
    if (!datosGuardados) return;

    try {
        const datos = JSON.parse(datosGuardados);
        app.turnoActual = datos.turnoActual || null;
        app.turnosEnEspera = datos.turnosEnEspera || [];
        app.turnosAtendidos = datos.turnosAtendidos || 0;
        app.contador = datos.contador || 0;
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

function reproducirSonido() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio no disponible', e);
    }
}

function reproducirSonidoLlamada() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.frequency.value = 1000;
        oscillator.type = 'sine';

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
    } catch (e) {
        console.log('Audio no disponible', e);
    }
}

function mostrarMensaje(texto, tipo) {
    if (!contenedorMensajes) return;

    contenedorMensajes.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    setTimeout(() => {
        contenedorMensajes.innerHTML = '';
    }, 3000);
}