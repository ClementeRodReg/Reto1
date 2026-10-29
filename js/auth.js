export function inicializarModalAuth() {
    const botonAbrirMenu = document.getElementById("abrirLogin"); 
    const modalAuth = document.getElementById("modalAuth");
    const cerrarModalAuth = document.getElementById("cerrarModalAuth");

    const authMenuInicial = document.getElementById("authMenuInicial");
    const btnElegirLogin = document.getElementById("btnElegirLogin");
    const btnElegirRegistro = document.getElementById("btnElegirRegistro");

    const formAuth = document.getElementById("formAuth");
    const tituloAuth = document.getElementById("tituloAuth");
    const seccionAvatarAuth = document.getElementById("seccionAvatarAuth");
    const campoConfirmarPassAuth = document.getElementById("campoConfirmarPassAuth");
    const btnVolverMenuAuth = document.getElementById("btnVolverMenuAuth");

    const selectorAvatarAuth = document.getElementById("selectorAvatarAuth");
    const imagenAvatarAuth = document.getElementById("imagenAvatarAuth");
    const galeriaAvataresAuth = document.getElementById("galeriaAvataresAuth");
    const rejillaAvataresAuth = document.getElementById("rejillaAvataresAuth");

    let modoInterno = "menu"; 
    const MAX_CARTAS = 110;

    // Generar catálogo de avatares una sola vez
    if (rejillaAvataresAuth && rejillaAvataresAuth.children.length === 0) {
        for (let i = 1; i <= MAX_CARTAS; i++) {
            const img = document.createElement("img");
            img.src = `../img/cartas_triple_triad/card_${i}.png`;
            img.className = "carta-miniatura-auth";
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
            
            seccionAvatarAuth.style.display = "none"; 
            campoConfirmarPassAuth.style.display = "none";

            document.getElementById("authUsuario").setAttribute("required", "required");
            document.getElementById("authPassword").setAttribute("required", "required");
        } 
        else if (nuevoEstado === "registro") {
            tituloAuth.textContent = "Registrar Nuevo Héroe";
            authMenuInicial.style.display = "none";
            formAuth.style.display = "flex";
            
            seccionAvatarAuth.style.display = "block"; 
            campoConfirmarPassAuth.style.display = "flex";

            document.getElementById("authUsuario").setAttribute("required", "required");
            document.getElementById("authPassword").setAttribute("required", "required");
            document.getElementById("authConfirmarPassword").setAttribute("required", "required");
        }
    }

    // --- ENLAZAR APERTURA Y CIERRES MEDIANTE CLICS ---
    if (botonAbrirMenu) {
        botonAbrirMenu.addEventListener("click", () => {
            modalAuth.style.display = "flex"; 
            cambiarEstadoAuth("menu"); 
        });
    }

    if (cerrarModalAuth) {
        cerrarModalAuth.addEventListener("click", () => {
            modalAuth.style.display = "none"; 
        });
    }

    btnElegirLogin.addEventListener("click", (e) => { e.preventDefault(); cambiarEstadoAuth("login"); });
    btnElegirRegistro.addEventListener("click", (e) => { e.preventDefault(); cambiarEstadoAuth("registro"); });
    btnVolverMenuAuth.addEventListener("click", (e) => { e.preventDefault(); cambiarEstadoAuth("menu"); });

    if (selectorAvatarAuth) {
        selectorAvatarAuth.addEventListener("click", () => {
            galeriaAvataresAuth.style.display = (galeriaAvataresAuth.style.display === "none") ? "flex" : "none";
        });
    }

    window.addEventListener("click", (e) => {
        if (e.target === modalAuth) {
            modalAuth.style.display = "none";
        }
    });

    // --- CONTROL DE ENVÍO DEL FORMULARIO Y CREACIÓN DE COOKIE ---
        // --- ACTUALIZACIÓN DE ENVÍO EN AUTH.JS ---
    formAuth.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuarioInput = document.getElementById("authUsuario").value.trim();
        const passwordInput = document.getElementById("authPassword").value;
        const avatarSrc = document.getElementById("imagenAvatarAuth").getAttribute("src");

        if (modoInterno === "registro") {
            const confirmarInput = document.getElementById("authConfirmarPassword").value;
            
            if (passwordInput !== confirmarInput) {
                alert("¡Las contraseñas no coinciden, aventurero!");
                return;
            }

            // 1. Comprobar si el nombre de usuario ya existe en la lista global
            let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
            const existe = usuariosRegistrados.some(u => u.usuario.toLowerCase() === usuarioInput.toLowerCase());
            if (existe) {
                alert("❌ ¡Este nombre de usuario ya está registrado por otro héroe!");
                return;
            }

            const datosUsuario = {
                usuario: usuarioInput,
                contrasena: passwordInput,
                avatar: avatarSrc,
                victorias: 0,
                derrotas: 0,
                empates: 0,
                puntos: 0,
                logeado: true
            };

            // 2. Guardamos en la lista global de persistencia
            usuariosRegistrados.push(datosUsuario);
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuariosRegistrados));

            // 3. Guardamos en la cookie de sesión activa actual
            guardarCookieUsuario(datosUsuario);
            alert("¡Héroe registrado con éxito!");
            window.location.reload(); 
        } 
        else if (modoInterno === "login") {
            // Buscamos al usuario en la lista global de registrados
            let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
            const usuarioEncontrado = usuariosRegistrados.find(u => u.usuario.toLowerCase() === usuarioInput.toLowerCase());

            if (!usuarioEncontrado || usuarioEncontrado.contrasena !== passwordInput) {
                alert("❌ ¡Usuario o contraseña incorrectos!");
                return;
            }

            // Marcamos como logeado en la sesión actual
            usuarioEncontrado.logeado = true;
            guardarCookieUsuario(usuarioEncontrado);

            alert("¡Sesión iniciada, bienvenido de vuelta!");
            window.location.reload();
        }
    });


    // Función auxiliar para codificar y guardar el JSON en la cookie por 7 días
    function guardarCookieUsuario(objetoUsuario) {
        const diasExpiracion = 7;
        const d = new Date();
        d.setTime(d.getTime() + (diasExpiracion * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        
        document.cookie = "usuario_session=" + encodeURIComponent(JSON.stringify(objetoUsuario)) + ";" + expires + ";path=/";
    }
}
