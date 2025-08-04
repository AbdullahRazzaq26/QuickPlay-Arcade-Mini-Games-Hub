const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
};

// Responsive Canvas
if (window.innerWidth < 600) {
    canvas.width = 300;
    canvas.height = 300;
}

let box;
if (canvas.width < 400) {
    box = canvas.width / 15;
} else {
    box = 20;
}

let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
document.getElementById("highScore").textContent = highScore;

let recentScores = JSON.parse(localStorage.getItem("recentSnakeScores")) || [];

const appleImg = new Image();
appleImg.src = "assets/apple.png";

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";
let food = generateFood();

let speed = 130;
let game;
let isPaused = false;
let isSoundOn = true;
let wiggleTime = 0;


const eatSound = document.getElementById("eatSound");
const dieSound = document.getElementById("dieSound");
const bgMusic = document.getElementById("bgMusic");
const pauseBtn = document.getElementById("pauseBtn");
const soundBtn = document.getElementById("soundToggleBtn");

updateScoreboard()

// 🎮 Main Game Loop
function drawGame() {
    wiggleTime += 0.1;

    clearCanvas();
    drawSnake();
    drawFood();

    const newHead = getNextHeadPosition();

    if (isGameOver(newHead)) {
        if (isSoundOn) dieSound.play();
        endGame();
        return;
    }

    if (isEatingFood(newHead)) {
        if (isSoundOn) eatSound.play();
        score++;
        updateScore();
        food = generateFood();

        if (score % 5 === 0 && speed > 50) {
            clearInterval(game);
            speed -= 10;
            game = setInterval(drawGame, speed);
        }
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

function clearCanvas() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    snake.forEach((segment, index) => {
        // Taper size
        const size = box - index * 0.3;
        const offset = (box - size) / 2;

        // Wiggle offset using sine wave
        const wiggle = Math.sin(wiggleTime + index * 0.5) * 2.2;

        // Shift segment slightly (X if moving vertically, Y if moving horizontally)
        let x = segment.x;
        let y = segment.y;

        if (direction === "UP" || direction === "DOWN") {
            x += wiggle;
        } else {
            y += wiggle;
        }

        // Gradient fill
        const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
        gradient.addColorStop(0, index === 0 ? "#76ABAE" : "#2e8b8b");
        gradient.addColorStop(1, "#1c4f4f");

        ctx.save();
        ctx.globalAlpha = 1 - index * 0.04;
        ctx.shadowColor = "#76ABAE";
        ctx.shadowBlur = 6;

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + offset, y + offset, size, size, 8);
        ctx.fill();
        ctx.restore();

        // Head details
        if (index === 0) {
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(x + 5, y + 5, 2, 0, Math.PI * 2);
            ctx.arc(x + 15, y + 5, 2, 0, Math.PI * 2);
            ctx.fill();

            if (score % 2 === 0) {
                ctx.fillStyle = "#ff6b6b";
                ctx.fillRect(x + 8, y + 20, 4, 6);
            }
        }
    });
}



function drawFood() {
    ctx.drawImage(appleImg, food.x, food.y, box, box);
}

function getNextHeadPosition() {
    const head = { ...snake[0] };
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    return head;
}

function isGameOver(head) {
    return (
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function isEatingFood(head) {
    return head.x === food.x && head.y === food.y;
}

function generateFood() {
    const foodX = Math.floor(Math.random() * (canvas.width / box)) * box;
    const foodY = Math.floor(Math.random() * (canvas.height / box)) * box;
    return { x: foodX, y: foodY };
}

function updateScore() {
    document.getElementById("score").textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("snakeHighScore", highScore);
        document.getElementById("highScore").textContent = highScore;
    }
}

function updateScoreboard() {
    const list = document.getElementById("scoreList");
    list.innerHTML = "";
    recentScores.slice().reverse().forEach(s => {
        const li = document.createElement("li");
        li.textContent = `🎯 ${s}`;
        list.appendChild(li);
    });
}

function endGame() {
    bgMusic.pause();
    clearInterval(game);
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOverScreen").style.display = "flex";

    recentScores.push(score);
    if (recentScores.length > 5) recentScores.shift();
    localStorage.setItem("recentSnakeScores", JSON.stringify(recentScores));
    updateScoreboard();
}

function restartGame() {
    document.getElementById("gameOverScreen").style.display = "none";
    clearInterval(game);
    score = 0;
    speed = 130;
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    food = generateFood();
    updateScore();
    isPaused = false;
    pauseBtn.textContent = "Pause";

    if (isSoundOn) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => { });
    }

    game = setInterval(drawGame, speed);
}

pauseBtn.addEventListener("click", () => {
    if (!isPaused) {
        clearInterval(game);
        pauseBtn.textContent = "Resume";
        isPaused = true;
        bgMusic.pause();    
    } else {
        game = setInterval(drawGame, speed);
        pauseBtn.textContent = "Pause";
        isPaused = false;
        if (isSoundOn) {
            bgMusic.volume = 0.4;
            bgMusic.play().catch(() => { });
        }
    }
});

// Sound Toggle
soundBtn.addEventListener("click", () => {
    isSoundOn = !isSoundOn;
    soundBtn.textContent = isSoundOn ? "🔊 Sound" : "🔇 Muted";

    if (isSoundOn) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => { });
    } else {
        bgMusic.pause();
    }
});

document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("playAgainBtn").addEventListener("click", restartGame);

// Keyboard Controls
document.addEventListener("keydown", e => {
    const key = e.key.toLowerCase();

    if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) {
        e.preventDefault();
    }

    if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
    else if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
    else if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
    else if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
});

// 🧠 Swipe Controls (Touch Support)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (dy > 0 && direction !== "UP") direction = "DOWN";
        else if (dy < 0 && direction !== "DOWN") direction = "UP";
    }
});