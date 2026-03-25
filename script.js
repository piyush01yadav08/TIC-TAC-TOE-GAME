let board = ["", "", "", "", "", "", "", "", ""];
let human = "X";
let ai = "O";
let gameOver = false;

const cells = document.querySelectorAll(".cell");

cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const index = e.target.dataset.index;

  if (board[index] === "" && !gameOver) {
    board[index] = human;
    e.target.textContent = human;

    if (checkWinner(board, human)) {
      alert("You Win!");
      gameOver = true;
      return;
    }

    aiMove();
  }
}

function aiMove() {
  let difficulty = document.getElementById("difficulty").value;
  let move;

  if (difficulty === "easy") {
    move = randomMove();
  } 
  else if (difficulty === "medium") {
    move = Math.random() < 0.5 ? randomMove() : minimax(board, ai).index;
  } 
  else {
    move = minimax(board, ai).index;
  }

  board[move] = ai;
  cells[move].textContent = ai;

  if (checkWinner(board, ai)) {
    alert("AI Wins!");
    gameOver = true;
  }
}

function minimax(newBoard, player) {
  let availSpots = newBoard.map((v, i) => v === "" ? i : null).filter(v => v !== null);

  if (checkWinner(newBoard, human)) return { score: -10 };
  if (checkWinner(newBoard, ai)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  let moves = [];

  for (let i of availSpots) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    if (player === ai) {
      move.score = minimax(newBoard, human).score;
    } else {
      move.score = minimax(newBoard, ai).score;
    }

    newBoard[i] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWinner(board, player) {
  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return winCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  cells.forEach(cell => cell.textContent = "");
}
function randomMove() {
  let empty = board
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  return empty[Math.floor(Math.random() * empty.length)];
}
