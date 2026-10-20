document.addEventListener("DOMContentLoaded" , () =>

document.getElementById("Registrarse").addEventListener("click", (event) => {
  if (
    document.getElementById("usuario").checkValidity() &&
    document.getElementById("Contraseña").checkValidity()
  ) {
    event.preventDefault();

    let usuario = document.getElementById("usuario");
    let Contraseña = document.getElementById("Contraseña");

    let Usuarios = JSON.parse(localStorage.getItem("Usuarios")) || {};

    let datoUsuario = Usuarios[usuario];

    if (datoUsuario == null) {
      let objeto = {
        usuario: usuario,
        contraseña: Contraseña,
      };
    
    Usuarios[usuario] = objeto;

    localStorage.setItem("Usuarios", JSON.stringify(Usuarios));

    sessionStorage.setItem("sesion", JSON.stringify(objeto));
    window.location = "./index.html";
  }else {
    alert("El usuario Ya existe")
  }
}})

);
