let boardElement;
let selectedPiece = null;
let currentTurn = 1; 
let difficulty = 'easy'; 

const boardState = [
    [0, 2, 0, 2, 0, 2, 0, 2],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0]
];

// Функция запуска игры - должна вызываться кнопкой
window.pressStartButton = function() {
    console.log("Кнопка нажата");
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    
    if (startScreen) startScreen.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'flex';
    
    renderBoard();
};

function backToMenu() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
}

function renderBoard() {
    boardElement = document.getElementById('board');
    if (!boardElement) return;
    boardElement.innerHTML = '';
    
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = cell ${(r+c)%2 ? 'black-cell' : 'white-cell'};
            
            if (boardState[r][c] !== 0) {
                const p = document.createElement('div');
                p.className = piece ${boardState[r][c]===1||boardState[r][c]===11 ? 'white-piece':'black-piece'};
                cell.appendChild(p);
            }
            boardElement.appendChild(cell);
        }
    }
}

// Запуск при загрузке
window.onload = () => {
    console.log("Игра загружена");
};
