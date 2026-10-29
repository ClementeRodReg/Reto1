/**
 * Extrae todos los usuarios reales registrados en el sistema y los combina con los bots de ejemplo
 * SOLO si no se ha activado el filtrado de quitar los de pega.
 */
function obtenerListaClasificacion() {
  const botsEjemplo = [
    { usuario: "Shadow", victorias: 25, derrotas: 3, empates: 0, puntos: 75},
    { usuario: "Dragon", victorias: 22, derrotas: 5, empates: 1, puntos: 61},
    { usuario: "Phoenix", victorias: 20, derrotas: 6, empates: 2, puntos: 62},
    { usuario: "Ninja", victorias: 18, derrotas: 7, empates: 0, puntos: 54},
    { usuario: "Titan", victorias: 16, derrotas: 8, empates: 3, puntos: 52},
    { usuario: "Storm", victorias: 14, derrotas: 9, empates: 1, puntos: 43},
    { usuario: "Wolf", victorias: 12, derrotas: 10, empates: 2, puntos: 39},
    { usuario: "Blaze", victorias: 10, derrotas: 11, empates: 0, puntos: 30},
    { usuario: "Ghost", victorias: 8, derrotas: 12, empates: 1, puntos: 25},
    { usuario: "Raven", victorias: 5, derrotas: 15, empates: 0, puntos: 15}
  ];

  // 1. Recuperamos la lista de TODOS los usuarios reales registrados
  let usuariosReales = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
  
  usuariosReales.forEach(u => u.esUsuarioActual = false);

  // 2. Leemos la cookie de sesión para saber quién está jugando AHORA MISMO
  const sesionActiva = obtenerCookieUsuario();
  if (sesionActiva && sesionActiva.logeado) {
    const indexActual = usuariosReales.findIndex(u => u.usuario.toLowerCase() === sesionActiva.usuario.toLowerCase());
    if (indexActual !== -1) {
      usuariosReales[indexActual].victorias = sesionActiva.victorias;
      usuariosReales[indexActual].derrotas = sesionActiva.derrotas;
      usuariosReales[indexActual].empates = sesionActiva.empates;
      usuariosReales[indexActual].puntos = sesionActiva.puntos || 0; 
      usuariosReales[indexActual].esUsuarioActual = true; 
    }
  }

  // Marcar a todos los usuarios que vienen de la base de datos local real
  usuariosReales.forEach(u => u.esJugadorReal = true);

  // 3. Fusionar o quitar bots según el botón de la interfaz
  let listaCompleta = [...usuariosReales];
  const ocultarBots = localStorage.getItem("ranking_ocultar_bots") === "true";

  if (!ocultarBots) {
    botsEjemplo.forEach(bot => {
      const existeYa = listaCompleta.some(u => u.usuario.toLowerCase() === bot.usuario.toLowerCase());
      if (!existeYa) {
        listaCompleta.push(bot);
      }
    });
  }

  // 4. Calculamos el winrate matemático
  listaCompleta.forEach(competidor => {
    const partidasTotales = competidor.victorias + competidor.derrotas + (competidor.empates || 0);
    competidor.winrateNumerico = partidasTotales > 0 ? (competidor.victorias / partidasTotales) * 100 : 0;
    competidor.porcentajeText = `${Math.round(competidor.winrateNumerico)}%`;
    
    if (competidor.puntos === undefined) competidor.puntos = 0;
  });

  // Ordenamos la tabla de forma descendente basándonos en los PUNTOS acumulados
  listaCompleta.sort((a, b) => b.puntos - a.puntos);

  return listaCompleta;
}

document.addEventListener("DOMContentLoaded", () => {
  rellenarTabla();

  // El botón de resetear ahora quita o pone los usuarios de pega de forma dinámica
  const botonResetear = document.getElementById("botonResetear");
  if (botonResetear) {
    const botsOcultosActualmente = localStorage.getItem("ranking_ocultar_bots") === "true";
    botonResetear.textContent = botsOcultosActualmente ? "Mostrar Pega" : "Quitar Pega";

    botonResetear.addEventListener("click", () => {
      const estadoActual = localStorage.getItem("ranking_ocultar_bots") === "true";
      
      if (!estadoActual) {
        if (confirm("¿Deseas ocultar todos los usuarios de pega del ranking y ver solo a los reales?")) {
          localStorage.setItem("ranking_ocultar_bots", "true");
          botonResetear.textContent = "Mostrar Pega";
          rellenarTabla();
        }
      } else {
        localStorage.setItem("ranking_ocultar_bots", "false");
        botonResetear.textContent = "Quitar Pega";
        rellenarTabla();
      }
    });
  }

  const botonVolver = document.getElementById("botonVolver");
  if (botonVolver) {
    botonVolver.addEventListener("click", () => { window.location.href = "index.html"; });
  }

  // Controles por teclado estándar y auto-foco rápido acelerado
  const botones = document.querySelectorAll(".contenedorBotonesRanking button");
  let indexActual = 0;
  setTimeout(() => {
    if (botones.length > 0 && !document.activeElement.matches("button")) { 
      botones[indexActual].focus({ preventScroll: true }); 
    }
  }, 1200);

  document.addEventListener("keydown", (e) => {
    if (botones.length === 0) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault(); indexActual = (indexActual + 1) % botones.length; botones[indexActual].focus({ preventScroll: true });
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault(); indexActual = (indexActual - 1 + botones.length) % botones.length; botones[indexActual].focus({ preventScroll: true });
    }
  });

  botones.forEach((boton, index) => {
    boton.addEventListener("mouseenter", () => { boton.focus(); indexActual = index; });
  });
});

function rellenarTabla() {
  const listaClasificada = obtenerListaClasificacion();
  const tabla = document.getElementById("tBody");
  tabla.innerHTML = "";

  const filasAMostrar = Math.min(listaClasificada.length, 10);

  for (let i = 0; i < filasAMostrar; i++) {
    const nuevaFila = tabla.insertRow();
    const celdaPosicion = nuevaFila.insertCell();
    const celdaUsuarios = nuevaFila.insertCell();
    const celdaVictorias = nuevaFila.insertCell();
    const celdaDerrotas = nuevaFila.insertCell();
    const celdaEmpates = nuevaFila.insertCell(); 
    const celdaPuntos = nuevaFila.insertCell(); 
    const celdaPorcentaje = nuevaFila.insertCell();

    celdaPosicion.textContent = i + 1;
    const datosFila = listaClasificada[i];

    if (datosFila != null) {
      celdaUsuarios.textContent = datosFila.usuario;
      celdaVictorias.textContent = datosFila.victorias;
      celdaDerrotas.textContent = datosFila.derrotas;
      celdaEmpates.textContent = datosFila.empates; 
      celdaPuntos.textContent = datosFila.puntos; 
      celdaPorcentaje.textContent = datosFila.porcentajeText;

      celdaEmpates.style.color = "#a0a5d0"; 
      celdaPuntos.style.color = "#3a86ff"; 
      celdaPuntos.style.fontWeight = "bold";

      if (datosFila.esUsuarioActual) {
        nuevaFila.style.backgroundColor = "rgba(58, 134, 255, 0.18)"; 
        celdaUsuarios.classList.add("nombre-jugador-pulsante"); 
      } else if (datosFila.esJugadorReal) {
        celdaUsuarios.style.color = "#cbd5e1";
        nuevaFila.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
      }
    }
  }

  if (listaClasificada.length === 0) {
    const filaVacia = tabla.insertRow();
    const celdaAlerta = filaVacia.insertCell();
    celdaAlerta.textContent = "No hay héroes reales registrados en el sistema.";
    celdaAlerta.colSpan = 7;
    celdaAlerta.style.textAlign = "center";
    celdaAlerta.style.padding = "20px";
    celdaAlerta.style.color = "#a0a5d0";
  }

  const posicionRealGlobal = listaClasificada.findIndex(u => u.esUsuarioActual === true);
  if (posicionRealGlobal >= filasAMostrar && posicionRealGlobal !== -1) {
    const datosTuUsuario = listaClasificada[posicionRealGlobal];

    const filaSeparadora = tabla.insertRow();
    const celdaPuntosSuspivos = filaSeparadora.insertCell();
    celdaPuntosSuspivos.textContent = "...";
    celdaPuntosSuspivos.style.color = "#5d64a4";
    for (let j = 0; j < 6; j++) filaSeparadora.insertCell().textContent = "";

    const tuFilaEspecial = tabla.insertRow();
    const celdaTuPos = tuFilaEspecial.insertCell();
    const celdaTuUser = tuFilaEspecial.insertCell();
    const celdaTuVic = tuFilaEspecial.insertCell();
    const celdaTuDer = tuFilaEspecial.insertCell();
    const celdaTuEmp = tuFilaEspecial.insertCell();
    const celdaTuPts = tuFilaEspecial.insertCell();
    const celdaTuPorc = tuFilaEspecial.insertCell();

    celdaTuPos.textContent = posicionRealGlobal + 1;
    celdaTuUser.textContent = datosTuUsuario.usuario;
    celdaTuVic.textContent = datosTuUsuario.victorias;
    celdaTuDer.textContent = datosTuUsuario.derrotas;
    celdaTuEmp.textContent = datosTuUsuario.empates;
    celdaTuPts.textContent = datosTuUsuario.puntos;
    celdaTuPorc.textContent = datosTuUsuario.porcentajeText;

    celdaTuEmp.style.color = "#a0a5d0";
    celdaTuPts.style.color = "#3a86ff";
    celdaTuPts.style.fontWeight = "bold";

    tuFilaEspecial.style.backgroundColor = "rgba(58, 134, 255, 0.18)";
    celdaTuUser.classList.add("nombre-jugador-pulsante");
  }
}

function obtenerCookieUsuario() {
  const nombreCookie = "usuario_session=";
  const cookiesSeparadas = document.cookie.split(';');
  for (let i = 0; i < cookiesSeparadas.length; i++) {
    let c = cookiesSeparadas[i].trim();
    if (c.indexOf(nombreCookie) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nombreCookie.length, c.length)));
      } catch (e) { return null; }
    }
  }
  return null;
}
