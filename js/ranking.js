function cargarRankingEjemplo() { const rankingEjemplo = [ { usuario: "Shadow", victorias: 25, derrotas: 3, porcentaje: "89.29%" }, { usuario: "Dragon", victorias: 22, derrotas: 5, porcentaje: "81.48%" }, { usuario: "Phoenix", victorias: 20, derrotas: 6, porcentaje: "76.92%" }, { usuario: "Ninja", victorias: 18, derrotas: 7, porcentaje: "72.00%" }, { usuario: "Titan", victorias: 16, derrotas: 8, porcentaje: "66.67%" }, { usuario: "Storm", victorias: 14, derrotas: 9, porcentaje: "60.87%" }, { usuario: "Wolf", victorias: 12, derrotas: 10, porcentaje: "54.55%" }, { usuario: "Blaze", victorias: 10, derrotas: 11, porcentaje: "47.62%" }, { usuario: "Ghost", victorias: 8, derrotas: 12, porcentaje: "40.00%" }, { usuario: "Raven", victorias: 5, derrotas: 15, porcentaje: "25.00%" } ];

localStorage.setItem("Ranking", JSON.stringify(rankingEjemplo)); }
document.addEventListener("DOMContentLoaded", () => {
    cargarRankingEjemplo();
    rellenarTabla();

  document.getElementById("botonResetear").addEventListener("click", () => {
    localStorage.setItem("Ranking", JSON.stringify([]));
    rellenarTabla();
  });
});

function rellenarTabla() {
  let arrayRanking = JSON.parse(localStorage.getItem("Ranking"));

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
