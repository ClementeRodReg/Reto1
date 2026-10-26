
 document.addEventListener("DOMContentLoaded", () => {

    if (JSON.parse(localStorage.getItem("Usuarios") == null)) {
        localStorage.setItem("Usuarios", JSON.stringify({}));
    }
 
 });
 document.getElementById("acceder").addEventListener("click", (event) => {

        
        if (
            document.getElementById("usuarioLogin").checkValidity() &&
            document.getElementById("contraseñaLogin").checkValidity()
        ) {
            
            event.preventDefault();

            
            let usuario = document.getElementById("usuarioLogin").value;
            let contraseña = document.getElementById("contraseñaLogin").value;

            
            let objetoUsuarios = JSON.parse(localStorage.getItem("Usuarios"));

            let datosUsuario = objetoUsuarios[usuario];


            if (datosUsuario == null) {
                alert("El usuario no existe");

            } else {
               
                if (datosUsuario["contraseña"] == contraseña) {


                    sessionStorage.setItem("sesion", JSON.stringify(datosUsuario));
                    window.location = "./index.html";

                } else {
                    // Si la contraseña no coincide
                    alert("Contraseña incorrecta");
                }
            }
        }
    });