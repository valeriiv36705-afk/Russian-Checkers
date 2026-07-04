[22:06, 04.07.2026] Ymir: body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh; /* Используем min-height вместо height */
    background-color: #2c3e50;
    margin: 0;
    font-family: sans-serif;
    color: white;
    /* Убираем overflow: hidden, чтобы страница могла прокручиваться, если что-то не влезло */
}

/* Стартовое меню */
#start-screen {
    position: fixed; /* Фиксируем на весь экран */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #2c3e50;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    box-sizing: border-box;
}

#game-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
}

/* Доска, которая адаптируется к ширине экрана */
#board {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
    width: 90vw;      /* Доска занимает 90% ширины экрана */
    height: 90vw;     /* Делаем квадратной */
    max-width: 400px; /* Ограничиваем максимальный размер */
    max-height: 400px;
    border: 4px solid #333;
}

.cell {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.piece {
    width: 80%;       /* Шашка чуть меньше клетки */
    height: 80%;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 5vw;   /* Размер короны зависит от размера экрана */
}

/* Остальные стили для кнопок и текста */
.menu-title { font-size: 24px; color: #f1c40f; text-align: center; }
#scoreboard { display: flex; gap: 15px; margin-bottom: 10px; }
#start-game-btn { padding: 10px 20px; margin-top: 20px; background: #e67e22; border: none; border-radius: 5px; color: white; font-weight: bold; }
#ingame-stats { display: flex; gap: 10px; font-size: 12px; background: #34495e; padding: 5px 10px; margin-bottom: 10px; }
#surrender-btn { background: #e74c3c; color: white; border: none; padding: 8px 16px; margin-top: 10px; }
[22:12, 04.07.2026] Ymir: let boardElement;
let selectedPiece = null;
let currentTurn = 1; 
let isChainJumping = false; 
let difficulty = 'easy'; 
let playerWins = 0;
let botWins = 0;
let playerAte = 0;
let botAte = 0;
let consecutiveKingMoves = 0; 

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

window.addEventListener('DOMContentLoaded', () => {
    boardElement = document.getElementById('board');
    updateStatsUI();
});

window.changeDiff = function(diff) {
    difficulty = diff;
    document.getElementById('btn-easy').classList.toggle('active', diff === 'easy');
    document.getElementById('btn-medium').classList.toggle('active', diff === 'medium');
    document.getElementById('btn-hard').classList.toggle('active', diff === 'hard');
};

window.pressStartButton = function() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    resetGameData();
};

function backToMenu() {
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    resetGameData();
}

function resetGameData() {
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            boardState[r][c] = (r < 3) ? ((r+c)%2 ? 2 : 0) : ((r > 4) ? ((r+c)%2 ? 1 : 0) : 0);
            if(r===0 && (c===1||c===3||c===5||c===7)) boardState[r][c] = 2;
        }
    }
    // Короткий сброс доски
    const init = [[0,2,0,2,0,2,0,2],[2,0,2,0,2,0,2,0],[0,2,0,2,0,2,0,2],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[1,0,1,0,1,0,1,0],[0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0]];
    for(let i=0; i<8; i++) for(let j=0; j<8; j++) boardState[i][j] = init[i][j];
    
    currentTurn = 1;
    playerAte = 0; botAte = 0;
    updateStatsUI();
    renderBoard();
}

function updateStatsUI() {
    if(document.getElementById('stats-player-ate')) {
        document.getElementById('stats-player-ate').innerText = playerAte;
        document.getElementById('stats-bot-ate').innerText = botAte;
        document.getElementById('win-player').innerText = playerWins;
        document.getElementById('win-bot').innerText = botWins;
    }
}

function checkPieceCapture(row, col, pieceVal) {
    const isKing = (pieceVal === 11 || pieceVal === 22);
    const isWhite = (pieceVal === 1 || pieceVal === 11);
    const dirs = [{ dr: 1, dc: 1 }, { dr: 1, dc: -1 }, { dr: -1, dc: 1 }, { dr: -1, dc: -1 }];
    for (let d of dirs) {
        let r = row + d.dr, c = col + d.dc, enemy = null;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (boardState[r][c] !== 0) {
                if ((isWhite ? (boardState[r][c]===2 || boardState[r][c]===22) : (boardState[r][c]===1 || boardState[r][c]===11)) && !enemy) enemy = {r, c};
                else break;
            } else if (enemy) return { targetRow: r, targetCol: c, jumpedRow: enemy.r, jumpedCol: enemy.c };
            if (!isKing) break;
            r += d.dr; c += d.dc;
        }
    }
    return null;
}

function renderBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = cell ${(r+c)%2 ? 'black-cell' : 'white-cell'};
            if (boardState[r][c] !== 0) {
                const p = document.createElement('div');
                p.className = piece ${boardState[r][c]===1||boardState[r][c]===11 ? 'white-piece':'black-piece'};
                if (boardState[r][c]===11||boardState[r][c]===22) p.innerHTML = '👑';
                p.onclick = () => { if(currentTurn===1 && (boardState[r][c]===1||boardState[r][c]===11)) selectPiece(r, c, p); };
                cell.appendChild(p);
            }
            cell.onclick = () => { if(currentTurn===1) movePiece(r, c); };
            boardElement.appendChild(cell);
        }
    }
}

function selectPiece(r, c, el) {
    selectedPiece = { r, c, el };
}

function movePiece(tr, tc) {
    if(!selectedPiece || (tr+tc)%2===0 || boardState[tr][tc] !== 0) return;
    const isKing = boardState[selectedPiece.r][selectedPiece.c] === 11;
    const rd = tr - selectedPiece.r, cd = tc - selectedPiece.c;
    
    if(!isKing && Math.abs(rd)===1 && rd>=0) { alert("Назад нельзя!"); return; }
    
    boardState[tr][tc] = boardState[selectedPiece.r][selectedPiece.c];
    boardState[selectedPiece.r][selectedPiece.c] = 0;
    if(tr === 0) boardState[tr][tc] = 11;
    
    selectedPiece = null;
    renderBoard();
    currentTurn = 2;
    setTimeout(makeBotMove, 600);
}

function makeBotMove() {
    let pCount = 0;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(boardState[r][c]===1||boardState[r][c]===11) pCount++;
    if(pCount === 0) { alert("Вы проиграли!"); botWins++; backToMenu(); return; }
    
    // Бот делает простой ход (имитация)
    let moved = false;
    for(let r=7; r>=0 && !moved; r--) {
        for(let c=0; c<8 && !moved; c++) {
            if(boardState[r][c]===2 || boardState[r][c]===22) {
                if(r+1<8 && c+1<8 && boardState[r+1][c+1]===0) {
                    boardState[r+1][c+1] = boardState[r][c]; boardState[r][c]=0; moved=true;
                }
            }
        }
    }
    renderBoard();
    currentTurn = 1;
}
