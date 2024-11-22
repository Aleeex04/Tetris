const canvas = document.getElementById("tetris");
const lienzo = canvas.getContext("2d");

const filas = 20;
const columnas = 10;
const tamanoCelda = 30; // Tamaño de las celdas en píxeles
const tablero = Array.from({ length: filas }, () => Array(columnas).fill(0));

function dibujarTablero() {
    for (let y = 0; y < filas; y++) {
        for (let x = 0; x < columnas; x++) {
            lienzo.fillStyle = tablero[y][x] === 1 ? "#808080" : "#000"; // Gris para 1, negro para 0
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
        nombre: "C",
        forma: [
            [1, 1, 1],
            [1, 0, 1],
        ],
        probabilidad: 0.3,
        color: "blue",
    },
    {
        nombre: "T",
        forma: [
            [1, 1, 1],
            [0, 1, 0],
        ],
        probabilidad: 0.3,
        color: "yellow",
    },
    {
        nombre: "O",
        forma: [
            [1, 1],
            [1, 1],
        ],
        probabilidad: 0.2,
        color: "green",
    },
    {
        nombre: "I",
        forma: [
            [1, 1, 1, 1],
        ],
        probabilidad: 0.2,
        color: "blue",
    },
    {
        nombre: "L",
        forma: [
            [1, 0],
            [1, 0],
            [1, 1],
        ],
        probabilidad: 0.15,
        color: "orange",
    },
    {
        nombre: "Z",
        forma: [
            [1, 1, 0],
            [0, 1, 1],
        ],
        probabilidad: 0.15,
        color: "red",
    },
];

function dibujarPieza(pieza, posX, posY) {
    pieza.forma.forEach((fila, y) => {
        fila.forEach((valor, x) => {
            if (valor) {
                lienzo.fillStyle = pieza.color; // Pintamos el color de la pieza
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

    for (const pieza of piezas) {
        acumulador += pieza.probabilidad;
        if (random <= acumulador) {
            return pieza; // retorna la pieza seleccionada
        }
    }
    return piezas[piezas.length - 1]; // por si acaso, retorna la última pieza
}

const piezaActual = generarPieza(); // genera una pieza aleatoria
dibujarPieza(piezaActual, 4, 0); // Dibujar la pieza en posición (4, 0)

function chequearColisiones(pieza, posX, posY){

}

function posicionaPieza(pieza, posX, posY){
    
}

function eliminarLinea(){
    
}

function actualizar(){
    
}

function jugar(){
    
}


