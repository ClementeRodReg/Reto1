document.addEventListener("DOMContentLoaded", () => {
    // Selectores del catálogo y modal de avatar
    const selectorAvatar = document.getElementById("selectorAvatar");
    const imagenAvatar = document.getElementById("imagenAvatar");
    const modalAvatar = document.getElementById("modalAvatar");
    const cerrarModal = document.getElementById("cerrarModal");
    const rejillaAvatares = document.getElementById("rejillaAvatares");

    // Selectores del formulario e inputs de datos
    const formularioPerfil = document.getElementById("formularioPerfil");
    const legendUsername = document.getElementById("legendUsername");
    const perfilNombre = document.getElementById("perfilNombre");
    const oldpassw = document.getElementById("oldpassw");
    const newpassw = document.getElementById("newpassw");
    const confnewpassw = document.getElementById("confnewpassw");

    // Selectores de los nuevos botones de acción
    const btnVolverIndex = document.getElementById("btnVolverIndex");
    const btnLogoff = document.getElementById("btnLogoff");
    const btnBorrarUsuario = document.getElementById("btnBorrarUsuario");

    const MAX_CARTAS = 110;
    
    // --- 1. CARGA INICIAL DE LA COOKIE DE SESIÓN ---
    let datosSesion = obtenerCookieUsuario();

    // SEGURIDAD: Si no hay cookie o el usuario no está logueado, lo devolvemos a index
    if (!datosSesion || datosSesion.logeado !== true) {
        alert("¡Acceso denegado! Debes iniciar sesión antes de entrar al Perfil.");
        window.location.href = "index.html";
        return;
    }

    // Auto-rellenar la interfaz del juego con la información actual de la sesión
    legendUsername.textContent = datosSesion.usuario;
    perfilNombre.value = datosSesion.usuario;
    if (datosSesion.avatar) {
        imagenAvatar.src = datosSesion.avatar;
    }

    // --- 2. GENERACIÓN TOTAL DEL CATÁLOGO DE CARTAS ---
    if (rejillaAvatares) {
        for (let i = 1; i <= MAX_CARTAS; i++) {
            const imgElement = document.createElement("img");
            imgElement.src = `../img/cartas_triple_triad/card_${i}.png`;
            imgElement.className = "opcion-avatar-galeria";
            imgElement.alt = `Opción ${i}`;

            imgElement.addEventListener("click", () => {
                if (imagenAvatar) {
                    imagenAvatar.src = imgElement.src;
                }
                modalAvatar.style.display = "none";
            });
            rejillaAvatares.appendChild(imgElement);
        }
    }

    // Controles de apertura y cierre de la modal
    if (selectorAvatar && modalAvatar) {
        selectorAvatar.addEventListener("click", () => modalAvatar.style.display = "flex");
    }
    if (cerrarModal && modalAvatar) {
        cerrarModal.addEventListener("click", () => modalAvatar.style.display = "none");
    }
    window.addEventListener("click", (e) => {
        if (e.target === modalAvatar) modalAvatar.style.display = "none";
    });

    // --- 3. GESTIÓN DE BOTONES DE NAVEGACIÓN Y SESIÓN ---
    
    // Botón Volver
    if (btnVolverIndex) {
        btnVolverIndex.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    // Botón Logoff: Pasa logeado de true a false, actualiza y echa a index
    if (btnLogoff) {
        btnLogoff.addEventListener("click", () => {
            if (confirm("¿Seguro que deseas cerrar la sesión, aventurero?")) {
                datosSesion.logeado = false;
                guardarCookieUsuario(datosSesion);
                alert("Sesión cerrada correctamente.");
                window.location.href = "index.html";
            }
        });
    }

    // Botón Borrar Usuario: Elimina por completo la cookie destruyendo el registro
    if (btnBorrarUsuario) {
        btnBorrarUsuario.addEventListener("click", () => {
            if (confirm("🚨 ¡ATENCIÓN! Esto eliminará por completo tu cuenta y tus estadísticas. ¿Estás totalmente seguro?")) {
                // Forzar expiración de la cookie poniéndole una fecha pasada
                document.cookie = "usuario_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                alert("Cuenta eliminada del sistema de forma permanente.");
                window.location.href = "index.html";
            }
        });
    }

    // --- 4. ENVÍO DEL FORMULARIO: ACTUALIZAR DATOS Y VALIDACIONES ---
    if (formularioPerfil) {
        formularioPerfil.addEventListener("submit", (e) => {
            e.preventDefault();

            // Validación 1: Verificar que introdujo bien su contraseña actual
            if (oldpassw.value !== datosSesion.contrasena) {
                alert("❌ ¡La contraseña antigua introducida es incorrecta!");
                return;
            }

            // Si intenta rellenar los campos de cambiar contraseña
            if (newpassw.value || confnewpassw.value) {
                // Validación 2: Comprobar que coincidan la nueva y su confirmación
                if (newpassw.value !== confnewpassw.value) {
                    alert("❌ ¡La nueva contraseña y su confirmación no coinciden!");
                    return;
                }
                // Si coinciden con éxito, la guardamos
                datosSesion.contrasena = newpassw.value;
            }

            // Guardamos los datos de texto y el avatar actuales
            datosSesion.usuario = perfilNombre.value.trim();
            datosSesion.avatar = imagenAvatar.getAttribute("src");

            // Mantenemos intactas sus estadísticas numéricas del juego
            // (victorias, derrotas, empates, puntos permanecen a salvo)

            // Sobreescribimos la cookie actualizando el registro de sesión
            guardarCookieUsuario(datosSesion);
            alert("¡Perfil actualizado con éxito en el sistema!");
            window.location.reload(); // Recarga la interfaz para asentar los datos
        });
    }

    // --- FUNCIONES AUXILIARES DE LECTURA / ESCRITURA DE COOKIES JSON ---
    function guardarCookieUsuario(objetoUsuario) {
        const diasExpiracion = 7;
        const d = new Date();
        d.setTime(d.getTime() + (diasExpiracion * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = "usuario_session=" + encodeURIComponent(JSON.stringify(objetoUsuario)) + ";" + expires + ";path=/";
    }

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
                    console.error("Error al procesar la cookie de perfil:", error);
                    return null;
                }
            }
        }
        return null;
    }
});
