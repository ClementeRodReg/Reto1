let ventanaNormasRef = null;

export function mostrarVentanaNormas() {
    // 1. Evitar duplicados: Si la ventana ya existe y no se ha cerrado, le da foco y sale
    if (ventanaNormasRef && !ventanaNormasRef.closed) {
        ventanaNormasRef.focus();
        return;
    }

    // 2. Configuración del tamaño y opciones de la nueva ventana
    const ancho = 600;
    const alto = 800;
    // Centrar la nueva ventana en la pantalla del usuario
    const izquierda = (window.screen.width - ancho) / 2;
    const arriba = (window.screen.height - alto) / 2;

    const opciones = `width=${ancho},height=${alto},left=${izquierda},top=${arriba},resizable=yes,scrollbars=yes`;

    // 3. Abrir la ventana en blanco
    ventanaNormasRef = window.open("", "NormasTripleTriad", opciones);

    if (!ventanaNormasRef) {
        alert("Por favor, permite las ventanas emergentes (pop-ups) para ver las normas.");
        return;
    }

    // 4. Escribir el HTML, los estilos y las fuentes directamente en la nueva ventana
    ventanaNormasRef.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Normas del Triple Triad</title>
            <style>
                /* Importamos la fuente para que la nueva ventana también la tenga */
                @font-face {
                    font-family: 'FFVIII';
                    src: url('../fonts/OPTIEngeEtienne.woff2') format('woff2');
                }

                body {
                    background: linear-gradient(to bottom, #000046, #1cb5e0); /* Azul FF */
                    color: #ffffff;
                    font-family: 'FFVIII', sans-serif;
                    margin: 0;
                    padding: 30px;
                    min-height: calc(100vh - 60px);
                    box-sizing: border-box;
                    border: 4px solid #ffffff; /* Borde blanco estilo menú FF */
                }

                h1 {
                    text-align: center;
                    border-bottom: 2px solid #ffffff;
                    padding-bottom: 10px;
                    margin-top: 0;
                    font-size: 48px;
                    letter-spacing: 2px;
                }

                ul {
                    line-height: 1.6;
                    font-size: 32px;
                    padding-left: 20px;
                    list-style-type: square;
                }

                li {
                    margin-bottom: 15px;
                }

                .footer-text {
                    text-align: center;
                    margin-top: 40px;
                    font-size: 24px;
                    color: #e0e0e0;
                }
            </style>
        </head>
        <body>
            <h1>NORMAS DEL TRIPLE TRIAD</h1>
            <ul>
                <li>Se juega en un tablero de 3x3 casillas.</li>
                <li>Cada jugador usa 5 cartas en su mano.</li>
                <li>Coloca una carta adyacente para iniciar un combate numérico.</li>
                <li>El número más alto voltea la carta del rival.</li>
                <li>La partida termina al de 9 turnos.</li>
                <li>El jugador con más cartas de su color gana (se cuenta la sobrante en la mano también).</li>
            </ul>
            <div class="footer-text">Puedes cerrar esta ventana para volver al juego</div>
        </body>
        </html>
    `);

    // Importante cerrar el flujo de escritura del documento para que termine de renderizar
    ventanaNormasRef.document.close();
}