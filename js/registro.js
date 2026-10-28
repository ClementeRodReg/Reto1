
function configurarRegistro() {
    const botonRegistro = document.getElementById("Registrarse");

    if (!botonRegistro) {
        console.error("No se encuentra el botón Registrarse");
        return;
    }

    botonRegistro.addEventListener("click", function (event) {
        event.preventDefault();

        const campoUsuario = document.getElementById("usuario");
        const campoContraseña = document.getElementById("Contraseña");

        if (
            campoUsuario.checkValidity() &&
            campoContraseña.checkValidity()
        ) {
            let usuario = campoUsuario.value;
            let Contraseña = campoContraseña.value;

            let objetoUsuarios =
                JSON.parse(localStorage.getItem("Usuarios")) || {};

            let datoUsuario = objetoUsuarios[usuario];

            if (datoUsuario == null) {
                let objeto = {
                    usuario: usuario,
                    contraseña: Contraseña
                };

                objetoUsuarios[usuario] = objeto;

                localStorage.setItem(
                    "Usuarios",
                    JSON.stringify(objetoUsuarios)
                );

                sessionStorage.setItem(
                    "sesion",
                    JSON.stringify(objeto)
                );

                window.location = "./index.html";
            } else {
                alert("El usuario Ya existe");
            }
        } else {
            campoUsuario.reportValidity();
            campoContraseña.reportValidity();
        }
    });
}
