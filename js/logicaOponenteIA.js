/**
 * Controla el pensamiento y movimiento estratégico del bando rival (IA).
 */
export function ejecutarTurnoIA(misCartas, susCartas, ejecutarCombate, gestionarTurnosVisibles, cambiarTurnoCallback) {
    // 1. Simulación de pensamiento de 1 segundo
    setTimeout(() => {
        // 2. Localizar cartas disponibles en la mano del rival y casillas libres en el tablero
        const cartasManoRival = Array.from(document.querySelectorAll('.susCartas .carta-rival-disponible'));
        const casillasLibres = Array.from(document.querySelectorAll('.tableroGrid div')).filter(casilla => {
            return casilla.dataset.ocupada !== "true" && casilla.innerHTML.trim() === "";
        });

        if (cartasManoRival.length === 0 || casillasLibres.length === 0) return;

        let mejorJugada = null;
        let maxCapturas = -1;

        // Definición de las 4 direcciones para simular los combates colindantes
        const direcciones = [
            { f: -1, c: 0, caraAtacante: 'norte', caraDefensora: 'sur' },   // Arriba
            { f: 1,  c: 0, caraAtacante: 'sur',   caraDefensora: 'norte' }, // Abajo
            { f: 0,  c: -1, caraAtacante: 'oeste', caraDefensora: 'este' },  // Izquierda
            { f: 0,  c: 1,  caraAtacante: 'este',  caraDefensora: 'oeste' }  // Derecha
        ];

        // 3. ANALIZAR EL TABLERO: Evaluamos cada carta en cada casilla libre
        cartasManoRival.forEach(nodoCarta => {
            const indexMano = Number(nodoCarta.dataset.indexMano);
            const cartaDatos = susCartas[indexMano];

            casillasLibres.forEach(casilla => {
                // Averiguamos las coordenadas de la casilla actual a través de sus clases
                const clasesCasilla = casilla.className.split(" ");
                const claseHueco = clasesCasilla.find(c => c.startsWith("hueco-"));
                if (!claseHueco) return;
                
                const [, fila, columna] = claseHueco.split("-").map(Number);
                let capturasSimuladas = 0;

                // Simulamos el ataque en las 4 direcciones
                direcciones.forEach(dir => {
                    const destinoFila = fila + dir.f;
                    const destinoColumna = columna + dir.c;
                    const casillaVecina = document.querySelector(`[class*="hueco-${destinoFila}-${destinoColumna}"]`);

                    if (casillaVecina && casillaVecina.dataset.ocupada === "true" && casillaVecina.cartaData) {
                        const cartaVecina = casillaVecina.cartaData;

                        // Solo contamos si la carta adyacente es del jugador (azul)
                        if (cartaVecina.propietario === 'azul') {
                            const valorAtacante = Number(cartaDatos.valores[dir.caraAtacante]);
                            const valorDefensor = Number(cartaVecina.valores[dir.caraDefensora]);

                            if (valorAtacante > valorDefensor) {
                                capturasSimuladas++;
                            }
                        }
                    }
                });

                // Si esta jugada supera el récord de capturas actual, se convierte en la favorita
                if (capturasSimuladas > maxCapturas) {
                    maxCapturas = capturasSimuladas;
                    mejorJugada = { nodoCarta, casilla, indexMano, datosCarta: cartaDatos };
                }
            });
        });

        // 4. EJECUTAR LA MEJOR JUGADA ENCONTRADA
        if (mejorJugada) {
            const { nodoCarta, casilla, indexMano, datosCarta } = mejorJugada;

            console.log(`[IA Estratégica] Ha decidido jugar a ${datosCarta.nombre}. Capturas estimadas: ${maxCapturas}`);

            // Transferencia visual al tablero
            casilla.style.backgroundImage = nodoCarta.style.backgroundImage;
            casilla.style.backgroundSize = "cover";
            casilla.innerHTML = nodoCarta.innerHTML;

            // Registro de datos en la celda
            casilla.dataset.ocupada = "true";
            casilla.style.backgroundColor = "transparent";
            casilla.style.border = "1px solid rgba(204, 204, 204, 0.4)";
            casilla.cartaData = datosCarta;

            // Limpieza de la ranura de la mano
            nodoCarta.style.backgroundImage = "none";
            nodoCarta.innerHTML = "";
            nodoCarta.removeAttribute("draggable");
            nodoCarta.classList.remove("carta-rival-disponible");

            // Ejecutamos el combate real (el que ya tienes en minijuego.js) para que aplique los volteos
            const clasesCasilla = casilla.className.split(" ");
            const claseHueco = clasesCasilla.find(c => c.startsWith("hueco-"));
            if (claseHueco) {
                const [, fila, columna] = claseHueco.split("-").map(Number);
                ejecutarCombate(fila, columna, casilla);
            }

            // Devolver el turno al jugador humano
            cambiarTurnoCallback();
            gestionarTurnosVisibles();
        }
    }, 1000);
}
