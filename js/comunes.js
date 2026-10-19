// Espera a que todo el contenido del documento (HTML) se haya cargado completamente
document.addEventListener("DOMContentLoaded", () => {

    // ===========================================================
    //  CARGA DEL HEADER (encabezado)
    // ===========================================================

    // Se utiliza `fetch()` para obtener el contenido del archivo externo "header.html".
    fetch("./header.html")
        // Cuando se recibe la respuesta, se convierte a texto HTML
        .then(r => r.text())

        // Luego se inserta ese HTML dentro del elemento que tenga id="header"
        .then(html => document.getElementById("header").innerHTML = html)

        .then(() =>{
            if(sessionStorage.getItem("intentos") == null){
                sessionStorage.setItem("intentos", 0);
            }
            document.getElementById("intentos").innerHTML = "Intentos: " + sessionStorage.getItem("intentos");
        })



    // ===========================================================
    //  CARGA DEL FOOTER (pie de página)
    // ===========================================================

    // Se hace lo mismo que con el header: cargar el contenido de Footer.html
    fetch("./Footer.html")
        .then(r => r.text())
        .then(html => document.getElementById("footer").innerHTML = html);

    // (No hay personalización en el footer, solo se inserta el contenido)
});