document.addEventListener("DOMContentLoaded" , () =>

document.getElementById("Registrarse").addEventListener("click", (event) => {
  if (
    document.getElementById("usuario").checkValidity() &&
    document.getElementById("Contraseña").checkValidity()
  ) {
    event.preventDefault();

    let usuario = document.getElementById("usuario").value;
    let Contraseña = document.getElementById("Contraseña").value;

    let objetoUsuarios = JSON.parse(localStorage.getItem("Usuarios")) || {};

    let datoUsuario = objetoUsuarios[usuario];

    if (datoUsuario == null) {
      let objeto = {
        usuario: usuario,
        contraseña: Contraseña,
      };
    
    objetoUsuarios[usuario] = objeto;

    localStorage.setItem("Usuarios", JSON.stringify(objetoUsuarios));

    sessionStorage.setItem("sesion", JSON.stringify(objeto));
    window.location = "./index.html";
  }else {
    alert("El usuario Ya existe")
  }
}})

);