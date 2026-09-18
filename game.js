const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resize);
resize();

// ==========================================
// PLAYER
// ==========================================

const player = {
    x: 500,
    y: 300,
    width: 50,
    height: 70,
    speed: 5
};

// ==========================================
// CAMERA
// ==========================================

const camera = {
    x: 0,
    y: 0
};

// ==========================================
// WORLD
// ==========================================

const world = {
    width: 2400,
    height: 1600
};

const walls = [
    {
        x: 150,
        y: 120,
        width: 500,
        height: 30
    },
    {
        x: 150,
        y: 500,
        width: 500,
        height: 30
    },
    {
        x: 800,
        y: 200,
        width: 30,
        height: 500
    },
    {
        x: 1100,
        y: 100,
        width: 600,
        height: 30
    },
    {
        x: 1100,
        y: 500,
        width: 600,
        height: 30
    },
    {
        x: 1800,
        y: 250,
        width: 30,
        height: 500
    },
    {
        x: 400,
        y: 900,
        width: 800,
        height: 30
    },
    {
        x: 1400,
        y: 1000,
        width: 600,
        height: 30
    }
];

// ==========================================
// INPUT
// ==========================================

const keys = {};

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

// ==========================================
// PLAYER MOVEMENT
// ==========================================

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

    // Mantener al jugador dentro del mundo

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.y < 60) {
        player.y = 60;
    }

    if (player.x + player.width > world.width) {
        player.x = world.width - player.width;
    }

    if (player.y + player.height > world.height) {
        player.y = world.height - player.height;
    }
}

// ==========================================
// CAMERA
// ==========================================

function updateCamera() {

    camera.x =
        player.x +
        player.width / 2 -
        canvas.width / 2;

    camera.y =
        player.y +
        player.height / 2 -
        canvas.height / 2;

    // Limitar cámara al mundo

    if (camera.x < 0) {
        camera.x = 0;
    }

    if (camera.y < 0) {
        camera.y = 0;
    }

    if (camera.x + canvas.width > world.width) {
        camera.x = world.width - canvas.width;
    }

    if (camera.y + canvas.height > world.height) {
        camera.y = world.height - canvas.height;
    }
}

// ==========================================
// DRAW WORLD
// ==========================================

function drawWorld() {

    ctx.fillStyle = "#202020";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Todo lo que pertenece al mundo
    // se dibuja teniendo en cuenta la cámara.

    ctx.save();

    ctx.translate(
        -camera.x,
        -camera.y
    );

    // Zona de juego

    ctx.fillStyle = "#26352b";

    ctx.fillRect(
        0,
        60,
        world.width,
        world.height - 60
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

    ctx.restore();
}

// ==========================================
// DRAW PLAYER
// ==========================================

function drawPlayer() {

    const x = player.x;
    const y = player.y;

    ctx.save();

    ctx.translate(
        -camera.x,
        -camera.y
    );

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

    ctx.restore();
}

// ==========================================
// UI
// ==========================================

function drawUI() {

    ctx.fillStyle = "white";

    ctx.font = "32px Arial";

    ctx.fillText(
        "CHAIN-BREAKER ENGINE",
        20,
        40
    );

    ctx.font = "16px Arial";

    ctx.fillText(
        "WASD - Move",
        20,
        canvas.height - 20
    );
}

// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    movePlayer();

    updateCamera();

    drawWorld();

    drawPlayer();

    drawUI();

    requestAnimationFrame(gameLoop);
}

gameLoop();