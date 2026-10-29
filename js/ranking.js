function cargarRankingEjemplo() {
  const rankingEjemplo = [
    { usuario: "Shadow", victorias: 25, derrotas: 3, porcentaje: "89.29%" },
    { usuario: "Dragon", victorias: 22, derrotas: 5, porcentaje: "81.48%" },
    { usuario: "Phoenix", victorias: 20, derrotas: 6, porcentaje: "76.92%" },
    { usuario: "Ninja", victorias: 18, derrotas: 7, porcentaje: "72.00%" },
    { usuario: "Titan", victorias: 16, derrotas: 8, porcentaje: "66.67%" },
    { usuario: "Storm", victorias: 14, derrotas: 9, porcentaje: "60.87%" },
    { usuario: "Wolf", victorias: 12, derrotas: 10, porcentaje: "54.55%" },
    { usuario: "Blaze", victorias: 10, derrotas: 11, porcentaje: "47.62%" },
    { usuario: "Ghost", victorias: 8, derrotas: 12, porcentaje: "40.00%" },
    { usuario: "Raven", victorias: 5, derrotas: 15, porcentaje: "25.00%" }
  ];

  if (!localStorage.getItem("Ranking")) {
    localStorage.setItem("Ranking", JSON.stringify(rankingEjemplo));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarRankingEjemplo();
  rellenarTabla();

  const botonResetear = document.getElementById("botonResetear");
  if (botonResetear) {
    botonResetear.addEventListener("click", () => {
      localStorage.setItem("Ranking", JSON.stringify([]));
      rellenarTabla();
    });
  }

  const botonVolver = document.getElementById("botonVolver");
  if (botonVolver) {
    botonVolver.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Navegación por teclado estilo Final Fantasy
  const botones = document.querySelectorAll(".contenedorBotonesRanking button");
  let indexActual = 0;

  // Auto-foco en el primer botón tras la animación de entrada
  setTimeout(() => {
    if (botones.length > 0 && !document.activeElement.matches("button")) {
      botones[indexActual].focus();
    }
  }, 3200);

  // Saltar animación al hacer clic o presionar cualquier tecla
  const saltarIntro = () => {
    document.body.classList.add("sin-espera");
    if (botones.length > 0 && !document.activeElement.matches("button")) {
      botones[indexActual].focus();
    }
  };

  window.addEventListener("keydown", saltarIntro, { once: true });
  window.addEventListener("click", saltarIntro, { once: true });

  // Control con flechas
  document.addEventListener("keydown", (e) => {
    if (botones.length === 0) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      indexActual = (indexActual + 1) % botones.length;
      botones[indexActual].focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      indexActual = (indexActual - 1 + botones.length) % botones.length;
      botones[indexActual].focus();
    }
  });

  // El ratón también actualiza el índice y enfoca para mostrar la mano
  botones.forEach((boton, index) => {
    boton.addEventListener("mouseenter", () => {
      boton.focus();
      indexActual = index;
    });
  });
});

function rellenarTabla() {
  let arrayRanking = JSON.parse(localStorage.getItem("Ranking")) || [];

  const tabla = document.getElementById("tBody");
  tabla.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const nuevaFila = tabla.insertRow();
    const celdaPosicion = nuevaFila.insertCell();
    const celdaUsuarios = nuevaFila.insertCell();
    const celdaVictorias = nuevaFila.insertCell();
    const celdaDerrotas = nuevaFila.insertCell();
    const celdaPorcentaje = nuevaFila.insertCell();

    celdaPosicion.textContent = i + 1;
    if (arrayRanking[i] != null) {
      celdaUsuarios.textContent = arrayRanking[i].usuario;
      celdaVictorias.textContent = arrayRanking[i].victorias;
      celdaDerrotas.textContent = arrayRanking[i].derrotas;
      celdaPorcentaje.textContent = arrayRanking[i].porcentaje;
    } else {
      celdaUsuarios.textContent = "-";
      celdaVictorias.textContent = "-";
      celdaDerrotas.textContent = "-";
      celdaPorcentaje.textContent = "-";
    }
  }
}
