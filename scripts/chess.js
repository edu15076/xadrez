// ---------ínicio tabuleiro----------
let turn = 'white';
let enPassant = null;

let square = {
    whiteAttack: false,
    blackAttack: false,
    piece: null
};

let board = [[],[],[],[],[],[],[],[]];

function originalBoardSettings() {
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            board[i][j] = Object.create(square);
            if (j === 3 || j === 4)
                board[i][j].whiteAttack = board[i][j].blackAttack = false; 
            else if (j === 5)
                board[i][j].whiteAttack = true;
            else if (j === 2)
                board[i][j].blackAttack = true;
            else if (j === 0) {
                board[i][j].whiteAttack = false;
                if (i === 0 || i === 7) {
                    board[i][j].blackAttack = false;
                    board[i][j].piece = Object.create(rook);
                    board[i][j].piece.x = i;
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else if (i === 1 || i === 6) {
                    board[i][j].blackAttack = true;
                    board[i][j].piece = Object.create(knight);
                    board[i][j].piece.x = i;
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else if (i === 2 || i === 5) {
                    board[i][j].blackAttack = true;
                    board[i][j].piece = Object.create(bishop);
                    board[i][j].piece.x = i;
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else if (i === 3) {
                    board[i][j].blackAttack = true;
                    board[i][j].piece = Object.create(queen);
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else {
                    board[i][j].blackAttack = true;
                    board[i][j].piece = Object.create(king);
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                }
            } else if (j === 1) {
                board[i][j].whiteAttack = false;
                board[i][j].blackAttack = true;
                board[i][j].piece = Object.create(pawn);
                board[i][j].piece.x = i;
                board[i][j].piece.y = 1;
                board[i][j].piece.color = 'black';
            } else if (j === 6) {
                board[i][j].blackAttack = false;
                board[i][j].whiteAttack = true;
                board[i][j].piece = Object.create(pawn);
                board[i][j].piece.x = i;
            } else if (j === 7) {
                board[i][j].blackAttack = false;
                if (i === 0 || i === 7) {
                    board[i][j].piece = Object.create(rook);
                    board[i][j].piece.x = i;
                } else if (i === 1 || i === 6) {
                    board[i][j].whiteAttack = true;
                    board[i][j].piece = Object.create(knight);
                    board[i][j].piece.x = i;
                } else if (i === 2 || i === 5) {
                    board[i][j].whiteAttack = true;
                    board[i][j].piece = Object.create(bishop);
                    board[i][j].piece.x = i;
                } else if (i === 3) {
                    board[i][j].whiteAttack = true;
                    board[i][j].piece = Object.create(queen);
                } else {
                    board[i][j].whiteAttack = true;
                    board[i][j].piece = Object.create(king);
                }
            }
        }
}
originalBoardSettings();
let whiteKing = board[4][7].piece;
let blackKing = board[4][0].piece;

// ---------Fim tabuleiro----------
let pieces = document.querySelectorAll('.piece');
let bodyEl = document.querySelector('body');
let possiblesMoves = [];
let squares = document.querySelectorAll('#pieces-move div');

function drawMoves(moves) {
    for (let move of moves) {
        let canvasEl = document.createElement('canvas');
        let boardEl = document.getElementById('board');
        let side = boardEl.clientWidth / 8;
        
        canvasEl.width = side;
        canvasEl.height = side;

        canvasEl.style.width = `${squares[0].offsetWidth}px`;
        canvasEl.style.height = `${squares[0].offsetWidth}px`;
        
        let ctx = canvasEl.getContext('2d');
        let circle = new Path2D();
        ctx.fillStyle = '#1212128f';
        
        if (squares[move[0] - 8 * move[1] + 56].querySelector(':first-child') === null) {
            circle.arc(side / 2, side / 2, side / 4, 0, 2 * Math.PI);
            ctx.fill(circle);
        } else {
            circle.arc(side / 2, side / 2, side / 2, 0, 2 * Math.PI, true);
            circle.arc(side / 2, side / 2, side / 2.5, 0, 2 * Math.PI, false);
            ctx.fill(circle);
        }
        squares[move[0] - 8 * move[1] + 56].appendChild(canvasEl);
        possiblesMoves.push(squares[move[0] - 8 * move[1] + 56]);
    }
}

function removeMoves(moves) {
    moves.forEach(move => {
        let canvas = squares[move[0] - 8 * move[1] + 56].querySelector('canvas');
        squares[move[0] - 8 * move[1] + 56].removeChild(canvas);
        possiblesMoves = [];
    });
}

function getAttacks() {
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++)
            board[x][y].blackAttack = board[x][y].whiteAttack = false;

    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++)
            if (board[x][y].piece != null) {
                let attacks = board[x][y].piece.attacks();
                attacks.forEach(attack => {
                    board[attack[0]][attack[1]][`${board[x][y].piece.color}Attack`] = true;
                });
            }
}

let finalMove;
let movesDrawn = [];
let piecesMoveEl = document.getElementById('pieces-move');

function getDistance(el) {
    let x = 0;
    let y = 0;

    while(el) {
        x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        y += (el.offsetTop - el.scrollTop + el.clientTop);

        el = el.offsetParent;
    }
    return [x, y];
}

let distanceBoard = getDistance(piecesMoveEl);

addEventListener('resize', () => {
    removeMoves(movesDrawn);
    drawMoves(movesDrawn);
    distanceBoard = getDistance(piecesMoveEl);
});

function eventListentersForMove(pieceEl) {
    function movementStart(parent, x, y) {
        parent = pieceEl.closest('[data-square]');
        x = parent.dataset.square.charCodeAt(0) - 97;
        y = 8 - parent.dataset.square[1];
        pieceEl.style.zIndex = '101';
        
        if (board[x][y].piece.color === turn) {
            movesDrawn = board[x][y].piece.moves();
            drawMoves(movesDrawn);
        } else
            movesDrawn = [];
        
        return [parent, x, y];
    }

    function movePieceAtBoard(e) {
        let distancePiece = getDistance(pieceEl.closest('[data-square]'));

        if (distanceBoard[0] < e.pageX && distanceBoard[0] + piecesMoveEl.clientWidth > e.pageX)
            pieceEl.style.left = `${e.pageX - distancePiece[0] - pieceEl.offsetWidth / 2}px`;

        if (distanceBoard[1] < e.pageY && distanceBoard[1] + piecesMoveEl.clientHeight > e.pageY)
            pieceEl.style.top = `${e.pageY - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
    }

    function doMovementAtEnd(x, y, xToMove, yToMove, finalParent) {
        board[xToMove][yToMove].piece = board[x][y].piece;
        board[xToMove][yToMove].piece.x = xToMove;
        board[xToMove][yToMove].piece.y = yToMove;
        if (board[xToMove][yToMove].piece.moved != undefined)
            board[xToMove][yToMove].piece.moved = true;

        board[x][y].piece = null;
        
        finalParent.innerHTML = '';
        finalParent.appendChild(pieceEl);
        getAttacks();
        turn = turn === 'white' ? 'black' : 'white';
    }

    function movementEnd(x, y, xToMove, yToMove, finalParent, parent) {
        if (board[x][y].piece != null && board[x][y].piece.color === turn)
            for (let pieceMove of board[x][y].piece.moves())
                if (pieceMove[0] === xToMove && pieceMove[1] === yToMove) {
                    removeMoves(movesDrawn);
                    movesDrawn = [];

                    if (board[x][y].piece.piece === 'pawn')
                        if (Math.abs(yToMove - y) != 2) {
                            if (yToMove != 7 && yToMove != 0) {
                                if (enPassant != null && xToMove === enPassant[0] && yToMove === enPassant[1]) {
                                    board[xToMove][yToMove-board[x][y].piece.moveDirection()].piece = null;
                                    squares[xToMove - 8 * (yToMove-board[x][y].piece.moveDirection()) + 56].innerHTML = '';
                                }

                                doMovementAtEnd(x, y, xToMove, yToMove, finalParent);
                            } else
                                promotePawn(x, y, xToMove, yToMove, parent, finalParent);
                            enPassant = null;
                        } else {
                            enPassant = [x, y+board[x][y].piece.moveDirection()];
                            doMovementAtEnd(x, y, xToMove, yToMove, finalParent);
                        }
                    else {
                        doMovementAtEnd(x, y, xToMove, yToMove, finalParent);
                        enPassant = null;
                    }
                    break;
                }
        pieceEl.style.zIndex = '1';
    }

    function movePieceAtBoardTouch(e) {
        let distancePiece = getDistance(pieceEl.closest('[data-square]'));

        for (let i = 0; i < e.changedTouches.length; i++) {
            if (distanceBoard[0] < e.changedTouches[i].pageX && distanceBoard[0] + piecesMoveEl.clientWidth > e.changedTouches[i].pageX)
                pieceEl.style.left = `${e.changedTouches[i].pageX - distancePiece[0] - pieceEl.offsetWidth / 2}px`;

            if (distanceBoard[1] < e.changedTouches[i].pageY && distanceBoard[1] + piecesMoveEl.clientHeight > e.changedTouches[i].pageY)
                pieceEl.style.top = `${e.changedTouches[i].pageY - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
        }
    }

    function promotePawn(x, y, xToMove, yToMove, parent, finalParent) {
        let pawnColor = board[x][y].piece.color;
        let promotionEl = document.getElementById(`${pawnColor}-promotion`);
        let promotionPieceEl = promotionEl.querySelectorAll('div > img');
        promotionEl.style.display = 'flex';
        
        promotionPieceEl.forEach(pieceToSelect => {
            pieceToSelect.onclick = () => {
                switch (pieceToSelect.dataset.piece) {
                    case 'queen':
                        board[xToMove][yToMove].piece = Object.create(queen);
                        break;
                    case 'knight':
                        board[xToMove][yToMove].piece = Object.create(knight);
                        break;
                    case 'rook':
                        board[xToMove][yToMove].piece = Object.create(rook);
                        board[xToMove][yToMove].piece.moved = true;
                        break;
                    default:
                        board[xToMove][yToMove].piece = Object.create(bishop);
                }

                board[xToMove][yToMove].piece.x = xToMove;
                board[xToMove][yToMove].piece.y = yToMove;
                board[xToMove][yToMove].piece.color = pawnColor;
                board[x][y].piece = null;
                
                let newPiece = document.createElement('img');
                newPiece.src = pieceToSelect.src;
                newPiece.classList.add('piece');
                newPiece.draggable = false;
                [newPiece].forEach(eventListentersForMove);

                parent.innerHTML = '';
                finalParent.innerHTML = '';
                finalParent.appendChild(newPiece);
                getAttacks();
                turn = turn === 'white' ? 'black' : 'white';
                promotionEl.style.display = 'none';
                pieceToSelect.onclick = null;
            }
        });
    }

    pieceEl.onclick = function() {
        removeMoves(movesDrawn);
        let parent, x, y;

        let startCase = movementStart(parent, x, y);
        parent = startCase[0];
        x = startCase[1];
        y = startCase[2];
        
        for (let possibleMove of possiblesMoves) {
            possibleMove.onclick = function(e) {
                
                let finalParent = e.currentTarget;
                let xToMove = finalParent.dataset.square.charCodeAt(0) - 97;
                let yToMove = 8 - finalParent.dataset.square[1];
                
                if (finalParent === null) {
                    pieceEl.style.zIndex = '1';
                    return;
                }
                
                movementEnd(x, y, xToMove, yToMove, finalParent, parent);
                x = xToMove;
                y = yToMove;
                parent = finalParent;
            }
        }
    }

    pieceEl.ondragstart = () => false;

    pieceEl.onmousedown = function(e) {
        removeMoves(movesDrawn);
        let parent, x, y;

        let startCase = movementStart(parent, x, y);
        parent = startCase[0];
        x = startCase[1];
        y = startCase[2];

        movePieceAtBoard(e);

        piecesMoveEl.addEventListener('mousemove', movePieceAtBoard);

        pieceEl.onmouseup = function(e) {
            piecesMoveEl.removeEventListener('mousemove', movePieceAtBoard);

            pieceEl.style.top = '0';
            pieceEl.style.left = '0';

            let finalParent = document.elementsFromPoint(e.pageX, e.pageY)[0].closest('[data-square]');
            if (finalParent === null) {
                pieceEl.style.zIndex = '1';
                pieceEl.onmouseup = null;
                return;
            }

            let xToMove = finalParent.dataset.square.charCodeAt(0) - 97;
            let yToMove = 8 - finalParent.dataset.square[1];
            
            movementEnd(x, y, xToMove, yToMove, finalParent, parent);
            pieceEl.onmouseup = null;
        }

    }
    
    let parent, x, y;

    pieceEl.addEventListener('touchstart', e => {
        removeMoves(movesDrawn);

        let startCase = movementStart(parent, x, y);
        parent = startCase[0];
        x = startCase[1];
        y = startCase[2];

        movePieceAtBoardTouch(e);
    });

    pieceEl.addEventListener('touchmove', movePieceAtBoardTouch);

    pieceEl.addEventListener('touchend', e => {
        pieceEl.style.top = '0';
        pieceEl.style.left = '0';

        let finalParent;
        for (let i = 0; i < e.changedTouches.length; i++)
            finalParent = document.elementsFromPoint(e.changedTouches[i].pageX, e.changedTouches[i].pageY)[1].closest('[data-square]');
        if (finalParent === null) {
            pieceEl.style.zIndex = '1';
            return;
        }

        let xToMove = finalParent.dataset.square.charCodeAt(0) - 97;
        let yToMove = 8 - finalParent.dataset.square[1];
        
        movementEnd(x, y, xToMove, yToMove, finalParent, parent);
    });
}

pieces.forEach(eventListentersForMove);

let resetEl = document.getElementById('reset');

resetEl.addEventListener('click', () => {
    originalBoardSettings();
    turn = 'white';
    
    for (let i = 0; i < 64; i++) {
        let x = squares[i].dataset.square.charCodeAt(0) - 97;
        let y = 8 - squares[i].dataset.square[1];
        
        squares[i].innerHTML = '';
        if (board[x][y].piece != null) {
            let newPiece = document.createElement('img');
            newPiece.classList.add('piece');
            newPiece.src = `img/${board[x][y].piece.color}_${board[x][y].piece.piece}.svg`;
            [newPiece].forEach(eventListentersForMove);

            squares[i].appendChild(newPiece);
        }
    }
});