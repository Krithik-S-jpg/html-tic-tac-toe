const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell]");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const symbols = document.querySelectorAll(".symbol");

let currentSymbol = null;
let gameActive = true;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Handle drag start
function handleDragStart(event) {
  if (!gameActive) return; // Prevent dragging if the game is not active
  currentSymbol = event.target.id;
}

// Handle drop
function handleDrop(event) {
  event.preventDefault();
  if (!gameActive) return; // Stop interaction if the game is not active

  const cell = event.target;

  // Prevent placing symbols in taken cells
  if (!cell.classList.contains("cell") || cell.classList.contains("taken")) {
    return;
  }

  // Place the current symbol in the cell
  cell.textContent = currentSymbol;
  cell.classList.add("taken");

  // Check for a win
  const winningCombination = checkWin(currentSymbol);
  if (winningCombination) {
    statusText.textContent = `${currentSymbol} Wins!`;
    highlightWinningCells(winningCombination);
    gameActive = false; // Disable the game
    disableDrag(); // Disable dragging
    return;
  }

  // Check for a draw
  if (checkDraw()) {
    statusText.textContent = "It's a Tie!";
    gameActive = false; // Disable the game
    disableDrag(); // Disable dragging
    return;
  }

  // Continue the game
  statusText.textContent = "Keep Playing!";
}

// Check win condition
function checkWin(player) {
  return winningCombinations.find(combination =>
    combination.every(index => cells[index].textContent === player)
  );
}

// Highlight winning cells
function highlightWinningCells(combination) {
  combination.forEach(index => {
    cells[index].classList.add("highlight");
  });
}

// Check draw condition
function checkDraw() {
  return [...cells].every(cell => cell.classList.contains("taken"));
}

// Reset game
function resetGame() {
  gameActive = true; // Reactivate the game
  statusText.textContent = "Drag X or O to start the game";

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken", "highlight");
  });

  enableDrag(); // Enable dragging again
}

// Disable drag
function disableDrag() {
  symbols.forEach(symbol => symbol.setAttribute("draggable", false));
}

// Enable drag
function enableDrag() {
  symbols.forEach(symbol => symbol.setAttribute("draggable", true));
}

// Handle drag over
function handleDragOver(event) {
  if (gameActive) {
    event.preventDefault(); // Allow drag only if the game is active
  }
}

// Event listeners
symbols.forEach(symbol => symbol.addEventListener("dragstart", handleDragStart));
cells.forEach(cell => {
  cell.addEventListener("dragover", handleDragOver);
  cell.addEventListener("drop", handleDrop);
});
resetButton.addEventListener("click", resetGame);

// Enable dragging by default
enableDrag();
