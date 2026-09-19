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

// ==========================================
// MAP ZONES
// ==========================================

const zones = [
    {
        x: 0,
        y: 60,
        width: 900,
        height: 700,
        type: "grass"
    },
    {
        x: 900,
        y: 60,
        width: 700,
        height: 700,
        type: "stone"
    },
    {
        x: 1600,
        y: 60,
        width: 800,
        height: 700,
        type: "grass"
    },
    {
        x: 0,
        y: 760,
        width: 1200,
        height: 840,
        type: "sand"
    },
    {
        x: 1200,
        y: 760,
        width: 1200,
        height: 840,
        type: "grass"
    }
];

// ==========================================
// WALLS
// ==========================================

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
// DECORATION
// ==========================================

const decorations = [
    { x: 100, y: 220, type: "tree" },
    { x: 700, y: 300, type: "tree" },
    { x: 350, y: 650, type: "tree" },
    { x: 950, y: 850, type: "tree" },
    { x: 1500, y: 1300, type: "tree" },
    { x: 2100, y: 850, type: "tree" },

    { x: 500, y: 800, type: "rock" },
    { x: 1000, y: 400, type: "rock" },
    { x: 1750, y: 180, type: "rock" },
    { x: 2200, y: 1200, type: "rock" }
];

// ==========================================
// INTERACTIVE OBJECTS
// ==========================================

const interactiveObjects = [
    {
        x: 620,
        y: 350,
        width: 60,
        height: 60,
        type: "crate",
        active: false
    }
];

const interactionDistance = 100;

let nearbyObject = null;

// ==========================================
// INPUT
// ==========================================

const keys = {};

window.addEventListener("keydown", (event) => {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (key === "e") {
        interactWithObject();
    }
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
// DISTANCE
// ==========================================

function getDistanceBetweenObjects(a, b) {

    const centerAX = a.x + a.width / 2;
    const centerAY = a.y + a.height / 2;

    const centerBX = b.x + b.width / 2;
    const centerBY = b.y + b.height / 2;

    const distanceX = centerAX - centerBX;
    const distanceY = centerAY - centerBY;

    return Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
    );
}

// ==========================================
// DECORATION COLLISION BOX
// ==========================================

function getDecorationCollisionBox(decoration) {

    if (decoration.type === "tree") {

        return {
            x: decoration.x - 18,
            y: decoration.y - 10,
            width: 36,
            height: 55
        };
    }

    if (decoration.type === "rock") {

        return {
            x: decoration.x - 22,
            y: decoration.y - 15,
            width: 44,
            height: 30
        };
    }

    return null;
}

// ==========================================
// CHECK WORLD COLLISIONS
// ==========================================

function isBlocked(position) {

    for (const wall of walls) {

        if (isColliding(position, wall)) {
            return true;
        }
    }

    for (const decoration of decorations) {

        const collisionBox =
            getDecorationCollisionBox(decoration);

        if (
            collisionBox &&
            isColliding(position, collisionBox)
        ) {
            return true;
        }
    }

    for (const object of interactiveObjects) {

        if (isColliding(position, object)) {
            return true;
        }
    }

    return false;
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

    const horizontalPosition = {
        x: nextX,
        y: player.y,
        width: player.width,
        height: player.height
    };

    if (!isBlocked(horizontalPosition)) {
        player.x = nextX;
    }

    const verticalPosition = {
        x: player.x,
        y: nextY,
        width: player.width,
        height: player.height
    };

    if (!isBlocked(verticalPosition)) {
        player.y = nextY;
    }

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
// FIND NEARBY OBJECT
// ==========================================

function updateNearbyObject() {

    nearbyObject = null;

    let closestDistance = Infinity;

    for (const object of interactiveObjects) {

        const distance =
            getDistanceBetweenObjects(
                player,
                object
            );

        if (
            distance <= interactionDistance &&
            distance < closestDistance
        ) {
            nearbyObject = object;
            closestDistance = distance;
        }
    }
}

// ==========================================
// INTERACTION SYSTEM
// ==========================================

function interactWithObject() {

    if (!nearbyObject) {
        return;
    }

    if (nearbyObject.type === "crate") {

        interactWithCrate(nearbyObject);
    }
}

// ==========================================
// CRATE INTERACTION
// ==========================================

function interactWithCrate(crate) {

    crate.active = !crate.active;

    if (crate.active) {
        console.log("Has interactuado con la caja.");
    } else {
        console.log("Has dejado de interactuar con la caja.");
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
// DRAW ZONES
// ==========================================

function drawZones() {

    for (const zone of zones) {

        if (zone.type === "grass") {
            ctx.fillStyle = "#26352b";
        }

        if (zone.type === "stone") {
            ctx.fillStyle = "#353535";
        }

        if (zone.type === "sand") {
            ctx.fillStyle = "#66583b";
        }

        ctx.fillRect(
            zone.x,
            zone.y,
            zone.width,
            zone.height
        );
    }
}

// ==========================================
// DRAW MAP DETAILS
// ==========================================

function drawMapDetails() {

    ctx.strokeStyle = "rgba(255,255,255,0.035)";
    ctx.lineWidth = 1;

    const gridSize = 100;

    for (let x = 0; x <= world.width; x += gridSize) {

        ctx.beginPath();
        ctx.moveTo(x, 60);
        ctx.lineTo(x, world.height);
        ctx.stroke();
    }

    for (let y = 60; y <= world.height; y += gridSize) {

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(world.width, y);
        ctx.stroke();
    }
}

// ==========================================
// DRAW WALLS
// ==========================================

function drawWalls() {

    for (const wall of walls) {

        ctx.fillStyle = "#6b6b6b";

        ctx.fillRect(
            wall.x,
            wall.y,
            wall.width,
            wall.height
        );

        ctx.strokeStyle = "#999999";
        ctx.lineWidth = 2;

        ctx.strokeRect(
            wall.x,
            wall.y,
            wall.width,
            wall.height
        );
    }
}

// ==========================================
// DRAW TREE
// ==========================================

function drawTree(x, y) {

    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 35,
        28,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#5b3a24";

    ctx.fillRect(
        x - 6,
        y,
        12,
        30
    );

    ctx.fillStyle = "#1f6b3a";

    ctx.beginPath();

    ctx.arc(
        x,
        y - 5,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#2d8a4d";

    ctx.beginPath();

    ctx.arc(
        x - 12,
        y - 10,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        x + 12,
        y - 10,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

// ==========================================
// DRAW ROCK
// ==========================================

function drawRock(x, y) {

    ctx.fillStyle = "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        x,
        y + 12,
        25,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#777777";

    ctx.beginPath();

    ctx.moveTo(x - 20, y + 10);
    ctx.lineTo(x - 15, y - 10);
    ctx.lineTo(x + 5, y - 18);
    ctx.lineTo(x + 22, y - 5);
    ctx.lineTo(x + 15, y + 12);
    ctx.closePath();

    ctx.fill();

    ctx.strokeStyle = "#999999";
    ctx.stroke();
}

// ==========================================
// DRAW DECORATIONS
// ==========================================

function drawDecorations() {

    for (const decoration of decorations) {

        if (decoration.type === "tree") {

            drawTree(
                decoration.x,
                decoration.y
            );
        }

        if (decoration.type === "rock") {

            drawRock(
                decoration.x,
                decoration.y
            );
        }
    }
}

// ==========================================
// DRAW INTERACTION INDICATOR
// ==========================================

function drawInteractionIndicator() {

    if (!nearbyObject) {
        return;
    }

    const centerX =
        nearbyObject.x +
        nearbyObject.width / 2;

    const centerY =
        nearbyObject.y - 20;

    ctx.save();

    ctx.translate(
        -camera.x,
        -camera.y
    );

    ctx.fillStyle = "#ffffff";

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle = "#202020";

    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "E",
        centerX,
        centerY
    );

    ctx.restore();
}

// ==========================================
// DRAW INTERACTIVE OBJECTS
// ==========================================

function drawInteractiveObjects() {

    for (const object of interactiveObjects) {

        ctx.fillStyle = object.active
            ? "#35d0ff"
            : "#b87532";

        ctx.fillRect(
            object.x,
            object.y,
            object.width,
            object.height
        );

        ctx.strokeStyle = object.active
            ? "#b8f3ff"
            : "#e5b477";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            object.x,
            object.y,
            object.width,
            object.height
        );

        ctx.strokeStyle = "#3a2415";
        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.moveTo(
            object.x,
            object.y
        );

        ctx.lineTo(
            object.x + object.width,
            object.y + object.height
        );

        ctx.moveTo(
            object.x + object.width,
            object.y
        );

        ctx.lineTo(
            object.x,
            object.y + object.height
        );

        ctx.stroke();
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

    ctx.save();

    ctx.translate(
        -camera.x,
        -camera.y
    );

    drawZones();
    drawMapDetails();
    drawDecorations();
    drawInteractiveObjects();
    drawInteractionIndicator();
    drawWalls();

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

    ctx.fillStyle = "rgba(0,0,0,0.35)";

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

    ctx.fillStyle = "#00ff66";

    ctx.fillRect(
        x + 7,
        y + 24,
        36,
        30
    );

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
// DRAW UI
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

    if (nearbyObject) {

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Arial";

        ctx.fillText(
            "Press E to interact",
            20,
            75
        );
    }
}

// ==========================================
// GAME LOOP
// ==========================================

function gameLoop() {

    movePlayer();

    updateNearbyObject();

    updateCamera();

    drawWorld();

    drawPlayer();

    drawUI();

    requestAnimationFrame(gameLoop);
}

gameLoop();