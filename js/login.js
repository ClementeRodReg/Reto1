function inicializarDatos() {
    if (localStorage.getItem("Usuarios") == null) {
        localStorage.setItem("Usuarios", JSON.stringify({}));
    }

    if (localStorage.getItem("Ranking") == null) {
        localStorage.setItem("Ranking", JSON.stringify([]));
    }
}

// Inicializar los datos aunque el script se cargue dinámicamente
inicializarDatos();

function configurarLogin() {
    const botonAcceder = document.getElementById("acceder");

    if (!botonAcceder || botonAcceder.dataset.configurado === "true") {
        return;
    }

    botonAcceder.dataset.configurado = "true";

    botonAcceder.addEventListener("click", function (event) {
        event.preventDefault();

        const campoUsuario = document.getElementById("usuarioLogin");
        const campoContraseña = document.getElementById("contraseñaLogin");

        if (!campoUsuario || !campoContraseña) {
            return;
        }

        if (!campoUsuario.checkValidity() || !campoContraseña.checkValidity()) {
            campoUsuario.reportValidity();
            campoContraseña.reportValidity();
            return;
        }

        const usuario = campoUsuario.value.trim();
        const contraseña = campoContraseña.value;

        const objetoUsuarios =
            JSON.parse(localStorage.getItem("Usuarios")) || {};

        const datosUsuario = objetoUsuarios[usuario];

        if (datosUsuario == null) {
            alert("El usuario no existe");
            return;
        }

        if (datosUsuario.contraseña !== contraseña) {
            alert("Contraseña incorrecta");
            return;
        }

        // Guardar la sesión del usuario
        sessionStorage.setItem("sesion", JSON.stringify(datosUsuario));
        if (datosUsuario.imagen) {
            sessionStorage.setItem("URL", datosUsuario.imagen);
        } else {
            sessionStorage.removeItem("URL");
        }

        // Actualizar el perfil y su botón en el menú
        const fnActualizar =
            window.actualizarBotonPerfil ||
            (typeof actualizarBotonPerfil === "function" ? actualizarBotonPerfil : null);
        if (fnActualizar) {
            fnActualizar();
        }

        // Si está en modal, cerrarlo y limpiar los campos
        const modalLogin = document.getElementById("modalLogin");
        if (modalLogin) {
            modalLogin.classList.remove("activo");
            campoUsuario.value = "";
            campoContraseña.value = "";
        } else {
            window.location.href = "./index.html";
        }

        alert(`¡Bienvenido de nuevo, ${datosUsuario.usuario}!`);
    });
}
