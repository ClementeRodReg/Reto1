document.addEventListener("DOMContentLoaded", () => {
    const selectorAvatar = document.getElementById("selectorAvatar");
    const imagenAvatar = document.getElementById("imagenAvatar");
    
    const modalAvatar = document.getElementById("modalAvatar");
    const cerrarModal = document.getElementById("cerrarModal");
    const rejillaAvatares = document.getElementById("rejillaAvatares");

    const MAX_CARTAS = 110;

    // 1. GENERACIÓN DEL CATÁLOGO: Creamos las 110 miniaturas al cargar la página
    if (rejillaAvatares) {
        for (let i = 1; i <= MAX_CARTAS; i++) {
            const imgElement = document.createElement("img");
            imgElement.src = `../img/cartas_triple_triad/card_${i}.png`;
            imgElement.className = "opcion-avatar-galeria";
            imgElement.alt = `Opción ${i}`;
            imgElement.dataset.idCard = i;

            // Al hacer clic en cualquier miniatura de la lista
            imgElement.addEventListener("click", () => {
                if (imagenAvatar) {
                    // Actualizamos el cromo de la interfaz principal del perfil
                    imagenAvatar.src = imgElement.src;
                    console.log(`[Perfil] Nuevo avatar asignado: card_${i}.png`);
                }
                // Cerramos la ventana modal
                modalAvatar.style.display = "none";
            });

            rejillaAvatares.appendChild(imgElement);
        }
    }

    // 2. CONTROL DE APERTURA: Al pulsar en tu recuadro de personaje, abrimos la galería
    if (selectorAvatar && modalAvatar) {
        selectorAvatar.addEventListener("click", () => {
            modalAvatar.style.display = "flex";
        });
    }

    // 3. CONTROL DE CIERRE: Al pulsar en la 'X' cerramos la ventana
    if (cerrarModal && modalAvatar) {
        cerrarModal.addEventListener("click", () => {
            modalAvatar.style.display = "none";
        });
    }

    // Extra: Si haces clic fuera del recuadro azul de la modal, también se cierra
    window.addEventListener("click", (e) => {
        if (e.target === modalAvatar) {
            modalAvatar.style.display = "none";
        }
    });
});
