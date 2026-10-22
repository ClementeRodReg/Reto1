import { Carta } from './carta.js';

document.addEventListener("DOMContentLoaded", async () => {
    // ... Tu lógica existente del fin de animación ...

    try {
        // 1. Cargar el JSON de las cartas
        const respuesta = await fetch('../json/cartas_valores.json'); // Ajusta la ruta a tu archivo JSON
        const baseDatosCartas = await respuesta.json();

        // 2. Generar los 10 IDs aleatorios únicos (del 1 al 110)
        const idsAleatorios = generarIdsUnicos(10, 1, 110);

        // 3. Crear las instancias de la clase Carta
        const cartasPartida = idsAleatorios.map(id => {
            const claveCard = `card_${id}`;
            const datosJson = baseDatosCartas[claveCard];
            const rutaImagen = `../img/cartas_triple_triad/card_${id}.png`; // Construye la ruta de la imagen

            // Mapeamos los nombres del JSON (arriba/abajo...) a los de tu clase Carta (norte/sur...)
            const valoresCarta = {
                norte: Number(datosJson.valores.arriba),
                sur: Number(datosJson.valores.abajo),
                este: Number(datosJson.valores.derecha),
                oeste: Number(datosJson.valores.izquierda)
            };

            // Creamos la instancia pasándole (nombre, valores, imagen, elemento)
            // (Nota: Como en el JSON original de FFVIII la letra 'A' equivale al valor 10, lo dejamos preparado por si acaso)
            return new Carta(datosJson.nombre, valoresCarta, rutaImagen, null);
        });

        // 4. Repartir las cartas (5 para ti y 5 para el rival)
        const misCartas = cartasPartida.slice(0, 5);
        const susCartas = cartasPartida.slice(5, 10);

        // Asignar propietarios iniciales
        misCartas.forEach(c => c.propietario = 'azul');
        susCartas.forEach(c => c.propietario = 'rojo');

        // 5. Dibujar en la interfaz (Función de prueba)
        renderizarCartasIniciales(misCartas, susCartas);

    } catch (error) {
        console.error("Error al inicializar las cartas del minijuego:", error);
    }
});

/**
 * Función que genera un array de números aleatorios que no se repiten
 */
function generarIdsUnicos(cantidad, min, max) {
    const ids = new Set();
    while (ids.size < cantidad) {
        const numeroAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
        ids.add(numeroAleatorio);
    }
    return Array.from(ids);
}

/**
 * Función para pintar las imágenes superpuestas y sus valores numéricos en las esquinas
 */
function renderizarCartasIniciales(jugador, rival) {
    // Pintar tus cartas (Fondo Azul)
    jugador.forEach((carta, index) => {
        const contenedor = document.querySelector(`.tucarta${index + 1}`);
        if (contenedor) {
            contenedor.style.backgroundImage = `url('${carta.imagen}'), url('../img/blue.png')`;
            // Inyectamos la estructura de los números leyendo el objeto 'valores' de la instancia
            contenedor.innerHTML = creartHtmlValores(carta);
        }
    });

    // Pintar sus cartas (Fondo Rojo)
    rival.forEach((carta, index) => {
        const contenedor = document.querySelector(`.sucarta${index + 1}`);
        if (contenedor) {
            contenedor.style.backgroundImage = `url('${carta.imagen}'), url('../img/red.png')`;
            // Inyectamos la estructura de los números leyendo el objeto 'valores' de la instancia
            contenedor.innerHTML = creartHtmlValores(carta);
        }
    });
}

/**
 * Función auxiliar para generar la estructura HTML de la cruz de números.
 * Convierte el valor 10 en la letra 'A' al estilo clásico de FFVIII.
 */
function creartHtmlValores(carta) {
    const n = carta.valores.norte;
    const s = carta.valores.sur;
    const e = carta.valores.este;
    const o = carta.valores.oeste;

    return `
        <div class="valores-carta">
            <span class="val-norte">${n}</span>
            <span class="val-oeste">${o}</span>
            <span class="val-este">${e}</span>
            <span class="val-sur">${s}</span>
        </div>
    `;
}


document.addEventListener("DOMContentLoaded", () => {
    // Escucha el momento exacto en el que el header termina su animación de introducción
    const header = document.querySelector("header");
    
    if (header) {
        header.addEventListener("animationend", (event) => {
            // Aseguramos que responda a la animación del título
            if (event.animationName === "introFight") {
                // Sube la pantalla suavemente hasta el margen superior absoluto
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth"
                });
            }
        });
    }

});