const BOARD_SIZE = 10;
const NUM_MINES = 15;
let board = [];
let mines = [];

function createBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';
  boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 30px)`;

  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      boardElement.appendChild(cell);
      board[row][col] = { isMine: false, revealed: false, count: 0 };
    }
  }
}

function placeMines() {
  mines = [];
  while (mines.length < NUM_MINES) {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      mines.push([row, col]);
    }
  }
}

function calculateNumbers() {
  for (const [row, col] of mines) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && !board[newRow][newCol].isMine) {
          board[newRow][newCol].count++;
        }
      }
    }
  }
}

function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);
  const cell = board[row][col];

  if (cell.revealed) return;

  cell.revealed = true;
  event.target.classList.add('revealed');

  if (cell.isMine) {
    event.target.textContent = '💣';
    alert('Game Over! You hit a mine!');
    revealAllMines();
    return;
  }

  if (cell.count > 0) {
    event.target.textContent = cell.count;
  } else {
    event.target.textContent = '';
    revealEmptyCells(row, col);
  }

  checkWin();
}

function revealEmptyCells(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE && !board[newRow][newCol].revealed) {
        const cell = document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`);
        cell.click();
      }
    }
  }
}

function revealAllMines() {
  for (const [row, col] of mines) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.textContent = '💣';
    cell.classList.add('revealed');
  }
}

function checkWin() {
  let unrevealedCount = 0;
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col].revealed && !board[row][col].isMine) {
        unrevealedCount++;
      }
    }
  }
  if (unrevealedCount === 0) {
    alert('Congratulations! You won!');
  }
}

function resetGame() {
  createBoard();
  placeMines();
  calculateNumbers();
}

document.getElementById('reset').addEventListener('click', resetGame);

// Initialize game
resetGame();