const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

const player = {
    x: 300,
    y: 200,
    width: 50,
    height: 70,
    speed: 5
};

const keys = {};

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

function updatePlayer() {
    if (keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["s"]) {
        player.y += player.speed;
    }

    if (keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["d"]) {
        player.x += player.speed;
    }

    // Mantener al jugador dentro de la pantalla

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.y < 0) {
        player.y = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

function drawPlayer() {
    const x = player.x;
    const y = player.y;

    // Sombra
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(x + 25, y + 68, 23, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pierna izquierda
    ctx.fillStyle = "#303030";
    ctx.fillRect(x + 10, y + 48, 11, 20);

    // Pierna derecha
    ctx.fillRect(x + 29, y + 48, 11, 20);

    // Cuerpo
    ctx.fillStyle = "#00ff66";
    ctx.fillRect(x + 7, y + 24, 36, 30);

    // Cabeza
    ctx.fillStyle = "#f0b27a";
    ctx.beginPath();
    ctx.arc(x + 25, y + 14, 14, 0, Math.PI * 2);
    ctx.fill();

    // Pelo
    ctx.fillStyle = "#202020";
    ctx.beginPath();
    ctx.arc(x + 25, y + 10, 14, Math.PI, Math.PI * 2);
    ctx.fill();

    // Brazo izquierdo
    ctx.fillStyle = "#f0b27a";
    ctx.fillRect(x, y + 28, 8, 22);

    // Brazo derecho
    ctx.fillRect(x + 42, y + 28, 8, 22);

    // Ojos
    ctx.fillStyle = "#111111";
    ctx.fillRect(x + 19, y + 12, 3, 3);
    ctx.fillRect(x + 29, y + 12, 3, 3);

    // Detalle del cuerpo
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 20, y + 31, 10, 8);
}

function gameLoop() {
    // Fondo
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("CHAIN-BREAKER ENGINE", 20, 45);

    updatePlayer();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();