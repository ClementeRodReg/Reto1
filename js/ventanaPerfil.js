const abrirPerfil = document.getElementById("abrirPerfil");
const modalPerfil = document.getElementById("modalPerfil");

function actualizarBotonPerfil() {
    const imagenMenu = document.querySelector(".imagen-perfil-menu");
    const textoMenu = document.querySelector("#abrirPerfil span");

    const sesionGuardada = sessionStorage.getItem("sesion");

    if (!sesionGuardada) {
        if (textoMenu) {
            textoMenu.textContent = "Perfil";
        }

        if (imagenMenu) {
            imagenMenu.src = "../img/Portrait_Placeholder.png";
        }

        return;
    }

    const sesion = JSON.parse(sesionGuardada);
    const usuarios = JSON.parse(localStorage.getItem("Usuarios")) || {};
    const usuario = usuarios[sesion.usuario] || sesion;

    if (textoMenu) {
        textoMenu.textContent = usuario.usuario || "Perfil";
    }

    if (imagenMenu) {
        imagenMenu.src =
            usuario.imagen ||
            sessionStorage.getItem("URL") ||
            "../img/Portrait_Placeholder.png";
    }
}

// Exponer la función globalmente para que otros scripts la puedan llamar
window.actualizarBotonPerfil = actualizarBotonPerfil;

// Actualizar el botón al cargar la página
actualizarBotonPerfil();

let perfilCargado = false;
let scriptPerfilCargado = false;

abrirPerfil.addEventListener("click", async function () {
    if (sessionStorage.getItem("sesion") == null) {
        alert("Debes iniciar sesión para acceder a tu perfil.");
        return;
    }

    try {
        // Cargar el HTML del perfil una sola vez
        if (!perfilCargado) {
            const respuesta = await fetch("./perfil.html");

            if (!respuesta.ok) {
                throw new Error("No se ha podido cargar perfil.html");
            }

            modalPerfil.innerHTML = await respuesta.text();
            perfilCargado = true;
        }

        // Cargar el JavaScript del perfil una sola vez
        if (!scriptPerfilCargado) {
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "../js/perfil.js";
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });

            scriptPerfilCargado = true;
        }

        // Mostrar los datos y abrir la ventana
        if (typeof configurarPerfil === "function") {
            configurarPerfil();
        } else {
            throw new Error("No se encuentra la función configurarPerfil()");
        }

        modalPerfil.classList.add("activo");

    } catch (error) {
        console.error(error);
        alert("No se ha podido abrir el perfil. Revisa la consola.");
    }
});

// Cerrar al pulsar fuera o en la X
modalPerfil.addEventListener("click", function (evento) {
    if (
        evento.target === modalPerfil ||
        evento.target.id === "cerrarPerfil"
    ) {
        modalPerfil.classList.remove("activo");
    }
});
