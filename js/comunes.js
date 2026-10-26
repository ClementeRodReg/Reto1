
document.addEventListener("DOMContentLoaded", () => {

    // CARGAR HEADER
    fetch("./header.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("header").innerHTML = html;

            // Obtener la sesión guardada
            const sesion = JSON.parse(
                sessionStorage.getItem("sesion")
            );

            // Mostrar el nombre del usuario
            const nombreUsuario =
                document.getElementById("nombreUsuario");

            if (nombreUsuario && sesion) {
                nombreUsuario.textContent = sesion.usuario;
            } else {
                console.log("No se encontró el usuario o la sesión");
            }
        })
        .catch(error => console.error("Error al cargar el header:", error));


    // CARGAR FOOTER
    fetch("./Footer.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("footer").innerHTML = html;
        })
        .catch(error => console.error("Error al cargar el footer:", error));

});


// CERRAR LOGIN
function cerrarLogin() {
    document.getElementById("contenedorPadre").style.display = "none";
}


// ABRIR LOGIN
function abrirLogin() {
    document.getElementById("contenedorPadre").style.display = "flex";
}


// MOSTRAR LOGIN
function mostrarLogin() {
    fetch("login.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("contenedor-login").innerHTML = html;
        })
        .catch(error => console.error("Error al cargar el login:", error));
}
