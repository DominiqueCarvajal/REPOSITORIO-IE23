let fondoImg; // Variable para la imagen de fondo
let cuadradoImg; // Variable para la imagen cuadrada
let rectangulos = []; // Arreglo de rectángulos
let rectanguloInicial; // Rectángulo inicial en la esquina superior izquierda

function preload() {
  fondoImg = loadImage('FONDO.jpg'); // Carga tu imagen de fondo
  cuadradoImg = loadImage('deco2.jpg'); // Carga tu imagen cuadrada
  // Reemplaza 'tu_imagen.jpg' con la ruta de tu imagen cuadrada
}

function setup() {
  createCanvas(2000, 800); // Establece el tamaño del lienzo (ancho x alto)

  // Crea el rectángulo inicial en la esquina superior izquierda
  rectanguloInicial = new RectanguloInicial(0, 0); // Cambio en la posición inicial

  // Crea una instancia de CuadradoImagen
  cuadrado = new CuadradoImagen(200, 100, 1000, 600); // Cambia la posición, ancho y alto según tus necesidades

  // Crea los rectángulos en ubicaciones fijas
  let ubicacionesFijas = [
    { x: 1500, y: 70, url: 'https://dominiquecarvajal.github.io/imagenescrita23-dominiquecarvajal/', nombre: 'Tarea 1', extension: 'Texto de extensión para Tarea 1' },
    { x: 1500, y: 250, url: 'https://dominiquecarvajal.github.io/imagen-escrita-tarea2-23/', nombre: 'Tarea 2', extension: 'Texto de extensión para Tarea 2' },
    { x: 1500, y: 425, url: 'https://dominiquecarvajal.github.io/tarea3-ie23-dominiquecarvajal/', nombre: 'Tarea 3', extension: 'Texto de extensión para Tarea 3' },
    { x: 1500, y: 610, url: 'https://dominiquecarvajal.github.io/Tarea4-IE23-DominiqueCG/', nombre: 'Tarea 4', extension: 'Texto de extensión para Tarea 4' },
    { x: 1700, y: 170, url: 'https://dominiquecarvajal.github.io/Tarea-5-IE-DC/', nombre: 'Tarea 5', extension: 'Texto de extensión para Tarea 5' },
    { x: 1700, y: 340, url: 'https://dominiquecarvajal.github.io/Tarea-6-IE-DC/', nombre: 'Tarea 6', extension: 'Texto de extensión para Tarea 6' },
    { x: 1700, y: 510, url: 'https://dominiquecarvajal.github.io/TAREA-7-IE-DC/', nombre: 'Tarea 7', extension: 'Texto de extensión para Tarea 7' }
  ];

  for (let ubicacion of ubicacionesFijas) {
    let lado = 150; // Establece el tamaño de los rectángulos (puedes cambiarlo)
    let extensionDirection = ubicacion.x === 1500 ? -1 : 1; // Determina la dirección de la extensión
    let rectangulo = new Rectangulo(ubicacion.x, ubicacion.y, lado, ubicacion.nombre, ubicacion.url, ubicacion.extension, extensionDirection);
    rectangulos.push(rectangulo);
  }
}

function draw() {
  background(fondoImg); // Establece la imagen de fondo

  // Dibuja el rectángulo inicial
  rectanguloInicial.mostrar();

  // Dibuja los rectángulos
  for (let rectangulo of rectangulos) {
    rectangulo.mostrar();
    rectangulo.interactuar(mouseX, mouseY);
  }

  // Dibuja la imagen cuadrada
  cuadrado.mostrar();
}

function mousePressed() {
  for (let rectangulo of rectángulos) {
    if (rectangulo.seleccionado) {
      window.open(rectangulo.url, '_blank');
    }
  }
}

class Rectangulo {
  constructor(x, y, lado, nombre, url, extension, extensionDirection) {
    this.x = x;
    this.y = y;
    this.ancho = lado; // El ancho inicial es igual al lado
    this.alto = lado; // La altura inicial es igual al lado
    this.expandir = false;
    this.nombre = nombre; // Nombre del rectángulo
    this.url = url; // URL de redirección
    this.seleccionado = false; // Indicador de selección
    this.extension = extension; // Texto de extensión
    this.extensionSize = 0; // Tamaño de la extensión
    this.extensionDirection = extensionDirection; // Dirección de la extensión (-1: izquierda, 1: derecha)
  }

  mostrar() {
    fill(100);
    stroke(255);
    let xPosition = this.extensionDirection === 1 ? this.x : this.x - this.extensionSize;
    rect(xPosition, this.y, this.ancho + this.extensionSize, this.alto);

    // Muestra el nombre solo cuando el rectángulo se expande
    if (this.expandir) {
      textAlign(CENTER, CENTER);
      textSize(16);
      fill(255);
      text(this.nombre, xPosition + (this.ancho + this.extensionSize) / 2, this.y + this.alto / 2);
    }
    
    // Muestra la extensión
    if (this.expandir) {
      textAlign(CENTER, CENTER);
      textSize(16);
      fill(255);
      let extensionX = this.extensionDirection === 1 ? xPosition - this.extensionSize / 2 : xPosition + this.ancho + this.extensionSize / 2;
      text(this.extension, extensionX, this.y + this.alto / 2);
    }
  }

  interactuar(mx, my) {
    // Verifica si el mouse está sobre este rectángulo
    let xStart = this.extensionDirection === 1 ? this.x : this.x - this.extensionSize;
    if (mx > xStart && mx < xStart + this.ancho + this.extensionSize && my > this.y && my < this.y + this.alto) {
      this.expandir = true;
      this.seleccionado = true;
    } else {
      this.expandir = false;
      this.seleccionado = false;
    }

    // Ajusta el ancho de la extensión en función de si se debe expandir o no
    if (this.expandir) {
      this.extensionSize = lerp(this.extensionSize, 150, 0.1);
      this.extensionSize = constrain(this.extensionSize, 0, width - xStart); // Evitar que se salga del lienzo
    } else {
      this.extensionSize = lerp(this.extensionSize, 0, 0.1);
    }
  }
}

class RectanguloInicial {
  constructor(x, y) {
    this.x = x;
    this.y = 0; // Cambio en la posición inicial
    this.ancho = 0; // Ancho inicial
    this.alto = 60; // Altura fija
    this.velocidad = 2; // Velocidad de expansión
    this.texto = "➣ Interfaz De Tareas〔Dominique Carvajal Gonzalez〕 "; // Texto a mostrar
    this.franjaExtendida = false; // Variable para controlar el estado de la franja
  }

  mostrar() {
    fill(100);
    stroke(255);

    if (!this.franjaExtendida) {
      if (this.ancho < width) {
        rect(this.x, this.y, this.ancho, this.alto);
        this.ancho += this.velocidad;
      } else {
        this.franjaExtendida = true; // Cambia el estado de la franja cuando llega al otro extremo
      }
    } else {
      rect(this.x, this.y, width - this.x, this.alto); // Mantiene la franja extendida
    }

    if (this.franjaExtendida) {
      textAlign(CENTER, CENTER);
      textSize(16);
      fill(255);
      text(this.texto, this.x + (width - this.x) / 2, this.y + this.alto / 2);
    }
  }
}

class CuadradoImagen {
  constructor(x, y, ancho, alto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho; // Ancho del cuadrado de imagen
    this.alto = alto; // Alto del cuadrado de imagen
  }

  mostrar() {
    image(cuadradoImg, this.x, this.y, this.ancho, this.alto);
  }
}
