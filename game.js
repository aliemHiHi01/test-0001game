const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: canvas.height - 60, width: 50, height: 50, dy: 0, gravity: 0.5, jumpPower: -10, onGround: true };
let obstacles = [];
let collectibles = [];
let score = 0;
let gameState = "start"; // Các trạng thái: start, playing, gameOver
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

// Tạo chướng ngại vật
function createObstacle() {
    const obstacle = { x: canvas.width, y: canvas.height - 60, width: 50, height: 50 };
    obstacles.push(obstacle);
}

// Tạo điểm thưởng
function createCollectible() {
    const collectible = { x: Math.random() * canvas.width, y: Math.random() * (canvas.height - 60), width: 20, height: 20 };
    collectibles.push(collectible);
}

// Cập nhật game
function update() {
    if (gameState === "playing") {
        player.dy += player.gravity;
        player.y += player.dy;

        // Xử lý nhảy
        if (spacePressed && player.onGround) {
            player.dy = player.jumpPower;
            player.onGround = false;
        }

        // Rơi xuống đất
        if (player.y >= canvas.height - player.height) {
            player.y = canvas.height - player.height;
            player.onGround = true;
        }

        // Tạo chướng ngại vật
        if (Math.random() < 0.02) {
            createObstacle();
        }

        // Tạo điểm thưởng
        if (Math.random() < 0.01) {
            createCollectible();
        }

        // Di chuyển chướng ngại vật
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= 2;
            // Kiểm tra va chạm
            if (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            ) {
                gameState = "gameOver"; // Kết thúc game
            }
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1); // Xóa chướng ngại vật ra khỏi mảng
            }
        });

        // Di chuyển điểm thưởng
        collectibles.forEach((collectible, index) => {
            if (
                player.x < collectible.x + collectible.width &&
                player.x + player.width > collectible.x &&
                player.y < collectible.y + collectible.height &&
                player.y + player.height > collectible.y
            ) {
                score++; // Tăng điểm
                collectibles.splice(index, 1); // Xóa điểm thưởng
            }
        });
    }
}

// Vẽ game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ nhân vật
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Vẽ chướng ngại vật
    ctx.fillStyle = "red";
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Vẽ điểm thưởng
    ctx.fillStyle = "yellow";
    collectibles.forEach(collectible => {
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
    });

    // Hiển thị điểm số
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    // Thông báo bắt đầu game
    if (gameState === "start") {
        ctx.fillText("Press Enter or Click to Start", canvas.width / 4, canvas.height / 2);
    }

    // Thông báo game over
    if (gameState === "gameOver") {
        ctx.fillText("Game Over", canvas.width / 2 - 40, canvas.height / 2);
        ctx.fillText("Score: " + score, canvas.width / 2 - 40, canvas.height / 2 + 30);
        ctx.fillText("Press Enter or Click to Restart", canvas.width / 4, canvas.height / 2 + 60);
    }
}

// Khởi động lại game
function resetGame() {
    player.x = 50;
    player.y = canvas.height - 60;
    player.dy = 0;
    player.onGround = true;
    obstacles = [];
    collectibles = [];
    score = 0;
    gameState = "playing";
}

// Sự kiện nhấn chuột để bắt đầu game
canvas.addEventListener('mousedown', () => {
    if (gameState === "start" || gameState === "gameOver") {
        gameState = "playing"; // Bắt đầu trò chơi
        resetGame(); // Khởi động lại trò chơi
    }
});

// Điều khiển bàn phím
document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        if (gameState === "start" || gameState === "gameOver") {
            gameState = "playing"; // Bắt đầu trò chơi
            resetGame(); // Khởi động lại trò chơi
        }
    }
    if (event.key === "ArrowLeft") {
        leftPressed = true; // Di chuyển sang trái
    }
    if (event.key === "ArrowRight") {
        rightPressed = true; // Di chuyển sang phải
    }
    if (event.key === "ArrowUp" && player.onGround) {
        spacePressed = true; // Nhảy
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === "ArrowLeft") {
        leftPressed = false; // Ngừng di chuyển sang trái
    }
    if (event.key === "ArrowRight") {
        rightPressed = false; // Ngừng di chuyển sang phải
    }
    if (event.key === "ArrowUp") {
        spacePressed = false; // Ngừng nhảy
    }
});

// Hàm lặp game
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Khởi động game
gameLoop();
