let boardElement;
let selectedPiece = null;
let currentTurn = 1; // 1 — Игрок, 2 — Бот
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
    renderBoard();
});

window.changeDiff = function(diff) {
    difficulty = diff;
    document.getElementById('btn-easy').classList.toggle('active', diff === 'easy');
    document.getElementById('btn-medium').classList.toggle('active', diff === 'medium');
    document.getElementById('btn-hard').classList.toggle('active', diff === 'hard');
};

window.pressStartButton = function() {
    document.getElementById('start-screen').style.display = 'none';
    resetGameData();
};

window.surrender = function() {
    alert("Вы сдались! Бот получает победу.");
    botWins++;
    backToMenu();
};

function backToMenu() {
    document.getElementById('start-screen').style.display = 'flex';
    resetGameData();
}

function resetGameData() {
    boardState.length = 0;
    boardState.push(
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]
    );
    currentTurn = 1;
    selectedPiece = null;
    isChainJumping = false;
    playerAte = 0;
    botAte = 0;
    consecutiveKingMoves = 0;
    updateStatsUI();
    renderBoard();
}

function updateStatsUI() {
    if(document.getElementById('stats-player-ate')) {
        document.getElementById('stats-player-ate').innerText = playerAte;
        document.getElementById('stats-bot-ate').innerText = botAte;
        document.getElementById('stats-draw-moves').innerText = consecutiveKingMoves;
        document.getElementById('win-player').innerText = playerWins;
        document.getElementById('win-bot').innerText = botWins;
    }
}

function hasAnyCaptures(playerType) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let val = boardState[r][c];
            if ((playerType === 1 && (val === 1 || val === 11)) || (playerType === 2 && (val === 2 || val === 22))) {
                if (checkPieceCapture(r, c, val)) return true;
            }
        }
    }
    return false;
}

function checkPieceCapture(row, col, pieceVal) {
    const isKing = (pieceVal === 11 || pieceVal === 22);
    const directions = [{ dr: 1, dc: 1 }, { dr: 1, dc: -1 }, { dr: -1, dc: 1 }, { dr: -1, dc: -1 }];
    const isWhite = (pieceVal === 1 || pieceVal === 11);

    for (let dir of directions) {
        let r = row + dir.dr;
        let c = col + dir.dc;
        let enemyFound = null;

        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
            let currentCell = boardState[r][c];

            if (currentCell !== 0) {
                let isEnemy = isWhite ? (currentCell === 2 || currentCell === 22) : (currentCell === 1 || currentCell === 11);
                
                if (isEnemy && !enemyFound) {
                    enemyFound = { row: r, col: c };
                } else {
                    break; 
                }
            } else {
                if (enemyFound) {
                    return { targetRow: r, targetCol: c, jumpedRow: enemyFound.row, jumpedCol: enemyFound.col };
                }
            }

            if (!isKing && Math.abs(r - row) === 2) break; 
            
            r += dir.dr;
            c += dir.dc;
        }
    }
    return null;
}

function countKings() {
    let pKings = 0, bKings = 0, pTotal = 0, bTotal = 0;
    for(let r=0; r<8; r++) {
        for(let c=0; c<8; c++) {
            if (boardState[r][c] === 1) pTotal++;
            if (boardState[r][c] === 11) { pTotal++; pKings++; }
            if (boardState[r][c] === 2) bTotal++;
            if (boardState[r][c] === 22) { bTotal++; bKings++; }
        }
    }
    return { pKings, bKings, pTotal, bTotal };
}

function renderBoard() {
    if (!boardElement) return;
    boardElement.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const isBlackCell = (row + col) % 2 === 1;
            cell.classList.add(isBlackCell ? 'black-cell' : 'white-cell');
            
            if (isBlackCell && boardState[row][col] !== 0) {
                const pieceVal = boardState[row][col];
                const piece = document.createElement('div');
                piece.classList.add('piece');
                piece.classList.add((pieceVal === 1 || pieceVal === 11) ? 'white-piece' : 'black-piece');
                
                if (pieceVal === 11 || pieceVal === 22) piece.innerHTML = '👑';
                if (isChainJumping && selectedPiece && selectedPiece.row === row && selectedPiece.col === col) piece.classList.add('selected');

                piece.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isChainJumping) return;
                    if (currentTurn === 1 && (pieceVal === 1 || pieceVal === 11)) selectPiece(row, col, piece);
                });
                cell.appendChild(piece);
            }

            cell.addEventListener('click', () => {
                if (currentTurn === 1) movePiece(row, col);
            });
            boardElement.appendChild(cell);
        }
    }
}

function selectPiece(row, col, element) {
    if (selectedPiece) selectedPiece.element.classList.remove('selected');
    selectedPiece = { row, col, element };
    element.classList.add('selected');
}

function movePiece(targetRow, targetCol) {
    if (!selectedPiece) return;
    const isBlackCell = (targetRow + targetCol) % 2 === 1;
    if (!isBlackCell || boardState[targetRow][targetCol] !== 0) return;

    const fromRow = selectedPiece.row;
    const fromCol = selectedPiece.col;
    let pieceType = boardState[fromRow][fromCol];

    const rowDiff = targetRow - fromRow;
    const colDiff = targetCol - fromCol;
    let hasCaptured = false;
    let jumpedRow = -1;
    let jumpedCol = -1;

    const playerMustCapture = hasAnyCaptures(1);
    const isKing = (pieceType === 11);

    if (Math.abs(rowDiff) === Math.abs(colDiff)) {
        let dr = rowDiff > 0 ? 1 : -1;
        let dc = colDiff > 0 ? 1 : -1;
        let r = fromRow + dr;
        let c = fromCol + dc;
        let enemiesCount = 0;

        while (r !== targetRow && c !== targetCol) {
            if (boardState[r][c] !== 0) {
                if (boardState[r][c] === 2 || boardState[r][c] === 22) {
                    enemiesCount++;
                    jumpedRow = r;
                    jumpedCol = c;
                } else {
                    enemiesCount = 99; 
                }
            }
            r += dr;
            c += dc;
        }

        if (!isKing && Math.abs(rowDiff) !== 2) {
            if (enemiesCount === 1) return; 
        }

        if (enemiesCount === 1) {
            boardState[jumpedRow][jumpedCol] = 0;
            hasCaptured = true;
            playerAte++;
            consecutiveKingMoves = 0;
        } else if (enemiesCount > 1) {
            return; 
        }
    }

    if (!hasCaptured) {
        if (playerMustCapture) {
            alert("Вы обязаны рубить!");
            return;
        }
        if (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 1) {
            if (!isKing && rowDiff > 0) return; 
            
            if (isKing) {
                let info = countKings();
                if (info.pTotal === info.pKings && info.bTotal === info.bKings) consecutiveKingMoves++;
            } else {
                consecutiveKingMoves = 0;
            }
        } else if (isKing) {
            let dr = rowDiff > 0 ? 1 : -1;
            let dc = colDiff > 0 ? 1 : -1;
            let r = fromRow + dr;
            let c = fromCol + dc;
            while (r !== targetRow) {
                if (boardState[r][c] !== 0) return; 
                r += dr; c += dc;
            }
            let info = countKings();
            if (info.pTotal === info.pKings && info.bTotal === info.bKings) consecutiveKingMoves++;
        } else {
            return;
        }
    }

    if (!isKing && targetRow === 0) pieceType = 11;

    boardState[fromRow][fromCol] = 0;
    boardState[targetRow][targetCol] = pieceType;

    let nextCapture = checkPieceCapture(targetRow, targetCol, pieceType);

    if (hasCaptured && nextCapture) {
        isChainJumping = true;
        selectedPiece = { row: targetRow, col: targetCol, element: null };
        updateStatsUI();
        renderBoard();
    } else {
        isChainJumping = false;
        selectedPiece = null;
        updateStatsUI();
        renderBoard();

        if (consecutiveKingMoves >= 15) {
            alert("Ничья! 15 ходов дамок без взятия.");
            backToMenu();
            return;
        }

        currentTurn = 2;
        setTimeout(makeBotMove, 600);
    }
}

function isMoveDangerous(fromRow, fromCol, toRow, toCol, currentVal) {
    let origFrom = boardState[fromRow][fromCol];
    let origTo = boardState[toRow][toCol];
    
    boardState[fromRow][fromCol] = 0;
    boardState[toRow][toCol] = currentVal;

    let underAttack = false;
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let val = boardState[r][c];
            if (val === 1 || val === 11) {
                if (checkPieceCapture(r, c, val)) {
                    underAttack = true;
                    break;
                }
            }
        }
        if (underAttack) break;
    }

    boardState[fromRow][fromCol] = origFrom;
    boardState[toRow][toCol] = origTo;

    return underAttack;
}

function makeBotMove() {
    if (currentTurn !== 2) return;

    let botPieces = [];
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let val = boardState[r][c];
            if (val === 2 || val === 22) botPieces.push({ row: r, col: c, val: val });
        }
    }

    if (botPieces.length === 0) {
        alert("Вы победили!");
        playerWins++;
        backToMenu();
        return;
    }

    // 1. СБОР ВСЕХ ДОСТУПНЫХ ВАРИАНТОВ РУБКИ
    let captureMoves = [];
    for (let piece of botPieces) {
        let capture = checkPieceCapture(piece.row, piece.col, piece.val);
        if (capture) {
            let score = 0;
            if (difficulty === 'hard' || difficulty === 'medium') {
                if (!isMoveDangerous(piece.row, piece.col, capture.targetRow, capture.targetCol, piece.val)) {
                    score += 100;
                }
            }
            captureMoves.push({ piece, capture, score });
        }
    }

    if (captureMoves.length > 0) {
        if (difficulty !== 'easy') {
            captureMoves.sort((a, b) => b.score - a.score);
        }
        let bestCapture = captureMoves[0];
        let piece = bestCapture.piece;
        let capture = bestCapture.capture;

        let pType = boardState[piece.row][piece.col];
        boardState[piece.row][piece.col] = 0;
        boardState[capture.jumpedRow][capture.jumpedCol] = 0;
        botAte++;
        consecutiveKingMoves = 0;

        if (pType === 2 && capture.targetRow === 7) pType = 22;

        boardState[capture.targetRow][capture.targetCol] = pType;
        updateStatsUI();
        renderBoard();

        let nextCapture = checkPieceCapture(capture.targetRow, capture.targetCol, pType);
        if (nextCapture) {
            setTimeout(() => { continueBotChain(capture.targetRow, capture.targetCol); }, 600);
        } else {
            currentTurn = 1;
        }
        return;
    }

    // 2. ОБЫЧНЫЙ ТИХИЙ ХОД
    let validMoves = [];
    for (let piece of botPieces) {
        let isKing = (piece.val === 22);
        
        // СТРОГОЕ ИСПРАВЛЕНИЕ: Обычные шашки бота ходят только вниз (dr: 1). Дамки ходят во все стороны.
        let directions = [{ dr: 1, dc: 1 }, { dr: 1, dc: -1 }];
        if (isKing) {
            directions.push({ dr: -1, dc: 1 }, { dr: -1, dc: -1 });
        }

        for (let dir of directions) {
            let targetRow = piece.row + dir.dr;
            let targetCol = piece.col + dir.dc;

            while (targetRow >= 0 && targetRow < 8 && targetCol >= 0 && targetCol < 8) {
                if (boardState[targetRow][targetCol] === 0) {
                    let score = 0;
                    
                    if (difficulty === 'medium') {
                        score += targetRow * 4; 
                    }
                    
                    if (difficulty === 'hard') {
                        score += targetRow * 15; 
                        if (targetCol === 0 || targetCol === 7) score += 12; 
                        if (piece.val === 2 && targetRow === 7) score += 999; 
                    }

                    validMoves.push({
                        fromRow: piece.row, fromCol: piece.col,
                        toRow: targetRow, toCol: targetCol, val: piece.val, score: score
                    });
                } else {
                    break; 
                }
                if (!isKing) break; 
                targetRow += dir.dr;
                targetCol += dir.dc;
            }
        }
    }

    if (validMoves.length === 0) {
        alert("У бота нет доступных ходов! Вы выиграли.");
        playerWins++;
        backToMenu();
        return;
    }

    // 3. УМНАЯ СОРТИРОВКА ТИХИХ ХОДОВ
    if (difficulty === 'easy') {
        validMoves.sort(() => Math.random() - 0.5);
    } 
    else {
        let safeMoves = validMoves.filter(m => !isMoveDangerous(m.fromRow, m.fromCol, m.toRow, m.toCol, m.val));
        if (safeMoves.length > 0) validMoves = safeMoves;
        validMoves.sort((a, b) => b.score - a.score);
    }

    let finalMove = validMoves[0];
    let finalType = finalMove.val;
    if (finalType === 2 && finalMove.toRow === 7) finalType = 22; 

    boardState[finalMove.fromRow][finalMove.fromCol] = 0;
    boardState[finalMove.toRow][finalMove.toCol] = finalType;
    
    let info = countKings();
    if (finalType === 22 && info.pTotal === info.pKings && info.bTotal === info.bKings) {
        consecutiveKingMoves++;
    } else {
        consecutiveKingMoves = 0;
    }

    updateStatsUI();
    renderBoard();

    if (consecutiveKingMoves >= 15) {
        alert("Ничья! 15 ходов дамок без взятия.");
        backToMenu();
        return;
    }

    currentTurn = 1;
}

function continueBotChain(row, col) {
    let pType = boardState[row][col];
    let capture = checkPieceCapture(row, col, pType);
    if (capture) {
        boardState[row][col] = 0;
        boardState[capture.jumpedRow][capture.jumpedCol] = 0;
        botAte++;
        if (pType === 2 && capture.targetRow === 7) pType = 22;
        boardState[capture.targetRow][capture.targetCol] = pType;
        updateStatsUI();
        renderBoard();

        let nextCapture = checkPieceCapture(capture.targetRow, capture.targetCol, pType);
        if (nextCapture) {
            setTimeout(() => { continueBotChain(capture.targetRow, capture.targetCol); }, 600);
        } else {
            currentTurn = 1;
        }
    } else {
        currentTurn = 1;
    }
}