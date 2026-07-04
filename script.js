// Переменные
let boardElement;
let boardState = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];

// Управление экранами
window.pressStartButton = function() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    renderBoard();
};

window.backToMenu = function() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
};

// Отрисовка
function renderBoard() {
    boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = cell ${(r + c) % 2 ? 'black-cell' : 'white-cell'};
            if (boardState[r][c] !== 0) {
                const p = document.createElement('div');
                p.className = piece ${boardState[r][c] === 1 || boardState[r][c] === 11 ? 'white-piece' : 'black-piece'};
                cell.appendChild(p);
            }
            boardElement.appendChild(cell);
        }
    }
}
