export function inicializarModalAuth() {
    const botonAbrirMenu = document.getElementById("abrirLogin"); 
    const modalAuth = document.getElementById("modalAuth");
    const cerrarModalAuth = document.getElementById("cerrarModalAuth");

    // Bloques de fase internos
    const authMenuInicial = document.getElementById("authMenuInicial");
    const btnElegirLogin = document.getElementById("btnElegirLogin");
    const btnElegirRegistro = document.getElementById("btnElegirRegistro");

    // Componentes del formulario
    const formAuth = document.getElementById("formAuth");
    const tituloAuth = document.getElementById("tituloAuth");
    const seccionAvatarAuth = document.getElementById("seccionAvatarAuth");
    const campoConfirmarPassAuth = document.getElementById("campoConfirmarPassAuth");
    const btnVolverMenuAuth = document.getElementById("btnVolverMenuAuth");

    // Catálogo interno de cartas
    const selectorAvatarAuth = document.getElementById("selectorAvatarAuth");
    const imagenAvatarAuth = document.getElementById("imagenAvatarAuth");
    const galeriaAvataresAuth = document.getElementById("galeriaAvataresAuth");
    const rejillaAvataresAuth = document.getElementById("rejillaAvataresAuth");

    let modoInterno = "menu"; 
    const MAX_CARTAS = 110;

    // Construir el catálogo de avatares una sola vez
    if (rejillaAvataresAuth && rejillaAvataresAuth.children.length === 0) {
        for (let i = 1; i <= MAX_CARTAS; i++) {
            const img = document.createElement("img");
            img.src = `../img/cartas_triple_triad/card_${i}.png`;
            img.className = "opcion-avatar-galeria";
            img.alt = `Carta ${i}`;

            img.addEventListener("click", () => {
                if (imagenAvatarAuth) imagenAvatarAuth.src = img.src;
                galeriaAvataresAuth.style.display = "none"; 
            });
            rejillaAvataresAuth.appendChild(img);
        }
    }

    // Cambios de estado interno de las pantallas
        function cambiarEstadoAuth(nuevoEstado) {
        modoInterno = nuevoEstado;
        galeriaAvataresAuth.style.display = "none";

        // Limpiar inputs y validaciones al cambiar entre pantallas
        formAuth.querySelectorAll("input").forEach(input => {
            input.value = "";
            input.removeAttribute("required");
        });

        if (nuevoEstado === "menu") {
            tituloAuth.textContent = "Acceso al Sistema";
            authMenuInicial.style.display = "flex";
            formAuth.style.display = "none";
        } 
        else if (nuevoEstado === "login") {
            tituloAuth.textContent = "Iniciar Sesión";
            authMenuInicial.style.display = "none";
            formAuth.style.display = "flex";
            
            // OCULTACIÓN ESTRICTA: Quitamos por completo el avatar y el campo confirmar contraseña
            seccionAvatarAuth.style.display = "none"; 
            campoConfirmarPassAuth.style.display = "none";

            document.getElementById("authUsuario").setAttribute("required", "required");
            document.getElementById("authPassword").setAttribute("required", "required");
        } 
        else if (nuevoEstado === "registro") {
            tituloAuth.textContent = "Registrar Nuevo Héroe";
            authMenuInicial.style.display = "none";
            formAuth.style.display = "flex";
            
            // MOSTRAR: En registro activamos el bloque completo del avatar y el campo de confirmación
            seccionAvatarAuth.style.display = "flex";
            campoConfirmarPassAuth.style.display = "grid";

            document.getElementById("authUsuario").setAttribute("required", "required");
            document.getElementById("authPassword").setAttribute("required", "required");
            document.getElementById("authConfirmarPassword").setAttribute("required", "required");
        }
    }



    // --- ENLAZAR APERTURA Y CIERRES MEDIANTE CLICS ---
    if (botonAbrirMenu) {
        botonAbrirMenu.addEventListener("click", () => {
            modalAuth.style.display = "flex"; // Se muestra únicamente al pulsar el botón
            cambiarEstadoAuth("menu"); // Resetea siempre al estado inicial de los dos botones
        });
    }

    if (cerrarModalAuth) {
        cerrarModalAuth.addEventListener("click", () => {
            modalAuth.style.display = "none"; // Oculta por completo la capa flotante
        });
    }

    // Navegación de los botones internos
    btnElegirLogin.addEventListener("click", () => cambiarEstadoAuth("login"));
    btnElegirRegistro.addEventListener("click", () => cambiarEstadoAuth("registro"));
    btnVolverMenuAuth.addEventListener("click", () => cambiarEstadoAuth("menu"));

    // Desplegar la bandeja de cartas
    if (selectorAvatarAuth) {
        selectorAvatarAuth.addEventListener("click", () => {
            galeriaAvataresAuth.style.display = (galeriaAvataresAuth.style.display === "none") ? "flex" : "none";
        });
    }

    // Cerrar si hacen clic en la capa oscura exterior
    window.addEventListener("click", (e) => {
        if (e.target === modalAuth) {
            modalAuth.style.display = "none";
        }
    });
}
