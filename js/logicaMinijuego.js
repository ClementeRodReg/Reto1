import { Carta } from './carta.js';

document.addEventListener("DOMContentLoaded", () => {
    // Escucha el momento exacto en el que el header termina su animación de introducción
    const header = document.querySelector("header");
    
    if (header) {
        header.addEventListener("animationend", (event) => {
            // Aseguramos que responda a la animación del título
            if (event.animationName === "introFight") {
                // Sube la pantalla suavemente hasta el margen superior absoluto
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth" // Cámbialo a "auto" si prefieres que suba de forma instantánea sin transición
                });
            }
        });
    }
});