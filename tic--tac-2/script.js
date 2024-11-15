const board = document.querySelector("#board");
const cells = document.querySelectorAll(".cell");
const winnerText = document.querySelector("#winnerText");
const winnerModal = document.querySelector("#winnerModal");
const playAgainBtn = document.querySelector("#playAgain");
const modeSelector = document.querySelector("#modeSelector");
let currentPlayer = "X";
let gameActive = true;
let isVsComputer = false; // Default mode: play with a friend

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Sounds
const tapSound = new Audio("https://www.soundjay.com/button/button-09.wav");
const winSound = new Audio("https://www.soundjay.com/misc/success-fanfare-trumpets-01.mp3");

function checkWinner() {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (
      cells[a].textContent === currentPlayer &&
      cells[b].textContent === currentPlayer &&
      cells[c].textContent === currentPlayer
    ) {
      drawWinLine(combo);
      showWinner(`${currentPlayer} Wins!`);
      winSound.play();
      gameActive = false;
      return true;
    }
  }
  if ([...cells].every((cell) => cell.textContent)) {
    showWinner("It's a Draw!");
    gameActive = false;
    return false;
  }
  return false;
}

function drawWinLine(combo) {
  combo.forEach((index) => {
    cells[index].classList.add("winning-cell");
  });
}

function showWinner(message) {
  winnerText.textContent = message;
  winnerModal.style.display = "flex";
}

function handleCellClick(event) {
  if (!gameActive) return;
  const cell = event.target;

  if (cell.textContent === "") {
    cell.textContent = currentPlayer;
    cell.classList.add("taken");
    if (!tapSound.paused) {
      tapSound.currentTime = 0;
    }
    tapSound.play();

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (!checkWinner()) {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      if (isVsComputer && currentPlayer === "O") {
        setTimeout(computerMove, 500);
      }
    }
  }
}

function computerMove() {
  const emptyCells = [...cells].filter((cell) => cell.textContent === "");
  if (emptyCells.length > 0) {
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = "O";
    randomCell.classList.add("taken");
    if (!tapSound.paused) {
      tapSound.currentTime = 0;
    }
    tapSound.play();

    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    if (!checkWinner()) {
      currentPlayer = "X";
    }
  }
}

function resetGame() {
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken", "winning-cell");
  });
  winnerModal.style.display = "none";
  currentPlayer = "X";
  gameActive = true;
}

function selectMode(mode) {
  resetGame();
  isVsComputer = mode === "computer";
}

cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
playAgainBtn.addEventListener("click", resetGame);
modeSelector.addEventListener("change", (event) => selectMode(event.target.value));
