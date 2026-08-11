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
    color: "#00ff66"
};

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {

    // Fondo
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("CHAIN-BREAKER ENGINE", 20, 45);

    // Jugador
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

gameLoop();