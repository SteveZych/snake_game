const grid = document.querySelector('.grid');
const startButton = document.getElementsByClassName('start');
const currentScoreDisplay = document.getElementById('currentScore');
const highScoreDisplay = document.getElementById('highScore');
const overlay = document.getElementsByClassName('overlay');
const closeModal = document.getElementsByClassName('close-modal');
const modalMessage = document.getElementsByClassName('modalMessage');

let squares = [];
let currentSnake = [2,1,0];
let direction = 1;
const width = 20;
let appleIndex = 0;
let currentScore = 0;
let highScore = window.localStorage.highScore || 0;
let intervalTime = 1;
let speed = 0.9;
let timerId = 0;

function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div');
    //add styling to the element
    square.classList.add('square');
    //put the element into our grid
    grid.appendChild(square);
    //push it into a new squares array    
    squares.push(square);
    }
}
createGrid();

//initalize high score
highScoreDisplay.textContent = highScore;

currentSnake.forEach(index => squares[index].classList.add('snake'));

function startGame() {
    //remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'));
    //remove the apple
    squares[appleIndex].classList.remove('apple');
    clearInterval(timerId);
    currentSnake = [2,1,0];
    currentScore = 0;
    //re add new score to browser
    currentScoreDisplay.textContent = currentScore;
    direction = 1;
    intervalTime = 1000;
    generateApple();
    //readd the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    timerId = setInterval(move, intervalTime);
    //change text content to restart
    startButton[0].textContent = 'Restart';
    
}

function endGame(){
    clearInterval(timerId);
    startButton[0].textContent = 'Start';
    if (currentScore > highScore){
        highScore = currentScore;
        highScoreDisplay.textContent = highScore;
        modalMessage[0].textContent = `Congratulations! Your new high score is ${highScore}`;
        localStorage.setItem('highScore', JSON.stringify(highScore));
    }
    overlay[0].style.display = 'block';   
}


function move() {
    if (
        (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake')
    ){
        return endGame();
    }
    

    //remove last element from our currentSnake array
    const tail = currentSnake.pop();
    //remove styling from last element
    squares[tail].classList.remove('snake');
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction);
    //add styling so we can see it
    
    //deal with snake head gets apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        //remove the class of apple
        squares[currentSnake[0]].classList.remove('apple');
        //grow our snake by adding class of snake to it
        squares[tail].classList.add('snake');
        console.log(tail);
        //grow our snake array
        currentSnake.push(tail);
        
        //generate new apple
        generateApple();
        //add one to the score
        currentScore++;
        //display our score
        currentScoreDisplay.textContent = currentScore;
        //speed up our snake
        clearInterval(timerId);
        
        intervalTime = intervalTime * speed;
        
        timerId = setInterval(move, intervalTime);
    }

    squares[currentSnake[0]].classList.add('snake');
}

function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple');
} 
generateApple();

function control(e) {
    if (e.keyCode === 39) {
        direction = 1;
    } else if (e.keyCode === 38) {
        direction = -width;
    } else if (e.keyCode === 37) {
        direction = -1;
    } else if (e.keyCode === 40) {
        direction = +width;
    }
}
document.addEventListener('keyup', control);
startButton[0].addEventListener('click', startGame);
closeModal[0].addEventListener('click', function(){
    overlay[0].style.display = "none";
    startGame();
    modalMessage[0].textContent = 'Better luck next time!';
})

function darkMode(){
    document.body.classList.add('dark-mode');
    document.getElementsByClassName('modal')[0].classList.add('modal-dark');
    let buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => button.classList.add('btn-dark'));
    document.getElementsByClassName('moon')[0].classList.add('hidden');
    document.getElementsByClassName('sun')[0].classList.remove('hidden');
}

function lightMode(){
    document.body.classList.remove('dark-mode');
    document.getElementsByClassName('modal')[0].classList.remove('modal-dark');
    let buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => button.classList.remove('btn-dark'));
    document.getElementsByClassName('moon')[0].classList.remove('hidden');
    document.getElementsByClassName('sun')[0].classList.add('hidden');
}
