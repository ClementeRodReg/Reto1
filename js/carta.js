export class Carta {
    /**
     * @param {string} nombre - Nombre del personaje o monstruo (Ej: "Squall", "Chocobo").
     * @param {Object} valores - Objeto con los 4 números de la carta { norte, sur, este, oeste }.
     * @param {string} imagen - Ruta de la imagen de fondo/ilustración.
     * @param {string|null} elemento - Elemento de la carta (Ej: "fuego", "tierra", o null si no tiene).
     */
    constructor(nombre, valores, imagen, elemento = null) {
        this.nombre = nombre;
        
        // Valores numéricos para las comparaciones 
        this.valores = {
            norte: valores.norte,
            sur: valores.sur,
            este: valores.este,
            oeste: valores.oeste
        };
        
        this.imagen = imagen;
        this.elemento = elemento;
        
        // Estado dinámico dentro de la partida
        this.propietario = null; // Guardará 'azul' o 'rojo' cuando se asigne a un jugador
    }

    /**
     * Cambia el bando de la carta al equipo contrario (Volteo)
     */
    cambiarPropietario() {
        this.propietario = this.propietario === 'azul' ? 'rojo' : 'azul';
    }

    /**
     * Devuelve el valor de un lado específico. 
     * @param {string} lado - 'norte', 'sur', 'este' u 'oeste'.
     * @returns {number}
     */
    obtenerValorLado(lado) {
        const valor = this.valores[lado];
        return valor === 10 ? 10 : Number(valor);
    }
}