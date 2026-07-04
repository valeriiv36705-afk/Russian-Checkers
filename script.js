/**
 * CHECKERS ENGINE PRO - CORE LOGIC
 * Версия: 1.0.0
 * Описание: Движок для отрисовки и управления игровой доской.
 */

const GameConfig = {
    boardSize: 8,
    colors: { white: '#ecf0f1', black: '#95a5a6' },
    animationSpeed: 300
};

const GameEngine = {
    boardData: [],
    currentPlayer: 'white',
    isGameActive: false,

    initialize: function() {
        console.info("[Engine] Запуск системы...");
        this.boardData = this.createEmptyBoard();
        this.setupStartingPositions();
        this.isGameActive = true;
        console.info("[Engine] Доска успешно инициализирована.");
    },

    createEmptyBoard: function() {
        return Array.from({ length: GameConfig.boardSize }, () => Array(GameConfig.boardSize).fill(null));
    },

    setupStartingPositions: function() {
        for (let row = 0; row < GameConfig.boardSize; row++) {
            for (let col = 0; col < GameConfig.boardSize; col++) {
                if ((row + col) % 2 !== 0) {
                    if (row < 3) this.boardData[row][col] = 'black';
                    else if (row > 4) this.boardData[row][col] = 'white';
                }
            }
        }
    },

    render: function() {
        const boardElement = document.getElementById('board');
        if (!boardElement) return console.error("[Engine] Ошибка: Элемент #board не найден!");
        
        boardElement.innerHTML = '';
        this.boardData.forEach((row, r) => {
            row.forEach((cell, c) => {
                const cellEl = document.createElement('div');
                cellEl.className = cell ${(r + c) % 2 === 0 ? 'white' : 'black'};
                if (cell) {
                    const piece = document.createElement('div');
                    piece.className = piece ${cell}-piece;
                    cellEl.appendChild(piece);
                }
                boardElement.appendChild(cellEl);
            });
        });
    }
};

function pressStartButton() {
    console.log("[UI] Кнопка нажата, запуск процесса...");
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    GameEngine.initialize();
    GameEngine.render();
}
