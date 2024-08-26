let rows, cols, mines;
let board = [];
let gameOver = false;
let firstClick = true;

document.addEventListener("DOMContentLoaded", () => {
    const difficultySelect = document.getElementById("difficulty");
    difficultySelect.addEventListener("change", updateDifficulty);
    updateDifficulty();  // 初始化难度
});

function updateDifficulty() {
    const difficulty = document.getElementById("difficulty").value;
    if (difficulty === "easy") {
        rows = 8;
        cols = 8;
        mines = 10;
    } else if (difficulty === "normal") {
        rows = 16;
        cols = 16;
        mines = 40;
    } else if (difficulty === "hard") {
        rows = 16;
        cols = 30;
        mines = 99;
    }
}

function startGame() {
    gameOver = false;
    firstClick = true;
    document.getElementById("status").textContent = "";
    initBoard();
    renderBoard();
}

function initBoard() {
    const minesweeper = document.getElementById("minesweeper");
    minesweeper.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    minesweeper.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
            mine: false,
            open: false,
            flag: false,
            adjacentMines: 0
        }))
    );
}

function placeMines(initialRow, initialCol) {
    let placedMines = 0;
    while (placedMines < mines) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine && !(row === initialRow && col === initialCol)) {
            board[row][col].mine = true;
            placedMines++;
        }
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].mine) {
                board[r][c].adjacentMines = countAdjacentMines(r, c);
            }
        }
    }
}

function countAdjacentMines(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    return directions.reduce((count, [dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c].mine) {
            return count + 1;
        }
        return count;
    }, 0);
}

function renderBoard() {
    const minesweeper = document.getElementById("minesweeper");
    minesweeper.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");

            if (board[r][c].open) {
                cellDiv.classList.add("open");
                if (board[r][c].mine) {
                    cellDiv.textContent = "💣";
                } else if (board[r][c].adjacentMines > 0) {
                    cellDiv.textContent = board[r][c].adjacentMines;
                }
            } else if (board[r][c].flag) {
                cellDiv.classList.add("flag");
                cellDiv.textContent = "🚩";
            }

            cellDiv.addEventListener("click", () => handleCellClick(r, c));
            cellDiv.addEventListener("contextmenu", (e) => handleCellRightClick(e, r, c));

            minesweeper.appendChild(cellDiv);
        }
    }
}

function handleCellClick(row, col) {
    if (gameOver || board[row][col].open || board[row][col].flag) {
        return;
    }

    if (firstClick) {
        placeMines(row, col);
        firstClick = false;
    }

    board[row][col].open = true;

    if (board[row][col].mine) {
        document.getElementById("status").textContent = "游戏结束！你踩到地雷了。";
        gameOver = true;
        revealMines();
    } else if (board[row][col].adjacentMines === 0) {
        openAdjacentCells(row, col);
    }

    if (checkWin()) {
        document.getElementById("status").textContent = "恭喜！你赢了！";
        gameOver = true;
    }

    renderBoard();
}

function handleCellRightClick(e, row, col) {
    e.preventDefault();
    if (gameOver || board[row][col].open) {
        return;
    }

    board[row][col].flag = !board[row][col].flag;
    renderBoard();
}

function openAdjacentCells(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    directions.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < rows && c >= 0 && c < cols && !board[r][c].open) {
            handleCellClick(r, c);
        }
    });
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) {
                board[r][c].open = true;
            }
        }
    }
    renderBoard();
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!board[r][c].mine && !board[r][c].open) {
                return false;
            }
        }
    }
    return true;
}
