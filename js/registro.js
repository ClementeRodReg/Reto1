function configurarRegistro() {
    const botonRegistro = document.getElementById("Registrarse");

    if (!botonRegistro || botonRegistro.dataset.configurado === "true") {
        return;
    }

    botonRegistro.dataset.configurado = "true";

    botonRegistro.addEventListener("click", function (event) {
        event.preventDefault();

        const campoUsuario = document.getElementById("usuario");
        const campoContraseña = document.getElementById("Contraseña");

        if (!campoUsuario || !campoContraseña) {
            return;
        }

        if (
            campoUsuario.checkValidity() &&
            campoContraseña.checkValidity()
        ) {
            const usuario = campoUsuario.value.trim();
            const Contraseña = campoContraseña.value;

            if (usuario === "") {
                campoUsuario.reportValidity();
                return;
            }

            const objetoUsuarios =
                JSON.parse(localStorage.getItem("Usuarios")) || {};

            if (objetoUsuarios[usuario] != null) {
                alert("El usuario ya existe");
                return;
            }

            const objeto = {
                usuario: usuario,
                contraseña: Contraseña,
                victorias: 0,
                derrotas: 0,
                empates: 0
            };

            objetoUsuarios[usuario] = objeto;
            localStorage.setItem("Usuarios", JSON.stringify(objetoUsuarios));

            sessionStorage.setItem("sesion", JSON.stringify(objeto));
            sessionStorage.removeItem("URL");

            // Actualizar botón de perfil en el menú
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

            alert(`¡Registro completado! Bienvenido, ${usuario}.`);
        } else {
            campoUsuario.reportValidity();
            campoContraseña.reportValidity();
        }
    });
}
