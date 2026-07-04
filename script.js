let board = [];
let selected = null;
let turn = 1; // 1 - игрок, 2 - бот

function initGame() {
    board = Array(8).fill(null).map((_, r) => 
        Array(8).fill(null).map((_, c) => {
            if ((r + c) % 2 !== 0) {
                if (r < 3) return 2;
                if (r > 4) return 1;
            }
            return 0;
        })
    );
    render();
}

function render() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const div = document.createElement('div');
            div.className = cell ${(r + c) % 2 ? 'black' : 'white'};
            if (cell !== 0) {
                const p = document.createElement('div');
                p.className = piece ${cell === 1 ? 'white' : 'black'};
                p.onclick = () => selectPiece(r, c);
                div.appendChild(p);
            }
            div.onclick = () => movePiece(r, c);
            boardEl.appendChild(div);
        });
    });
}

function selectPiece(r, c) { if (board[r][c] === turn) selected = {r, c}; }

function movePiece(r, c) {
    if (selected && board[r][c] === 0 && (r + c) % 2 !== 0) {
        board[r][c] = board[selected.r][selected.c];
        board[selected.r][selected.c] = 0;
        if (r === 0 || r === 7) board[r][c] += 10;
        selected = null;
        turn = 2;
        render();
        setTimeout(botTurn, 1000);
    }
}

function botTurn() {
    let moves = [];
    for(let r=0; r<8; r++) for(let c=0; c<8; c++) 
        if(board[r][c] === 2) moves.push({r, c});
    
    if(moves.length > 0) {
        let m = moves[Math.floor(Math.random() * moves.length)];
        let targetR = m.r + 1, targetC = m.c + (Math.random() > 0.5 ? 1 : -1);
        if(targetR < 8 && targetC >= 0 && targetC < 8 && board[targetR][targetC] === 0) {
            board[targetR][targetC] = board[m.r][m.c];
            board[m.r][m.c] = 0;
        }
    }
    turn = 1;
    render();
}

window.pressStartButton = () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    initGame();
};
