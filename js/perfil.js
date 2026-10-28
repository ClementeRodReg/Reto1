function configurarPerfil() {
    const sesionGuardada = sessionStorage.getItem("sesion");

    if (sesionGuardada == null) {
        alert("No se encuentra ninguna sesión iniciada.");
        return;
    }

    const sesion = JSON.parse(sesionGuardada);
    const usuarios = JSON.parse(localStorage.getItem("Usuarios")) || {};
    const usuario = usuarios[sesion.usuario] || sesion;

    const imgPreview = document.getElementById("fotoPerfil");
    const campoUsuario = document.getElementById("usuarioPerfil") || document.getElementById("usuario");
    const campoContraseña = document.getElementById("contraseñaPerfil") || document.getElementById("contraseña");
    const campoImagen = document.getElementById("fileReader");
    const formulario = document.getElementById("formPerfil");
    const tituloUsuario = document.getElementById("tituloUsuario");
    const botonCerrarSesion = document.getElementById("cerrarSesion");

    // Comprobar que el HTML del perfil está cargado
    if (
        !imgPreview ||
        !campoUsuario ||
        !campoContraseña ||
        !campoImagen ||
        !formulario ||
        !tituloUsuario
    ) {
        console.error("No se han encontrado todos los elementos del perfil.");
        return;
    }

    // Mostrar los datos actuales del usuario
    campoUsuario.value = usuario.usuario || "";
    campoContraseña.value = usuario.contraseña || "";
    tituloUsuario.textContent = usuario.usuario || "Jugador";

    const imagenGuardada = usuario.imagen || sessionStorage.getItem("URL") || "";
    imgPreview.src = imagenGuardada || "../img/Portrait_Placeholder.png";
    imgPreview.dataset.imagen = imagenGuardada;

    // Mostrar estadísticas del jugador
    const victoriasElem = document.getElementById("victorias");
    const derrotasElem = document.getElementById("derrotas");
    const empatesElem = document.getElementById("empates");
    const porcentajeElem = document.getElementById("porcentajeVictorias");

    const v = Number(usuario.victorias) || 0;
    const d = Number(usuario.derrotas) || 0;
    const e = Number(usuario.empates) || 0;
    const totalPartidas = v + d;
    const pct = totalPartidas > 0 ? ((v / totalPartidas) * 100).toFixed(2) + "%" : "0%";

    if (victoriasElem) victoriasElem.textContent = v;
    if (derrotasElem) derrotasElem.textContent = d;
    if (empatesElem) empatesElem.textContent = e;
    if (porcentajeElem) porcentajeElem.textContent = usuario.porcentaje || pct;

    // Evitar añadir los eventos varias veces
    if (formulario.dataset.configurado === "true") {
        return;
    }

    formulario.dataset.configurado = "true";

    // Previsualizar la imagen seleccionada
    campoImagen.addEventListener("change", function (event) {
        const archivo = event.target.files[0];

        if (!archivo) {
            return;
        }

        if (!archivo.type.startsWith("image/")) {
            alert("Selecciona un archivo de imagen válido.");
            campoImagen.value = "";
            return;
        }

        const reader = new FileReader();

        reader.addEventListener("load", function () {
            imgPreview.src = reader.result;
            imgPreview.dataset.imagen = reader.result;
        });

        reader.readAsDataURL(archivo);
    });

    // Guardar los cambios del perfil
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }

        const sesionActual = JSON.parse(sessionStorage.getItem("sesion") || "{}");
        const objetoUsuarios = JSON.parse(localStorage.getItem("Usuarios")) || {};
        const usuarioActual = objetoUsuarios[sesionActual.usuario] || sesionActual;

        const usuarioAnterior = usuarioActual.usuario;
        const usuarioNuevo = campoUsuario.value.trim();
        const contraseñaNueva = campoContraseña.value;
        const imagenNueva = imgPreview.dataset.imagen || usuarioActual.imagen || null;

        if (usuarioNuevo === "") {
            campoUsuario.reportValidity();
            return;
        }

        // Comprobar si el nuevo nombre ya pertenece a otra cuenta
        if (
            usuarioNuevo !== usuarioAnterior &&
            objetoUsuarios[usuarioNuevo] != null
        ) {
            alert("Ese nombre de usuario ya está en uso.");
            return;
        }

        // Conservar los demás datos del usuario (estadísticas, etc.)
        const objeto = {
            ...usuarioActual,
            usuario: usuarioNuevo,
            contraseña: contraseñaNueva,
            imagen: imagenNueva
        };

        // Cambiar la clave si se modifica el nombre
        if (usuarioAnterior && usuarioAnterior !== usuarioNuevo) {
            delete objetoUsuarios[usuarioAnterior];
        }
        objetoUsuarios[usuarioNuevo] = objeto;

        localStorage.setItem(
            "Usuarios",
            JSON.stringify(objetoUsuarios)
        );

        // Actualizar la sesión
        sessionStorage.setItem("sesion", JSON.stringify(objeto));

        if (imagenNueva) {
            sessionStorage.setItem("URL", imagenNueva);
        } else {
            sessionStorage.removeItem("URL");
        }

        tituloUsuario.textContent = usuarioNuevo;

        // Actualizar el botón en el menú principal
        const fnActualizar =
            window.actualizarBotonPerfil ||
            (typeof actualizarBotonPerfil === "function" ? actualizarBotonPerfil : null);
        if (fnActualizar) {
            fnActualizar();
        }

        alert("Perfil actualizado correctamente.");

        // Cerrar modal
        const modalPerfil = document.getElementById("modalPerfil");
        if (modalPerfil) {
            modalPerfil.classList.remove("activo");
        } else {
            window.location.href = "./index.html";
        }
    });

    // Cerrar sesión
    if (botonCerrarSesion && botonCerrarSesion.dataset.configurado !== "true") {
        botonCerrarSesion.dataset.configurado = "true";
        botonCerrarSesion.addEventListener("click", function () {
            sessionStorage.removeItem("sesion");
            sessionStorage.removeItem("URL");

            const fnActualizar =
                window.actualizarBotonPerfil ||
                (typeof actualizarBotonPerfil === "function" ? actualizarBotonPerfil : null);
            if (fnActualizar) {
                fnActualizar();
            }

            const modalPerfil = document.getElementById("modalPerfil");
            if (modalPerfil) {
                modalPerfil.classList.remove("activo");
            } else {
                window.location.href = "./index.html";
            }

            alert("Has cerrado sesión.");
        });
    }
}
