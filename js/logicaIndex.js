import { mostrarVentanaNormas } from "./normas.js";
import { inicializarModalAuth } from "./auth.js"; 

document.addEventListener("DOMContentLoaded", () => {
    // Inicializamos la modal flotante por si no está logueado
    inicializarModalAuth(); 

    const containerBotones = document.querySelector(".containerBotones");
    const botonLoginRegistro = document.getElementById("abrirLogin");

    // 1. COMPROBACIÓN DE SESIÓN ACTIVA EN COOKIES
    const datosSesión = obtenerCookieUsuario();

    if (datosSesión && datosSesión.logeado === true) {
        // Si el usuario está logueado, eliminamos el botón de iniciar sesión/registro
        if (botonLoginRegistro) {
            botonLoginRegistro.remove();
        }

        // Creamos el botón "Jugar" de forma dinámica
        const botonJugar = document.createElement("button");
        botonJugar.id = "irAJugar";
        botonJugar.textContent = "Jugar";
        botonJugar.addEventListener("click", () => {
            window.location.href = "minijuego.html"; // Ruta a tu pantalla de juego
        });

        // Creamos el botón "Perfil" de forma dinámica
        const botonPerfil = document.createElement("button");
        botonPerfil.id = "irAPerfil";
        botonPerfil.textContent = "Perfil";
        botonPerfil.addEventListener("click", () => {
            window.location.href = "perfil.html"; // Ruta a tu pantalla de perfil
        });

        // Los inyectamos al principio de la lista de botones (Jugar arriba, Perfil abajo)
        containerBotones.insertBefore(botonPerfil, containerBotones.firstChild);
        containerBotones.insertBefore(botonJugar, containerBotones.firstChild);
    }

    // 2. SISTEMA DE TECLADO Y FOCO RECALCULADO
    // Buscamos los botones de nuevo tras la posible inyección para que las flechas funcionen con Jugar y Perfil
    const botones = document.querySelectorAll(".containerBotones button");
    let indexActual = 0;

    setTimeout(() => {
        if (botones.length > 0) {
            botones[indexActual].focus();
        }
    }, 3000);

    document.addEventListener("keydown", (e) => {
        if (botones.length === 0) return;
        if (document.getElementById("modal-normas") || (document.getElementById("modalAuth") && document.getElementById("modalAuth").style.display === "flex")) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            indexActual = (indexActual + 1) % botones.length;
            botones[indexActual].focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            indexActual = (indexActual - 1 + botones.length) % botones.length;
            botones[indexActual].focus();
        } 
        else if (e.key === "Enter") {
            const botonActivo = document.activeElement;
            
            if (botonActivo && botonActivo.textContent.trim() === "Normas") {
                e.preventDefault();
                mostrarVentanaNormas();
            }
            // NUEVO: Redirección al pulsar ENTER sobre Ranking
            else if (botonActivo && botonActivo.textContent.trim() === "Ranking") {
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
        
        // Añadimos el evento click para redirigir a ranking
        boton.addEventListener("click", () => {
            if (boton.textContent.trim() === "Normas") {
                mostrarVentanaNormas();
            }
            // NUEVO: Redirección al hacer click en Ranking
            else if (boton.textContent.trim() === "Ranking") {
                window.location.href = "ranking.html";
            }
        });
    });

});

// Función lectora que busca la cookie, la decodifica y la devuelve transformada de nuevo en Objeto
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
                console.error("Error al procesar la cookie de usuario:", error);
                return null;
            }
        }
    }
    return null;
}
