class CheckersGame {
    constructor() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.turn = 'white';
        this.selectedPiece = null;
        this.initBoard();
    }

    initBoard() {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if ((row + col) % 2 !== 0) {
                    if (row < 3) this.board[row][col] = 'black';
                    else if (row > 4) this.board[row][col] = 'white';
                }
            }
        }
    }

    render() {
        const boardEl = document.getElementById('board');
        boardEl.innerHTML = '';
        this.board.forEach((row, r) => {
            row.forEach((cell, c) => {
                const cellEl = document.createElement('div');
                cellEl.className = cell ${(r + c) % 2 === 0 ? 'white' : 'black'};
                if (cell) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = piece ${cell};
                    pieceEl.onclick = () => this.selectPiece(r, c);
                    cellEl.appendChild(pieceEl);
                }
                cellEl.onclick = () => this.handleMove(r, c);
                boardEl.appendChild(cellEl);
            });
        });
    }

    selectPiece(r, c) {
        if (this.board[r][c] === this.turn) {
            this.selectedPiece = { r, c };
            console.log("Выбрана шашка:", r, c);
        }
    }

    handleMove(r, c) {
        if (this.selectedPiece && this.board[r][c] === null) {
            this.board[r][c] = this.board[this.selectedPiece.r][this.selectedPiece.c];
            this.board[this.selectedPiece.r][this.selectedPiece.c] = null;
            this.selectedPiece = null;
            this.turn = this.turn === 'white' ? 'black' : 'white';
            this.render();
        }
    }
}

const game = new CheckersGame();
window.pressStartButton = () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    game.render();
};
