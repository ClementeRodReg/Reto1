import { mostrarVentanaNormas } from "./normas.js";

document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".containerBotones button");
    let indexActual = 0;

    // Coloca el foco en el primer botón automáticamente tras la animación (3 segundos)
    setTimeout(() => {
        if (botones.length > 0) {
            botones[indexActual].focus();
        }
    }, 3000);

    // Escucha las pulsaciones del teclado
    document.addEventListener("keydown", (e) => {
        if (botones.length === 0) return;

        // Comprobamos si hay alguna ventana de normas abierta para no interferir con las flechas
        if (document.getElementById("modal-normas")) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            indexActual = (indexActual + 1) % botones.length;
            botones[indexActual].focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            indexActual = (indexActual - 1 + botones.length) % botones.length;
            botones[indexActual].focus();
        } 
        // Lógica para detectar el ENTER
        else if (e.key === "Enter") {
            const botonActivo = document.activeElement;
            
            // Si el botón enfocado actualmente es el de "Normas"
            if (botonActivo && (botonActivo.id === "abrirNormas" || botonActivo.textContent.trim() === "Normas")) {
                e.preventDefault();
                mostrarVentanaNormas(); // Ejecuta la función del otro archivo
            } else if (botonActivo && (botonActivo.id === "abrirRanking" || botonActivo.textContent.trim() === "Ranking")) {
                e.preventDefault();
                window.location.href = "ranking.html";
            }
        }
    });

    // Actualiza el índice si el usuario decide usar el ratón
    botones.forEach((boton, index) => {
        boton.addEventListener("mouseenter", () => {
            boton.focus();
            indexActual = index;
        });
        
        // También añadimos el evento click por si usan el ratón
        boton.addEventListener("click", () => {
            if (boton.id === "abrirNormas" || boton.textContent.trim() === "Normas") {
                mostrarVentanaNormas();
            } else if (boton.id === "abrirRanking" || boton.textContent.trim() === "Ranking") {
                window.location.href = "ranking.html";
            }
        });
    });
});
