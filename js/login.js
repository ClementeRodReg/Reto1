document.addEventListener("DOMContentLoaded", () =>

document.addEventListener("click", (event)=>{

    if(document.getElementById("usuarioInicioSesion").checkValidity &&
        document.getElementById("contraseñaInicioSesion").checkValidity 
    )
    event.preventDefault();

        let usuario = document.getElementById("usuarioInicioSesion").value;
        let contraseña = document.getElementById("contraseñaInicioSesion").value;




        let objetoUsuarios = JSON.parse(localStorage.getItem("Usuarios"));
        let datosUsuario = objetoUsuarios[usuario];


        if(datosUsuario == null){

            alert("el usuario no existe");
        }else{
            
        }
    
}));ç
