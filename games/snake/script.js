const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let score = 0;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";

let food = generateFood();
let game;


const eatSound = document.getElementById("eatSound");
const dieSound = document.getElementById("dieSound");

// 🎮 Main Game Loop
function drawGame() {
  clearCanvas();
  drawSnake();
  drawFood();

  const newHead = getNextHeadPosition();

  if (isGameOver(newHead)) {
    dieSound.play();
    endGame();
    return;
  }

  if (isEatingFood(newHead)) {
    eatSound.play(); 
    score++;
    updateScore();
    food = generateFood(); 

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
    ctx.fillStyle = index === 0 ? "#76ABAE" : "#2e8b8b";
    ctx.fillRect(segment.x, segment.y, box, box);
  });
}

function drawFood() {
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(food.x, food.y, box, box);
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
}

function endGame() {
  clearInterval(game);
  document.getElementById("finalScore").textContent = score;
  document.getElementById("gameOverScreen").style.display = "flex";
}

function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  clearInterval(game);
  score = 0;
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = "RIGHT";
  food = generateFood();
  updateScore();
  game = setInterval(drawGame, 130);
}

document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("playAgainBtn").addEventListener("click", restartGame);



document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase(); 

  
  if (
    ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)
  ) {
    e.preventDefault();
  }


  if ((key === "arrowleft" || key === "a") && direction !== "RIGHT") direction = "LEFT";
  else if ((key === "arrowup" || key === "w") && direction !== "DOWN") direction = "UP";
  else if ((key === "arrowright" || key === "d") && direction !== "LEFT") direction = "RIGHT";
  else if ((key === "arrowdown" || key === "s") && direction !== "UP") direction = "DOWN";
});

