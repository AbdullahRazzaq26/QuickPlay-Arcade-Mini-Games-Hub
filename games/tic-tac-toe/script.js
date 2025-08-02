let boxes = document.querySelectorAll('.box')
let resetBtn = document.querySelector('#resetBtn')
let msg = document.querySelector('#msg')
let newGame = document.querySelector('#newGame')
let msgBox = document.querySelector('#msgBox')
let btnClicks = 0;
let playerO = true;

let winPattern = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [3, 4, 5],
    [6, 7, 8]
]

boxes.forEach((box) => {
    box.addEventListener('click', (e) => {
        btnClicks++
        if (playerO === true) {
            e.target.innerText = 'O'
            playerO = false
            box.classList.remove('red')
            box.classList.add('blue')
        } else {
            e.target.innerText = 'X'
            playerO = true
            box.classList.remove('blue')
            box.classList.add('red')
        }
        box.disabled = true
        win()

    })
})

function win() {
    for (const pattern of winPattern) {

        // console.log(pattern[0], pattern[1], pattern[2]);
        // console.log(
        //     boxes[pattern[0]].innerText,
        //     boxes[pattern[1]].innerText,
        //     boxes[pattern[2]].innerText
        // );

        let pos1Value = boxes[pattern[0]].innerText
        let pos2Value = boxes[pattern[1]].innerText
        let pos3Value = boxes[pattern[2]].innerText

        if (pos1Value !== '' && pos2Value !== '' && pos3Value !== '') {
            if (pos1Value === pos2Value && pos2Value === pos3Value) {
                console.log('Wins', pos1Value);
                boxes.forEach((box) => {
                    box.disabled = true
                })
                winMsg(pos1Value)
            }
            else if (btnClicks === 9) {
                msgBox.classList.remove('hide')
                msg.innerText = `Draw`
            }
        }

    }
}

resetBtn.addEventListener('click', reStart)
newGame.addEventListener('click', reStart)



function winMsg(winPlayer) {
    msgBox.classList.remove('hide')
    msg.innerText = `Congrats Player ${winPlayer}`
}

function reStart() {
    btnClicks = 0
    playerO = true;
    boxes.forEach((box) => {
        box.innerText = ''
        box.disabled = false
    })
    msgBox.classList.add('hide')
}