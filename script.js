const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let objetos = [];
let explosiones = [];
let contador = 0;

// 🎵 Música
const music = document.getElementById("bgMusic");
document.addEventListener("click", () => {
    music.play();
}, { once: true });

music.volume = 0.3;

// 🖼️ Imagen objeto
const img = new Image();
img.src = "assets/pazul.png";

// 🖼️ Fondo
const fondo = new Image();
fondo.src = "assets/otrofondo.jpg";

// 🔊 Sonido click
const sonidoClick = new Audio("assets/click.mp3");

// 🔥 Crear 25 objetos
for (let i = 0; i < 25; i++) {
    objetos.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4,
        size: 40,
        tipo: Math.random() < 0.25 ? "circular" : "normal",
        angulo: Math.random() * Math.PI * 2
    });
}

// 💥 Colisiones
function detectarColisiones() {
    for (let i = 0; i < objetos.length; i++) {
        for (let j = i + 1; j < objetos.length; j++) {

            let a = objetos[i];
            let b = objetos[j];

            let dx = a.x - b.x;
            let dy = a.y - b.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < a.size) {
                let tempDx = a.dx;
                let tempDy = a.dy;

                a.dx = b.dx;
                a.dy = b.dy;

                b.dx = tempDx;
                b.dy = tempDy;

                explosiones.push({
                    x: (a.x + b.x) / 2,
                    y: (a.y + b.y) / 2,
                    radio: 5,
                    alpha: 1
                });
            }
        }
    }
}

// 💥 Animación
function dibujarExplosiones() {
    explosiones.forEach((exp, index) => {
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radio, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, " + exp.alpha + ")";
        ctx.fill();

        exp.radio += 2;
        exp.alpha -= 0.05;

        if (exp.alpha <= 0) {
            explosiones.splice(index, 1);
        }
    });
}

// 🎮 Dibujar todo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

    objetos.forEach(obj => {

        // Movimiento
        if (obj.tipo === "circular") {
            obj.angulo += 0.05;
            obj.x += Math.cos(obj.angulo) * 2;
            obj.y += Math.sin(obj.angulo) * 2;
        } else {
            obj.x += obj.dx;
            obj.y += obj.dy;
        }

        // Rebote en bordes
        if (obj.x < 0 || obj.x + obj.size > canvas.width) obj.dx *= -1;
        if (obj.y < 0 || obj.y + obj.size > canvas.height) obj.dy *= -1;

        // Dibujar objeto
        ctx.drawImage(img, obj.x, obj.y, obj.size, obj.size);
    });

    detectarColisiones();
    dibujarExplosiones();

    requestAnimationFrame(draw);
}

draw();

// 🖱️ Click
canvas.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    objetos.forEach(obj => {
        if (
            mouseX > obj.x &&
            mouseX < obj.x + obj.size &&
            mouseY > obj.y &&
            mouseY < obj.y + obj.size
        ) {
            obj.x = Math.random() * canvas.width;
            obj.y = Math.random() * canvas.height;

            sonidoClick.currentTime = 0;
            sonidoClick.play();

            contador++;
            document.getElementById("contador").textContent = contador;
        }
    });
});