const wordList = [
    "apple", "brave", "crane", "drink", "eagle", "flame", "grape", "horse", "igloo", "joker",
    "karma", "lemon", "mango", "noble", "ocean", "piano", "queen", "radio", "shine", "tiger",
    "umbra", "vivid", "waltz", "xenon", "yacht", "zebra", "adobe", "badge", "cabin", "debug",
    "eject", "fable", "gamer", "habit", "ideal", "jelly", "kiosk", "lunar", "medal", "nexus",
    "orbit", "plant", "quilt", "risky", "smile", "toxic", "ultra", "voter", "wiser", "xylem",
    "young", "zesty", "angle", "binge", "cider", "dough", "evoke", "fraud", "gloom", "haste",
    "issue", "joint", "kneel", "loose", "model", "nerdy", "oxide", "pride", "quart", "rough",
    "scale", "treat", "urged", "vapor", "whale", "xerox", "yield", "zonal", "abide", "blaze",
    "creek", "dried", "envoy", "frost", "globe", "hinge", "index", "jolly", "knock", "latch",
    "motel", "nails", "opera", "punch", "quota", "rival", "spend", "tamer", "urban", "vouch",
    "woken", "xenon", "yeast", "zebra", "arise", "blush", "clamp", "dizzy", "ember", "flush",
    "grind", "hoist", "inlet", "jaunt", "knead", "lapse", "mirth", "novel", "ought", "pivot",
    "query", "roast", "stump", "truce", "udder", "verge", "wince", "xenon", "youth", "zonal",
    "aisle", "bride", "chill", "drill", "evade", "flint", "grove", "hurry", "inbox", "judge",
    "kneed", "lobby", "mimic", "nerve", "overt", "plead", "quiet", "racer", "shelf", "trend",
    "utter", "vigil", "whirl", "xenon", "yours", "zoned", "angle", "bloat", "chore", "donut",
    "enact", "fjord", "gland", "hound", "inert", "joust", "kayak", "leech", "moist", "naive",
    "outdo", "perch", "quote", "raven", "siren", "tulip", "unity", "vixen", "wreck", "xenon",
    "yodel", "zippy", "amber", "beach", "charm", "dunce", "easel", "forge", "gauge", "haste",
    "image", "jewel", "karma", "logic", "might", "niche", "olive", "plaza", "quark", "reign",
    "swirl", "track", "unite", "vigor", "waive", "xerox", "youth", "zebra",
    'apple', 'brain', 'shine', 'mouse', 'plant', 'crane', 'drink', 'globe',
    'house', 'light', 'sweet', 'quiet', 'grape', 'blaze', 'sharp', 'storm',
    'bread', 'table', 'lunch', 'month', 'night', 'clean', 'green', 'water',
    'candy', 'sound', 'brick', 'heart', 'cloud', 'sugar', 'party', 'magic',
    'smile', 'charm', 'frost', 'teeth', 'lemon', 'spice', 'arrow', 'roast',
    'river', 'knife', 'watch', 'title', 'voice', 'peace', 'grill', 'sight',
    'liver', 'sweat', 'tiger', 'ocean', 'siren', 'crown', 'point', 'chair',
    'swing', 'straw', 'flame', 'dream', 'petal', 'daisy', 'tulip', 'cabin',
    'drill', 'flock', 'hover', 'jelly', 'kneel', 'lunar', 'metal', 'noisy',
    'onion', 'plaza', 'quake', 'rider', 'scale', 'tempo', 'umbra', 'vivid',
    'witty', 'xenon', 'youth', 'zebra', 'actor', 'basic', 'chess', 'daily',
    'eager', 'fable', 'giant', 'habit', 'ideal', 'joker', 'karma', 'lodge',
    'merry', 'novel', 'orbit', 'piano', 'quest', 'ranch', 'salad', 'tasty',
    'unity', 'vital', 'wound', 'xenon', 'yield', 'zesty', 'beach', 'angel',
    'brave', 'climb', 'dodge', 'elite', 'fancy', 'glove', 'haste', 'itchy',
    'jumpy', 'kayak', 'latch', 'mimic', 'noble', 'optic', 'pride', 'quake',
    'risky', 'silly', 'trick', 'urban', 'vigor', 'woven', 'xylem', 'zippy'
];

let word = wordList[Math.floor(Math.random() * wordList.length)];
let currentRow = 0;
let currentCol = 0;
let currentGuess = "";
const grid = [];

const gridContainer = document.getElementById('grid');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

for (let r = 0; r < 6; r++) {
    grid[r] = [];
    for (let c = 0; c < 5; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid[r][c] = cell;
        gridContainer.appendChild(cell);
    }
}

function showMessage(msg, color = '#ff6b6b') {
    message.innerText = msg;
    message.style.color = color;
}


const keyboardContainer = document.getElementById('keyboard');
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM";


keys.split('').forEach(k => {
    const key = document.createElement('div');
    key.classList.add('key');
    key.innerText = k;
    key.dataset.key = k;
    key.dataset.status = ""; // track color state
    key.addEventListener('click', () => handleKey(k));
    keyboardContainer.appendChild(key);
});

['ENTER', 'DEL'].forEach(k => {
    const key = document.createElement('div');
    key.classList.add('key');
    key.innerText = k;
    key.dataset.key = k;
    key.addEventListener('click', () => handleKey(k));
    key.style.gridColumn = "span 2";
    keyboardContainer.appendChild(key);
});

let rowLocked = false;

function handleKey(key) {
    if (currentRow >= 6 || rowLocked) return;

    if (key === 'DEL') {
        if (currentCol > 0) {
            currentCol--;
            currentGuess = currentGuess.slice(0, -1);
            grid[currentRow][currentCol].innerText = '';
            grid[currentRow][currentCol].className = 'cell';
        }
    } else if (key === 'ENTER') {
        if (currentGuess.length !== 5) {
            showMessage('Enter full word');
            return;
        }

        if (!wordList.includes(currentGuess)) {
            showMessage("❌ Not in word list");
            currentGuess = "";
            currentCol = 0;
            for (let i = 0; i < 5; i++) {
                grid[currentRow][i].innerText = '';
                grid[currentRow][i].className = 'cell';
            }
            return;
        }

        evaluateGuess();
    } else {
        if (currentCol < 5 && /^[A-Z]$/.test(key)) {
            grid[currentRow][currentCol].innerText = key;
            currentGuess += key.toLowerCase();
            currentCol++;
        }
    }
}

function evaluateGuess() {
    const guessArr = currentGuess.split('');
    const answerArr = word.split('');
    const colorResult = Array(5).fill('absent');
    const answerUsed = Array(5).fill(false);

    // First pass - Green (correct)
    for (let i = 0; i < 5; i++) {
        if (guessArr[i] === answerArr[i]) {
            colorResult[i] = 'correct';
            answerUsed[i] = true;
        }
    }

    // Second pass - Yellow (present)
    for (let i = 0; i < 5; i++) {
        if (colorResult[i] === 'correct') continue;
        for (let j = 0; j < 5; j++) {
            if (!answerUsed[j] && guessArr[i] === answerArr[j]) {
                colorResult[i] = 'present';
                answerUsed[j] = true;
                break;
            }
        }
    }

    // Apply tile colors + keyboard coloring
    for (let i = 0; i < 5; i++) {
        grid[currentRow][i].classList.add(colorResult[i]);
        colorKey(guessArr[i].toUpperCase(), colorResult[i]);
    }

    if (currentGuess === word) {
        showMessage("🎉 Correct!", "#1dd1a1");
        currentRow = 6;
        return;
    } else {
        currentRow++;
        currentCol = 0;
        currentGuess = "";
        rowLocked = false;
    }

    if (currentRow === 6) {
        showMessage(`❌ Word was "${word.toUpperCase()}"`);
    } else {
        message.innerText = "";
    }
}

function colorKey(letter, status) {
    const key = document.querySelector(`.key[data-key="${letter}"]`);
    if (!key) return;

    const current = key.dataset.status;

    const priority = {
        '': 0,
        'absent': 1,
        'present': 2,
        'correct': 3
    };

    if (priority[status] > priority[current]) {
        key.classList.remove('absent', 'present', 'correct');
        key.classList.add(status);
        key.dataset.status = status;
    }
}

// Support for physical keyboard
document.addEventListener('keydown', (e) => {
    let key = e.key.toUpperCase();

    if (key === 'BACKSPACE') key = 'DEL';
    if (key === 'ENTER' || key === 'DEL' || /^[A-Z]$/.test(key)) {
        handleKey(key);
    }
});

restartBtn.addEventListener('click', () => location.reload());
