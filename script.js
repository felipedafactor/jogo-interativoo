const gameBoard = document.getElementById("game-board");

const timerElement = document.getElementById("timer");
const movesElement = document.getElementById("moves");
const scoreElement = document.getElementById("score");

const restartButton = document.getElementById("restart-button");

const winScreen = document.getElementById("win-screen");
const playAgainButton = document.getElementById("play-again");

const finalTime = document.getElementById("final-time");
const finalMoves = document.getElementById("final-moves");
const finalScore = document.getElementById("final-score");

const symbols = [
    "🍎",
    "🍌",
    "🍇",
    "🍉",
    "🍓",
    "🍒",
    "🥝",
    "🍍"
];

let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;
let score = 0;
let matchedPairs = 0;

let seconds = 0;
let timer = null;

let gameStarted = false;


// Embaralhar cartas
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


// Criar o baralho
function createDeck() {

    const deck = [...symbols, ...symbols];

    cards = shuffle(deck);

    gameBoard.innerHTML = "";

    cards.forEach((symbol, index) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.symbol = symbol;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front"></div>

                <div class="card-back">
                    ${symbol}
                </div>

            </div>
        `;

        card.addEventListener("click", flipCard);

        gameBoard.appendChild(card);
    });
}


// Virar carta
function flipCard() {

    if (lockBoard) return;

    if (this === firstCard) return;

    if (this.classList.contains("matched")) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    this.classList.add("flipped");

    if (!firstCard) {

        firstCard = this;

        return;
    }

    secondCard = this;

    moves++;

    movesElement.textContent = moves;

    checkMatch();
}


// Verificar se as cartas combinam
function checkMatch() {

    const isMatch =
        firstCard.dataset.symbol === secondCard.dataset.symbol;

    if (isMatch) {

        disableCards();

    } else {

        unflipCards();
    }
}


// Quando encontrar um par
function disableCards() {

    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matchedPairs++;

    score += 100;

    scoreElement.textContent = score;

    resetTurn();

    if (matchedPairs === symbols.length) {
        finishGame();
    }
}


// Quando errar
function unflipCards() {

    lockBoard = true;

    setTimeout(() => {

        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");

        resetTurn();

    }, 900);
}


// Resetar seleção
function resetTurn() {

    firstCard = null;
    secondCard = null;

    lockBoard = false;
}


// Iniciar cronômetro
function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        seconds++;

        updateTimer();

    }, 1000);
}


// Atualizar cronômetro
function updateTimer() {

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


// Finalizar jogo
function finishGame() {

    clearInterval(timer);

    // Bônus por terminar rápido
    const timeBonus = Math.max(0, 300 - seconds);

    score += timeBonus;

    scoreElement.textContent = score;

    finalTime.textContent = timerElement.textContent;
    finalMoves.textContent = moves;
    finalScore.textContent = score;

    setTimeout(() => {
        winScreen.classList.remove("hidden");
    }, 700);
}


// Reiniciar jogo
function restartGame() {

    clearInterval(timer);

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    moves = 0;
    score = 0;
    matchedPairs = 0;

    seconds = 0;

    gameStarted = false;

    movesElement.textContent = "0";
    scoreElement.textContent = "0";
    timerElement.textContent = "00:00";

    winScreen.classList.add("hidden");

    createDeck();
}


// Botões
restartButton.addEventListener("click", restartGame);

playAgainButton.addEventListener("click", restartGame);


// Iniciar jogo
createDeck();
