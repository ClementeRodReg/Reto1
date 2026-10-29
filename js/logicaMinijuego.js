import { Carta } from './carta.js';
import { ejecutarTurnoIA } from './logicaOponenteIA.js';

// NUEVO: Variable global para controlar de quién es el turno activo ('jugador' o 'rival')
let turnoActual = 'jugador'; 

document.addEventListener("DOMContentLoaded", async () => {
    // Escucha el fin de la animación de introducción
    const header = document.querySelector("header");
    if (header) {
        header.addEventListener("animationend", (event) => {
            if (event.animationName === "introFight") {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                });
            }
        });
    }

    try {
        // 1. Cargar el JSON de las cartas
        const respuesta = await fetch('../json/cartas_valores.json'); 
        const baseDatosCartas = await respuesta.json();

        // 2. Generar los 10 IDs aleatorios únicos (del 1 al 110)
        const idsAleatorios = generarIdsUnicos(10, 1, 110);

        // 3. Crear las instancias de la clase Carta
        const cartasPartida = idsAleatorios.map(id => {
            const claveCard = `card_${id}`;
            const datosJson = baseDatosCartas[claveCard];
            
            if (!datosJson) {
                console.error(`La clave ${claveCard} no existe en el JSON.`);
                return new Carta({ norte: 1, sur: 1, este: 1, oeste: 1 }, "../img/blue.png", null);
            }

            const valoresIniciales = {
                norte: Number(datosJson.valores.arriba),
                sur: Number(datosJson.valores.abajo),
                este: Number(datosJson.valores.derecha),
                oeste: Number(datosJson.valores.izquierda)
            };

            const rutaImagen = `../img/cartas_triple_triad/card_${id}.png`;
            const nuevaCarta = new Carta(valoresIniciales, rutaImagen, null);
            nuevaCarta.nombre = String(datosJson.nombre);
            
            return nuevaCarta;
        });

        // 4. Repartir las cartas (5 para ti y 5 para el rival)
        const misCartas = cartasPartida.slice(0, 5);
        const susCartas = cartasPartida.slice(5, 10);

        // Asignar propietarios iniciales
        misCartas.forEach(c => c.propietario = 'azul');
        susCartas.forEach(c => c.propietario = 'rojo');

        // 5. Dibujar en la interfaz e inicializar marcadores oficiales (5 vs 5)
        renderizarCartasIniciales(misCartas, susCartas);
        actualizarMarcador();

    } catch (error) {
        console.error("Error al inicializar las cartas del minijuego:", error);
    }
});

/**
 * Función que genera un array de números aleatorios que no se repiten
 */
function generarIdsUnicos(cantidad, min, max) {
    const ids = new Set();
    while (ids.size < cantidad) {
        const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
        ids.add(numeroAleatorio);
    }
    return Array.from(ids);
}

/**
 * Función para pintar las imágenes superpuestas y sus valores numéricos en las esquinas
 */
function renderizarCartasIniciales(jugador, rival) {
    // Pintar tus cartas (Fondo Azul)
    jugador.forEach((carta, index) => {
        const contenedor = document.querySelector(`.tucarta${index + 1}`);
        if (contenedor) {
            contenedor.style.backgroundImage = `url('${carta.imagen}'), url('../img/blue.png')`;
            contenedor.innerHTML = creartHtmlValores(carta);
            contenedor.classList.add("carta-disponible");
            contenedor.dataset.indexMano = index;
        }
    });

    // Pintar sus cartas (Fondo Rojo)
    rival.forEach((carta, index) => {
        const contenedor = document.querySelector(`.sucarta${index + 1}`);
        if (contenedor) {
            contenedor.style.backgroundImage = `url('${carta.imagen}'), url('../img/red.png')`;
            contenedor.innerHTML = creartHtmlValores(carta);
            contenedor.classList.add("carta-rival-disponible"); 
            contenedor.dataset.indexMano = index;
        }
    });

    // Inicializamos los eventos de arrastre
    inicializarDragAndDrop(jugador, rival);
    
    // NUEVO: Ejecutamos el filtro inicial de turnos para que solo tú puedas moverte al empezar
    gestionarTurnosVisibles();
}

/**
 * Función auxiliar para generar la estructura HTML de la cruz de números.
 */
function creartHtmlValores(carta) {
    const n = carta.valores.norte;
    const s = carta.valores.sur;
    const e = carta.valores.este;
    const o = carta.valores.oeste;

    return `<div class="valores-carta">
    <span class="val-norte">${n}</span>
    <span class="val-oeste">${o}</span>
    <span class="val-este">${e}</span>
    <span class="val-sur">${s}</span>
    </div>`;
}

/**
 * NUEVO: Habilita o deshabilita la capacidad de arrastrar cartas basándose en el bando activo.
 */
function gestionarTurnosVisibles() {
    const cartasJugador = document.querySelectorAll(".carta-disponible");
    const cartasRival = document.querySelectorAll(".carta-rival-disponible");

    // Si es el turno del jugador, sus cartas son arrastrables. Las del rival se bloquean.
    cartasJugador.forEach(carta => {
        carta.setAttribute("draggable", turnoActual === 'jugador' ? "true" : "false");
        carta.style.cursor = turnoActual === 'jugador' ? "grab" : "not-allowed";
    });

    cartasRival.forEach(carta => {
        carta.setAttribute("draggable", turnoActual === 'rival' ? "true" : "false");
        carta.style.cursor = turnoActual === 'rival' ? "grab" : "not-allowed";
    });
}

/**
 * Inicializa los eventos de arrastrar y soltar para las cartas de ambos jugadores y el tablero
 */
function inicializarDragAndDrop(misCartas, susCartas) {
    const cartasJugador = document.querySelectorAll(".carta-disponible");
    const cartasRival = document.querySelectorAll(".carta-rival-disponible");
    const casillasTablero = document.querySelectorAll(".tableroGrid div");

    // Configurar arrastre para tus cartas (Azules)
    cartasJugador.forEach(carta => {
        carta.addEventListener("dragstart", (e) => {
            // DOBLE SEGURIDAD: Si no es su turno, cancelamos el arrastre inmediatamente
            if (turnoActual !== 'jugador') {
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData("text/plain", carta.dataset.indexMano);
            e.dataTransfer.setData("clase-origen", carta.className.split(" ")[0]);
            e.dataTransfer.setData("bando", "jugador"); 
            setTimeout(() => carta.style.opacity = "0.5", 0);
        });
        carta.addEventListener("dragend", (e) => carta.style.opacity = "1");
    });

    // Configurar arrastre para las cartas del rival (Rojas)
    cartasRival.forEach(carta => {
        carta.addEventListener("dragstart", (e) => {
            // DOBLE SEGURIDAD: Si no es el turno del rival, cancelamos el arrastre inmediatamente
            if (turnoActual !== 'rival') {
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData("text/plain", carta.dataset.indexMano);
            e.dataTransfer.setData("clase-origen", carta.className.split(" ")[0]);
            e.dataTransfer.setData("bando", "rival"); 
            setTimeout(() => carta.style.opacity = "0.5", 0);
        });
        carta.addEventListener("dragend", (e) => carta.style.opacity = "1");
    });

    // Eventos sobre las casillas del tablero
    casillasTablero.forEach(casilla => {
        casilla.addEventListener("dragover", (e) => e.preventDefault());

        casilla.addEventListener("dragenter", (e) => {
            e.preventDefault();
            if (!casilla.dataset.ocupada) {
                casilla.style.backgroundColor = "rgba(254, 254, 254, 0.15)";
                casilla.style.border = "2px solid #ffffff";
            }
        });

        casilla.addEventListener("dragleave", () => {
            if (!casilla.dataset.ocupada) {
                casilla.style.backgroundColor = "rgba(24, 25, 58, 0.3)";
                casilla.style.border = "1px solid rgba(204, 204, 204, 0.4)";
            }
        });

        casilla.addEventListener("drop", (e) => {
            e.preventDefault();

            if (casilla.dataset.ocupada) return;

            const bando = e.dataTransfer.getData("bando");
            const indexMano = e.dataTransfer.getData("text/plain");
            const claseOrigen = e.dataTransfer.getData("clase-origen");
            const contenedorOrigen = document.querySelector(`.${claseOrigen}`);
            
            const datosCarta = (bando === "jugador") ? misCartas[indexMano] : susCartas[indexMano];

            if (contenedorOrigen && datosCarta) {
                casilla.style.backgroundImage = contenedorOrigen.style.backgroundImage;
                casilla.style.backgroundSize = "cover"; 
                casilla.innerHTML = contenedorOrigen.innerHTML;
                
                casilla.dataset.ocupada = "true";
                casilla.style.backgroundColor = "transparent";
                casilla.style.border = "1px solid rgba(204, 204, 204, 0.4)";
                
                casilla.cartaData = datosCarta; 

                contenedorOrigen.style.backgroundImage = "none";
                contenedorOrigen.innerHTML = "";
                contenedorOrigen.removeAttribute("draggable");
                contenedorOrigen.classList.remove("carta-disponible", "carta-rival-disponible");

                const clasesCasilla = casilla.className.split(" ");
                const claseHueco = clasesCasilla.find(c => c.startsWith("hueco-"));
                
                if (claseHueco) {
                    const [, fila, columna] = claseHueco.split("-").map(Number);
                    ejecutarCombate(fila, columna, casilla);
                }

                // Alternancia estricta de turnos tras colocar la carta con éxito
                turnoActual = (turnoActual === 'jugador') ? 'rival' : 'jugador';
                console.log(`Cambio de turno realizado. Ahora le toca a: ${turnoActual}`);

                // Actualizamos los permisos de arrastre visuales en las manos
                gestionarTurnosVisibles();

                // NUEVO: Invocamos la lógica externa pasándole las funciones que necesita ejecutar
                if (turnoActual === 'rival') {
                    ejecutarTurnoIA(
                        misCartas, 
                        susCartas, 
                        ejecutarCombate, 
                        gestionarTurnosVisibles, 
                        () => { turnoActual = 'jugador'; console.log(`[IA] Turno devuelto a: ${turnoActual}`); }
                    );

                }
            }
        });
    });
}

/**
 * Comprueba las cartas adyacentes a la carta recién colocada y las voltea si sus valores son menores.
 */
function ejecutarCombate(fila, columna, casillaActual) {
    const cartaActual = casillaActual.cartaData;
    if (!cartaActual) return;

    const direcciones = [
        { f: -1, c: 0, caraAtacante: 'norte', caraDefensora: 'sur',   selector: `.hueco-${fila - 1}-${columna}` }, 
        { f: 1,  c: 0, caraAtacante: 'sur',   caraDefensora: 'norte', selector: `.hueco-${fila + 1}-${columna}` }, 
        { f: 0,  c: -1, caraAtacante: 'oeste', caraDefensora: 'este',  selector: `.hueco-${fila}-${columna - 1}` }, 
        { f: 0,  c: 1,  caraAtacante: 'este',  caraDefensora: 'oeste', selector: `.hueco-${fila}-${columna + 1}` }  
    ];

    direcciones.forEach(dir => {
        const casillaVecina = document.querySelector(dir.selector);
        
        if (casillaVecina && casillaVecina.dataset.ocupada === "true" && casillaVecina.cartaData) {
            const cartaVecina = casillaVecina.cartaData;

            if (cartaVecina.propietario !== cartaActual.propietario) {
                const valorAtacante = Number(cartaActual.valores[dir.caraAtacante]);
                const valorDefensor = Number(cartaVecina.valores[dir.caraDefensora]); 

                if (valorAtacante > valorDefensor) {
                    cartaVecina.cambiarPropietario(); // Cambia 'azul' <-> 'rojo'

                    // 1. Añadimos la clase de animación 3D a la casilla vecina capturada
                    casillaVecina.classList.add("animacion-volteo");

                    // 2. Esperamos exactamente 250ms (cuando la carta está de perfil a 90 grados)
                    // para cambiar la imagen de fondo de forma invisible para el ojo
                    setTimeout(() => {
                        const colorFondoNuevo = (cartaVecina.propietario === 'azul') ? 'blue.png' : 'red.png';
                        casillaVecina.style.backgroundImage = `url('${cartaVecina.imagen}'), url('../img/${colorFondoNuevo}')`;
                    }, 250);

                    // 3. Cuando la animación termina por completo (500ms), limpiamos la clase
                    // para que la carta pueda volver a ser volteada en futuros turnos si es atacada de nuevo
                    setTimeout(() => {
                        casillaVecina.classList.remove("animacion-volteo");
                    }, 500);
                    
                    console.log(`¡Carta volteada en 3D! Nueva propiedad: ${cartaVecina.propietario}`);
                }
            }
        }
    });

    actualizarMarcador();
}

/**
 * Cuenta las cartas totales en la mano y el tablero para actualizar el marcador con las normas oficiales
 * e inspecciona si el tablero se ha llenado para declarar el Fin de Partida.
 */
function actualizarMarcador() {
    let enTableroAzul = 0;
    let enTableroRojo = 0;
    let casillasOcupadas = 0; // NUEVO: Contador de celdas llenas

    document.querySelectorAll(".tableroGrid div").forEach(casilla => {
        if (casilla.dataset.ocupada === "true" && casilla.cartaData) {
            casillasOcupadas++; // Sumamos una casilla ocupada
            if (casilla.cartaData.propietario === 'azul') enTableroAzul++;
            if (casilla.cartaData.propietario === 'rojo') enTableroRojo++;
        }
    });

    const cartasRestantesAzul = document.querySelectorAll('.tusCartas .carta-disponible').length;
    const cartasRestantesRojo = document.querySelectorAll('.susCartas .carta-rival-disponible').length;

    const puntuacionTotalAzul = enTableroAzul + cartasRestantesAzul;
    const puntuacionTotalRojo = enTableroRojo + cartasRestantesRojo;

    const tuPunt = document.querySelector(".tuPuntuacion");
    const suPunt = document.querySelector(".suPuntuacion");
    
    if (tuPunt) tuPunt.textContent = puntuacionTotalAzul;
    if (suPunt) suPunt.textContent = puntuacionTotalRojo;

    // NUEVO: Si las 9 casillas están llenas, ejecutamos el desenlace de la partida
    if (casillasOcupadas === 9) {
        evaluarFinPartida(puntuacionTotalAzul, puntuacionTotalRojo);
    }
}

/**
 * Compara las puntuaciones finales, congela los turnos, actualiza las estadísticas 
 * e inyecta la subida de nivel estilo RPG en el cartel final.
 */
function evaluarFinPartida(puntosAzul, puntosRojo) {
    turnoActual = 'finalizado';
    gestionarTurnosVisibles();

    let tituloHTML = "";
    let claseResultado = "";
    let subtitulo = `Marcador final: ${puntosAzul} a ${puntosRojo}`;

    // 1. CAPTURAR DATOS ANTES Y DESPUÉS PARA EL LEVEL UP
    let datosSesion = obtenerCookieUsuario();
    
    // Si no hay usuario logueado, creamos un objeto temporal vacío para que no rompa el código
    if (!datosSesion) {
        datosSesion = { usuario: "Invitado", victorias: 0, derrotas: 0, empates: 0, puntos: 0, logeado: false };
    }

    // Guardamos la foto del estado "Viejo" antes de mutar la cookie
    const v_ant = datosSesion.victorias || 0;
    const d_ant = datosSesion.derrotas || 0;
    const e_ant = datosSesion.empates || 0;
    const p_ant = datosSesion.puntos || 0;
    
    const partidas_ant = v_ant + d_ant + e_ant;
    const winrate_ant = partidas_ant > 0 ? Math.round((v_ant / partidas_ant) * 100) : 0;

    // Variables para el bloque visual que se va a pintar
    let lineaEstadisticaHTML = "";

    // 2. PROCESAR EL DESENLACE Y APLICAR SUMAS
    if (puntosAzul > puntosRojo) {
        claseResultado = "resultado-victoria";
        tituloHTML = Array.from("VICTORIA").map(letra => `<span>${letra}</span>`).join("");
            
        if (datosSesion.logeado) {
            datosSesion.victorias = v_ant + 1;
            datosSesion.puntos = p_ant + 3;
        }
        
        // Cálculos post-mutación
        const partidas_new = datosSesion.victorias + d_ant + e_ant;
        const winrate_new = Math.round((datosSesion.victorias / partidas_new) * 100);

        lineaEstadisticaHTML = `
            <div class="fila-rpg-stat"><span>victorias</span> <span>${v_ant}</span> <span class="flecha-rpg">➔</span> <span class="stat-sube">${datosSesion.victorias}</span></div>
            <div class="fila-rpg-stat"><span>winrate</span> <span>${winrate_ant}%</span> <span class="flecha-rpg">➔</span> <span class="stat-sube">${winrate_new}%</span></div>
            <div class="fila-rpg-stat"><span>puntos</span> <span>${p_ant}</span> <span class="flecha-rpg">➔</span> <span class="stat-sube">${datosSesion.puntos}</span></div>
        `;
            
    } else if (puntosRojo > puntosAzul) {
        claseResultado = "resultado-derrota";
        tituloHTML = "DERROTA";
        
        if (datosSesion.logeado) {
            datosSesion.derrotas = d_ant + 1;
        }

        const partidas_new = v_ant + datosSesion.derrotas + e_ant;
        const winrate_new = Math.round((v_ant / partidas_new) * 100);

        lineaEstadisticaHTML = `
            <div class="fila-rpg-stat"><span>derrotas</span> <span>${d_ant}</span> <span class="flecha-rpg">➔</span> <span class="stat-baja">${datosSesion.derrotas}</span></div>
            <div class="fila-rpg-stat"><span>winrate</span> <span>${winrate_ant}%</span> <span class="flecha-rpg">➔</span> <span class="stat-baja">${winrate_new}%</span></div>
            <div class="fila-rpg-stat"><span>puntos</span> <span>${p_ant}</span> <span class="flecha-rpg">➔</span> <span class="stat-neutral">${p_ant}</span></div>
        `;
    } else {
        claseResultado = "resultado-empate";
        tituloHTML = "EMPATE";
        
        if (datosSesion.logeado) {
            datosSesion.empates = e_ant + 1;
            datosSesion.puntos = p_ant + 1;
        }

        const partidas_new = v_ant + d_ant + datosSesion.empates;
        const winrate_new = Math.round((v_ant / partidas_new) * 100);
        
        // Si el winrate baja por el empate se pinta rojo, si sube azul, si se queda igual neutral
        const claseWinrateEmpate = winrate_new > winrate_ant ? "stat-sube" : (winrate_new < winrate_ant ? "stat-baja" : "stat-neutral");

        lineaEstadisticaHTML = `
            <div class="fila-rpg-stat"><span>empates</span> <span>${e_ant}</span> <span class="flecha-rpg">➔</span> <span class="stat-neutral">${datosSesion.empates}</span></div>
            <div class="fila-rpg-stat"><span>winrate</span> <span>${winrate_ant}%</span> <span class="flecha-rpg">➔</span> <span class="${claseWinrateEmpate}">${winrate_new}%</span></div>
            <div class="fila-rpg-stat"><span>puntos</span> <span>${p_ant}</span> <span class="flecha-rpg">➔</span> <span class="stat-sube">${datosSesion.puntos}</span></div>
        `;
    }

    // Guardar los datos si el usuario está registrado
    if (datosSesion.logeado) {
        // 1. Guardamos en su cookie de sesión activa
        guardarCookieUsuario(datosSesion);

        // 2. NUEVO: Buscamos y actualizamos su récord en la lista global de registrados del ranking
        let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        const idx = usuariosRegistrados.findIndex(u => u.usuario.toLowerCase() === datosSesion.usuario.toLowerCase());
        if (idx !== -1) {
            usuariosRegistrados[idx].victorias = datosSesion.victorias;
            usuariosRegistrados[idx].derrotas = datosSesion.derrotas;
            usuariosRegistrados[idx].empates = datosSesion.empates;
            usuariosRegistrados[idx].puntos = datosSesion.puntos;
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuariosRegistrados));
            console.log(`[Ranking Global] Estadísticas sincronizadas para ${datosSesion.usuario}`);
        }
    }

    // 3. INYECTAR PANEL DE ESTADÍSTICAS RPG EN EL CARTEL FINAL
    const cartel = document.createElement("div");
    cartel.className = "cartel-final";
    
    cartel.innerHTML = `
        <h1 class="${claseResultado}">${tituloHTML}</h1>
        <p class="marcador-texto">${subtitulo}</p>
        
        <!-- BLOQUE DE SUBIDA DE NIVEL RPG -->
        <div class="contenedor-stats-rpg">
            <h3 class="titulo-stats-rpg">Estadísticas</h3>
            <div class="tabla-stats-rpg">
                ${lineaEstadisticaHTML}
            </div>
        </div>

        <div class="contenedor-botones-final">
            <button class="btn-final btn-volver" onclick="window.location.href='index.html'">Inicio</button>
            <button class="btn-reiniciar" onclick="window.location.reload()">Jugar otra vez</button>
            <button class="btn-final btn-ranking" onclick="window.location.href='ranking.html'">Ranking</button>
        </div>
    `;

    document.body.appendChild(cartel);
}


// --- FUNCIONES AUXILIARES PARA PASAR AL FINAL DEL ARCHIVO LOGICAMINIJUEGO.JS ---

function obtenerCookieUsuario() {
    const nombreCookie = "usuario_session=";
    const cookiesSeparadas = document.cookie.split(';');
    
    for (let i = 0; i < cookiesSeparadas.length; i++) {
        let c = cookiesSeparadas[i].trim();
        if (c.indexOf(nombreCookie) === 0) {
            try {
                const jsonTexto = decodeURIComponent(c.substring(nombreCookie.length, c.length));
                return JSON.parse(jsonTexto);
            } catch (error) {
                console.error("Error al procesar la cookie en el minijuego:", error);
                return null;
            }
        }
    }
    return null;
}

function guardarCookieUsuario(objetoUsuario) {
    const diasExpiracion = 7;
    const d = new Date();
    d.setTime(d.getTime() + (diasExpiracion * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = "usuario_session=" + encodeURIComponent(JSON.stringify(objetoUsuario)) + ";" + expires + ";path=/";
}
