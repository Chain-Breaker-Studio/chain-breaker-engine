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

// ==========================================
// WORLD
// ==========================================

const walls = [
    {
        x: 150,
        y: 120,
        width: 300,
        height: 30
    },
    {
        x: 150,
        y: 400,
        width: 300,
        height: 30
    },
    {
        x: 600,
        y: 180,
        width: 30,
        height: 250
    },
    {
        x: 800,
        y: 100,
        width: 250,
        height: 30
    }
];

// ==========================================
// INPUT
// ==========================================

window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// ==========================================
// COLLISION
// ==========================================

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function movePlayer() {

    let nextX = player.x;
    let nextY = player.y;

    if (keys["w"]) {
        nextY -= player.speed;
    }

    if (keys["s"]) {
        nextY += player.speed;
    }

    if (keys["a"]) {
        nextX -= player.speed;
    }

    if (keys["d"]) {
        nextX += player.speed;
    }

    const futurePosition = {
        x: nextX,
        y: nextY,
        width: player.width,
        height: player.height
    };

    let blocked = false;

    for (const wall of walls) {
        if (isColliding(futurePosition, wall)) {
            blocked = true;
            break;
        }
    }

    if (!blocked) {
        player.x = nextX;
        player.y = nextY;
    }

    // Mantener al jugador dentro de la pantalla

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.y < 60) {
        player.y = 60;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

// ==========================================
// DRAW WORLD
// ==========================================

function drawWorld() {

    // Fondo
    ctx.fillStyle = "#202020";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Zona de juego
    ctx.fillStyle = "#26352b";
    ctx.fillRect(
        0,
        60,
        canvas.width,
        canvas.height - 60
    );

    // Paredes
    for (const wall of walls) {

        ctx.fillStyle = "#6b6b6b";

        ctx.fillRect(
            wall.x,
            wall.y,
            wall.width,
            wall.height
        );

        ctx.strokeStyle = "#999999";

        ctx.strokeRect(
            wall.x,
            wall.y,
            wall.width,
            wall.height
        );
    }
}

// ==========================================
// DRAW PLAYER
// ==========================================

function drawPlayer() {

    const x = player.x;
    const y = player.y;

    // Sombra
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";

    ctx.beginPath();

    ctx.ellipse(
        x + 25,
        y + 68,
        23,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Piernas
    ctx.fillStyle = "#303030";

    ctx.fillRect(
        x + 10,
        y + 48,
        11,
        20
    );

    ctx.fillRect(
        x + 29,
        y + 48,
        11,
        20
    );

    // Cuerpo
    ctx.fillStyle = "#00ff66";

    ctx.fillRect(
        x + 7,
        y + 24,
        36,
        30
    );

    // Cabeza
    ctx.fillStyle = "#f0b27a";

    ctx.beginPath();

    ctx.arc(
        x + 25,
        y + 14,
        14,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Pelo
    ctx.fillStyle = "#202020";

    ctx.beginPath();

    ctx.arc(
        x + 25,
        y + 10,
        14,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();

    // Brazos
    ctx.fillStyle = "#f0b27a";

    ctx.fillRect(
        x,
        y + 28,
        8,
        22
    );

    ctx.fillRect(
        x + 42,
        y + 28,
        8,
        22
    );

    // Ojos
    ctx.fillStyle = "#111111";

    ctx.fillRect(
        x + 19,
        y + 12,
        3,
        3
    );

    ctx.fillRect(
        x + 29,
        y + 12,
        3,
        3
    );

    // Detalle del cuerpo
    ctx.fillStyle = "#ffffff";

    ctx.fillRect(
        x + 20,
        y + 31,
        10,
        8
    );
}

// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    drawWorld();

    ctx.fillStyle = "white";

    ctx.font = "32px Arial";

    ctx.fillText(
        "CHAIN-BREAKER ENGINE",
        20,
        40
    );

    movePlayer();

    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();