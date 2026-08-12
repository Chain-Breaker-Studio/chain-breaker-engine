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
    height: 50,
    speed: 5,
    color: "#00ff66"
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

    // No permitir que el jugador salga de la pantalla

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
    ctx.fillStyle = player.color;
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}

function gameLoop() {

    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("CHAIN-BREAKER ENGINE", 20, 45);

    updatePlayer();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();