
const abrirLogin = document.getElementById("abrirLogin");
const modalLogin = document.getElementById("modalLogin");

let loginCargado = false;
let cargandoLogin = false;

// Abrir la ventana
abrirLogin.addEventListener("click", async function () {
    if (cargandoLogin) {
        return;
    }

    if (!loginCargado) {
        cargandoLogin = true;

        try {
            const respuesta = await fetch("./login.html");

            if (!respuesta.ok) {
                throw new Error("No se ha podido cargar login.html");
            }

            const html = await respuesta.text();
            modalLogin.innerHTML = html;

            // Cargar login.js
            await cargarScript("../js/login.js");

            // Cargar registro.js
            await cargarScript("../js/registro.js");

            // Configurar los botones cuando el HTML y los scripts estén cargados
            if (typeof configurarLogin === "function") {
                configurarLogin();
            }

            if (typeof configurarRegistro === "function") {
                configurarRegistro();
            }

            loginCargado = true;

        } catch (error) {
            console.error(error);
            alert("No se ha podido cargar la ventana de login.");
        } finally {
            cargandoLogin = false;
        }
    }

    modalLogin.classList.add("activo");
});

// Cargar un archivo JavaScript y esperar a que termine
function cargarScript(ruta) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = ruta;
        script.onload = resolve;
        script.onerror = () => reject(
            new Error("No se ha podido cargar " + ruta)
        );
        document.body.appendChild(script);
    });
}

// Cerrar al pulsar fuera de la ventana o en la X
modalLogin.addEventListener("click", function (evento) {
    if (
        evento.target === modalLogin ||
        evento.target.id === "cerrarLogin"
    ) {
        modalLogin.classList.remove("activo");
    }
});
