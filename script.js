const gameOptions = document.querySelectorAll('.game-option');
const gameContainer = document.getElementById('gameContainer');
const gameFrame = document.getElementById('gameFrame');
const gameMenu = document.getElementById('gameMenu');
const goBack = document.getElementById('goBack');
const mainTitle = document.getElementById('mainTitle')

gameOptions.forEach(option => {
    option.addEventListener('click', () => {
        const game = option.getAttribute('data-game');
        gameFrame.src = `games/${game}/index.html`;
        gameContainer.style.display = 'block';
        gameMenu.style.display = 'none';
        goBack.style.display = 'block'
        mainTitle.style.display = 'none';
    });
});

goBack.addEventListener('click', () => {
    mainTitle.style.display = 'block'
    goBack.style.display = 'none'
    gameContainer.style.display = 'none';
    gameMenu.style.display = 'flex';
    gameFrame.src = '';
});
