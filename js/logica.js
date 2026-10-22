document.addEventListener("DOMContentLoaded", () => {
    const botones = document.querySelectorAll(".containerBotones button");
    let indexActual = 0;

    // Coloca el foco en el primer botón automáticamente tras la animación (3 segundos)
    setTimeout(() => {
        if (botones.length > 0) {
            botones[indexActual].focus();
        }
    }, 3000);

    // Escucha las pulsaciones del teclado
    document.addEventListener("keydown", (e) => {
        if (botones.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault(); // Evita el scroll de la página
            indexActual = (indexActual + 1) % botones.length; // Cicla hacia abajo
            botones[indexActual].focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            indexActual = (indexActual - 1 + botones.length) % botones.length; // Cicla hacia arriba
            botones[indexActual].focus();
        }
    });

    // Opcional: Actualiza el índice si el usuario decide usar el ratón
    botones.forEach((boton, index) => {
        boton.addEventListener("mouseenter", () => {
            boton.focus();
            indexActual = index;
        });
    });
});