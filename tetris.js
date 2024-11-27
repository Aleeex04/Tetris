const canvas = document.getElementById("tetris");
const lienzo = canvas.getContext("2d");

const filas = 20;
const columnas = 10;
const tamanoCelda = 30; // tamaño de las celdas en pixeles
const tablero = Array.from({ length: filas }, () => Array(columnas).fill(0));

let posX = 4; //aparece la pieza en medio del tablero
let posY = 0;

function dibujarTablero() {
    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            lienzo.fillStyle = tablero[y][x] === 1 ? "gray" : "black"; // Gris para 1, negro para 0
            lienzo.fillRect(
                x * tamanoCelda, 
                y * tamanoCelda, 
                tamanoCelda, 
                tamanoCelda
            );
            lienzo.strokeStyle = "#333"; // lineas de rejilla
            lienzo.strokeRect(x * tamanoCelda,
                y * tamanoCelda,
                tamanoCelda,
                tamanoCelda);
        }
    }
}
dibujarTablero(); 

const piezas = [

    {
        nombre: "O", 
        forma: [[1, 1], 
                [1, 1]], 
        probabilidad: 0.142, 
        color: "green" },

    {   nombre: "S", 
        forma: [[0, 1, 1], 
                [1, 1, 0]], 
        probabilidad: 0.142, 
        color: "violet" },

    {   nombre: "Z", 
        forma: [[1, 1, 0], 
                [0, 1, 1]], 
        probabilidad: 0.142,
        color: "blue" },

    {   nombre: "L", 
        forma: [[1, 0], 
                [1, 0], 
                [1, 1]], 
        probabilidad: 0.142, 
        color: "orange" },

    {   nombre: "J", 
        forma: [[0, 1], 
                [0, 1], 
                [1, 1]], 
        probabilidad: 0.142, 
        color: "blue" },

    {   nombre: "T", 
        forma: [[1, 1, 1], 
                [0, 1, 0]], 
        probabilidad: 0.142, 
        color: "yellow" },

    {   nombre: "I", 
        forma: [[1, 1, 1, 1]], 
        probabilidad: 0.142, 
        color: "lightblue" },

    {   nombre: "C", 
        forma: [[1, 1, 1], 
                [1, 0, 1]], 
        probabilidad: 0.13, 
        color: "red" }
];

function dibujarPieza(pieza, posX, posY) {
    pieza.forma.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if (valor) {
                lienzo.fillStyle = pieza.color; // pintamos el color de la pieza
                lienzo.fillRect(
                    (posX + x) * tamanoCelda,
                    (posY + y) * tamanoCelda, 
                    tamanoCelda, 
                    tamanoCelda
                );
            }
        });
    });
}

function generarPieza() {
    const random = Math.random(); // num aleatorio entre 0 y 1
    let acumulador = 0; //para juntar todas las probabilidades de todas las piezas

    for (let pieza of piezas) {
        acumulador += pieza.probabilidad;

        if (random <= acumulador) {
            return pieza; // retorna la pieza seleccionada
        }
    }
    return piezas[piezas.length - 1]; // por si acaso, retorna la última pieza
}

function chequearColisiones(pieza, posX, posY) {
    for (let y = 0; y < pieza.forma.length; y++) {
        for (let x = 0; x < pieza.forma[y].length; x++) {
            if (pieza.forma[y][x]) {
                const tableroX = posX + x;
                const tableroY = posY + y;

                if (
                    tableroX < 0 || // Colisión con el borde izquierdo
                    tableroX >= columnas || // Colisión con el borde derecho
                    tableroY >= filas || // Colisión con el fondo
                    (tableroY >= 0 && tablero[tableroY][tableroX] === 1) // Colisión con una pieza
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function posicionaPieza(pieza, posX, posY) {
    pieza.forma.forEach((fila, y) => {
        fila.forEach((valor, x) => { //recorre la matriz de la pieza
            if (valor) {
                tablero[posY + y][posX + x] = 1; // si el valor es 1 marca la posicion en el tablero
            }
        }); 
    });
}

let puntuacion = 0;
const puntuacionElemento = document.getElementById("puntuacion");

function eliminarLinea() {
    let lineasEliminadas = 0;

    for (let y = filas - 1; y >= 0; y--) {
        if (tablero[y].every((celda) => celda === 1)) {
            tablero.splice(y, 1); // elimina la fila completa
            tablero.unshift(Array(columnas).fill(0)); // ñade una nueva fila de 0 al principio
            y++; // verifica la nueva fila en la misma posición
            lineasEliminadas++;
        }
    }

    if (lineasEliminadas > 0) { //sistema de puntacion
        let multiplicador;

        switch (lineasEliminadas) {
            case 1:
                multiplicador = 1;
                break;
            case 2:
                multiplicador = 1.5;
                break;
            case 3:
                multiplicador = 2;
                break;
            case 4:
                multiplicador = 3; 
                break;
            default:
                multiplicador = 1;
        }

        puntuacion += Math.floor(lineasEliminadas * 100 * multiplicador);
        puntuacionElemento.textContent = puntuacion; // actualiza el html con la nueva puntuacion
    }
}



function rotarMatriz(matriz) {
    return matriz[0].map((_, colIndex) =>
        matriz.map((fila) => fila[colIndex]).reverse()
    );
}

const canvasProximaFicha = document.getElementById("proximaFicha");
const lienzoProximaFicha = canvasProximaFicha.getContext("2d");

let piezaActual = generarPieza(); 
let proximaPieza = generarPieza(); 

function dibujarProximaPieza(proximaPieza) {
    lienzoProximaFicha.clearRect(0, 0, canvasProximaFicha.width, canvasProximaFicha.height); // limpia el canvas para generar la proxima pieza
    const tamanoCeldaFicha = tamanoCelda; // usa el mismo tamaño de celdas

    //para centrar la proxima pieza en el canvas (math floor redonde hacia abajo)
    const offsetX = Math.floor((canvasProximaFicha.width / tamanoCeldaFicha - proximaPieza.forma[0].length) / 2);
    const offsetY = Math.floor((canvasProximaFicha.height / tamanoCeldaFicha - proximaPieza.forma.length) / 2);

    proximaPieza.forma.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if (valor) {
                lienzoProximaFicha.fillStyle = proximaPieza.color; // color de la pieza
                lienzoProximaFicha.fillRect(
                    (x + offsetX) * tamanoCeldaFicha,
                    (y + offsetY) * tamanoCeldaFicha,
                    tamanoCeldaFicha,
                    tamanoCeldaFicha
                );
            }
        });
    });
}
dibujarProximaPieza(proximaPieza);

function actualizar() {
    if (!chequearColisiones(piezaActual, posX, posY + 1)) {
        posY++;
    } else {
        posicionaPieza(piezaActual, posX, posY);
        eliminarLinea();

        piezaActual = proximaPieza; // la proxima pieza se convierte en la actual
        proximaPieza = generarPieza(); 
        dibujarProximaPieza(proximaPieza); // actualiza el canvas mostrando la proxima pieza

        posX = 4; // reinicia la posición de la pieza
        posY = 0;

        if (chequearColisiones(piezaActual, posX, posY)) {
            clearInterval(intervalo);
            alert("FIN DE LA PARTIDA, este juego ha sido desarrollado por Alex Roca");
        }
    }

    dibujarTablero();
    dibujarPieza(piezaActual, posX, posY);
}

let intervalo;

function jugar() {
    intervalo = setInterval(actualizar, 500);
}


document.addEventListener("keydown", (e) => {
    if (e.key === "a" || e.key === "A") {
        if (!chequearColisiones(piezaActual, posX - 1, posY)) {
            posX--;
        }
    } else if (e.key === "d" || e.key === "D") {
        if (!chequearColisiones(piezaActual, posX + 1, posY)) {
            posX++;
        }
    } else if (e.key === "s" || e.key === "S") {
        if (!chequearColisiones(piezaActual, posX, posY + 1)) {
            posY++;
        }
    } else if (e.key === "w" || e.key === "W") {
        const piezaRotada = { ...piezaActual, forma: rotarMatriz(piezaActual.forma) };
        if (!chequearColisiones(piezaRotada, posX, posY)) {
            piezaActual.forma = piezaRotada.forma; // actualiza la forma si no hay colisión
        }
    }

    dibujarTablero();
    dibujarPieza(piezaActual, posX, posY);
});
jugar();

