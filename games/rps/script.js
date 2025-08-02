let imgs = document.querySelectorAll('.imgs')
let options = ['Rock', 'Paper', 'Scissors']
let userWin = 0;
let computerWin = 0;
let playerScore = document.querySelector('#playerScore')
let computerScore = document.querySelector('#computerScore')
let msg = document.querySelector('.msg')
let restart = document.querySelector('#restart')



imgs.forEach(img => {
    img.addEventListener('click', (e) => {
        let playerChoice = e.target.id;
        checkingWinner(playerChoice)
    })
});



function checkingWinner(playerChoice) {

    let computerChoice = options[Math.floor(Math.random() * options.length)]
    if (playerChoice === computerChoice) {
        // console.log('Draw');
        msg.innerText = `It's a Draw! Both chose ${playerChoice}`
        msgCss()
    } else {
        if (
            (playerChoice === 'Rock' && computerChoice === 'Scissors') ||
            (playerChoice === 'Paper' && computerChoice === 'Rock') ||
            (playerChoice === 'Scissors' && computerChoice === 'Paper')
        ) {
            userWin++;
            playerScore.innerText = 'User = ' + userWin;
            playerScore.classList.remove('score-update');
            void playerScore.offsetWidth;
            playerScore.classList.add('score-update');
            msg.innerText = `${playerChoice} Beats ${computerChoice}, User Wins`
            msgCss()
        } else {
            computerWin++;
            computerScore.innerText = 'Computer = ' + computerWin;
            computerScore.classList.remove('score-update');
            void computerScore.offsetWidth;
            computerScore.classList.add('score-update');
            msg.innerText = `${computerChoice} Beats ${playerChoice}, Computer Wins`
            msgCss()
        }
    }

    if (userWin === 5 || computerWin === 5) {
        msg.innerText += userWin === 5 ? ' 🎉 You reached 5 points!' : ' 💻 Computer reached 5 points!';
        msgCss()
        launchConfetti();
    }


    // console.log('userWin = ', userWin, 'computerWin = ', computerWin);
    // console.log('computer = ', computerChoice, ', user = ', playerChoice);
}


restart.addEventListener('click', () => {
    userWin = 0;
    computerWin = 0;
    msg.innerText = 'Pick Your Move From Above  '
    playerScore.innerText = 'User = ' + userWin;
    computerScore.innerText = 'Computer = ' + computerWin;
})




function launchConfetti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function msgCss() {
    msg.classList.remove('msg-popup');
    void msg.offsetWidth; // Restart animation
    msg.classList.add('msg-popup');
}