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
        color: "red" },

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
        probabilidad: 0.15, 
        color: "blue" }
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
        fila.forEach((valor, x) => {
            if (valor) {
                tablero[posY + y][posX + x] = 1; // Marca la posición en el tablero
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
            tablero.splice(y, 1); // Elimina la fila completa
            tablero.unshift(Array(columnas).fill(0)); // Añade una nueva fila vacía al principio
            y++; // Revisar la misma fila nuevamente
            lineasEliminadas++;
        }
    }

    puntuacion += lineasEliminadas * 100;
    puntuacionElemento.textContent = puntuacion; // Actualiza el elemento HTML
}


function rotarMatriz(matriz) {
    return matriz[0].map((_, colIndex) =>
        matriz.map((fila) => fila[colIndex]).reverse()
    );
}

function actualizar() {
    if (!chequearColisiones(piezaActual, posX, posY + 1)) {
        posY++;
    } else {
        posicionaPieza(piezaActual, posX, posY);
        eliminarLinea();
        piezaActual = generarPieza();
        posX = 4;
        posY = 0;

        if (chequearColisiones(piezaActual, posX, posY)) {
            clearInterval(intervalo);
            alert("FIN DE LA PARTIDA, este juego ha sido desarrollado por Alejandro");
        }
    }

    dibujarTablero();
    dibujarPieza(piezaActual, posX, posY);
}

let piezaActual = generarPieza();
let intervalo;

function jugar() {
    intervalo = setInterval(actualizar, 500);
}

document.addEventListener("keydown", (e) => {
    if (e.key === "a") {
        if (!chequearColisiones(piezaActual, posX - 1, posY)) {
            posX--;
        }
    } else if (e.key === "d") {
        if (!chequearColisiones(piezaActual, posX + 1, posY)) {
            posX++;
        }
    } else if (e.key === "s") {
        if (!chequearColisiones(piezaActual, posX, posY + 1)) {
            posY++;
        }
    } else if (e.key === "w") {
        const piezaRotada = { ...piezaActual, forma: rotarMatriz(piezaActual.forma) };
        if (!chequearColisiones(piezaRotada, posX, posY)) {
            piezaActual.forma = piezaRotada.forma; // Actualiza la forma si no hay colisión
        }
    }

    dibujarTablero();
    dibujarPieza(piezaActual, posX, posY);
});

dibujarTablero();
jugar();