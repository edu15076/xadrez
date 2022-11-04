/** The current piece color to move. */
let turn = 'white';

/**
 * If en passant is possible it contains the possition, an `Array`, where en passant is possible.
 * 
 * `null` if en passant is not possible.
*/
let enPassant = null;

/**
 * This is an `Object` that contains: 
 * - Attacks from black and white
 * - A piece
*/
let square = {
    whiteAttack: false,
    blackAttack: false,
    piece: null
};

let whiteKing, blackKing;

/** This is a matrix of `square`, it contains one `square` for each position on a chess board. */
let board = [[],[],[],[],[],[],[],[]];

/** Set the global variable `board` to its initial configuration. */
function originalBoardSettings() {
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            board[i][j] = Object.create(square);
            if (j === 0 || j === 1 || j === 6 || j === 7) {
                if (j === 1 || j === 6) {
                    board[i][j].piece = Object.create(pawn);
                    if (j === 1)
                        board[i][j].piece.color = 'black';
                } else {
                    if (i === 0 || i === 7) {
                        board[i][j].piece = Object.create(rook);
                        if (j === 0)
                            board[i][j].piece.color = 'black';
                    } else if (i === 1 || i === 6) {
                        board[i][j].piece = Object.create(knight);
                        if (j === 0)
                            board[i][j].piece.color = 'black';
                    } else if (i === 2 || i === 5) {
                        board[i][j].piece = Object.create(bishop);
                        if (j === 0)
                            board[i][j].piece.color = 'black';
                    } else if (i === 3) {
                        board[i][j].piece = Object.create(queen);
                        if (j === 0)
                            board[i][j].piece.color = 'black';
                    } else {
                        board[i][j].piece = Object.create(king);
                        if (j === 0)
                            board[i][j].piece.color = 'black';
                    }
                }
                board[i][j].piece.x = i;
                board[i][j].piece.y = j;
            }
        }
    whiteKing = board[4][7].piece;
    blackKing = board[4][0].piece;
    getAttacks();
}

let pieces = document.querySelectorAll('.piece');
let bodyEl = document.querySelector('body');
let squares = document.querySelectorAll('#pieces-move div');

/**
 * Draw the possible `piece` moves on the board.
 * 
 * @param {moves} moves The possible moves of a `piece`.
 */
function drawMoves(moves) {
    for (let move of moves) {
        let canvasEl = document.createElement('canvas');
        let side = squares[0].offsetWidth;
        
        canvasEl.width = side;
        canvasEl.height = side;

        canvasEl.style.width = `${side}px`;
        canvasEl.style.height = `${side}px`;
        
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
    }
}

/**
 * Erase the possible `piece` moves on the board.
 * 
 * @param {moves} moves The possible moves of a `piece`.
 */
function removeMoves(moves) {
    moves.forEach(move => {
        let canvas = squares[move[0] - 8 * move[1] + 56].querySelector('canvas');
        if (canvas != null)
            squares[move[0] - 8 * move[1] + 56].removeChild(canvas);
    });
}

/**
 * Set all `Atacks` on the global variable `board` to `false`.
 */
function removeAttacks() {
    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++)
            board[x][y].blackAttack = board[x][y].whiteAttack = false;
}

/**
 * Set possible `Atacks` for each color to `true` on the global variable `board`.
 */
function getAttacks() {
    removeAttacks();

    for (let x = 0; x < 8; x++)
        for (let y = 0; y < 8; y++)
            if (board[x][y].piece != null) {
                let attacks = board[x][y].piece.attacks();
                attacks.forEach(attack => {
                    board[attack[0]][attack[1]][`${board[x][y].piece.color}Attack`] = true;
                });
            }
}

originalBoardSettings();

/**
 * Check whether the `king`, independing on its color, is under a check.
 * 
 * @param {kingX} kingX The position o the `king` on x.
 * @param {kingY} kingY The position o the `king` on y.
 * @returns `true` if the king is checked or `false` if it is not.
 */
function getCheck(kingX, kingY) {
    removeAttacks();
    let opositeColor = turn === 'white' ? 'black' : 'white';

    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++)
            if (board[i][j].piece != null && board[i][j].piece.color === opositeColor) {
                let attacks = board[i][j].piece.attacks();
                attacks.forEach(attack => {
                    board[attack[0]][attack[1]][`${opositeColor}Attack`] = true;
                });
                if (board[kingX][kingY][`${opositeColor}Attack`])
                    return true;
            }

    return false;
}

/**
 * Check whether the `king` of the current `turn` is mated.
 * 
 * @returns `true` if the `king` from the current `turn` is mated or `false` if it is not.
 */
function getMate() {
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++)
            if (board[i][j].piece != null && board[i][j].piece.color === turn)
                if (board[i][j].piece.moves().length != 0)
                    return false;
    return true;
}

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
    rotateBoard(document.querySelector(`[data-color="${piecesUser}"]`));
});

let gameOverEl = document.getElementById('game-over');

function preventDefault(e) { e.preventDefault(); }

/** Let a `piece` move. */
function eventListenersForMove(pieceEl) {
    let movedByTouch = false;
    function promotePawn(x, y, xToMove, yToMove, parent, finalParent) {
        let pawnColor = board[x][y].piece.color;
        let promotionEl = document.getElementById(`${pawnColor}-promotion`);
        let promotionPieceEl = promotionEl.querySelectorAll('div > img');
        promotionEl.style.display = 'flex';
        
        function undoPromotion(e) {
            if (e.target.closest('section') != promotionEl)
                promotionEl.style.display = 'none';
            bodyEl.onclick = null;
        }
        bodyEl.onclick = movedByTouch ? undoPromotion : () => { bodyEl.onclick = undoPromotion; };
        
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
                [newPiece].forEach(eventListenersForMove);

                parent.innerHTML = '';
                finalParent.innerHTML = '';
                finalParent.appendChild(newPiece);
                getAttacks();
                turn = turn === 'white' ? 'black' : 'white';
                promotionEl.style.display = 'none';
                pieceToSelect.onclick = null;

                removeMoves(movesDrawn);
            }
        });
    }

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
        if (board[x][y].piece.piece === 'king' && Math.abs(x-xToMove) === 2) {
            let xRook = x-xToMove > 0 ? 0 : 7;
            let xRookToMove = x-xToMove > 0 ? 3 : 5;
            board[xRookToMove][y].piece = board[x+3][y].piece;
            board[xRookToMove][y].piece.moved = true;
            board[xRookToMove][y].piece.x = xRookToMove;
            board[xRook][y].piece = null;
            
            squares[xRookToMove - 8 * y + 56].appendChild(squares[xRook - 8 * y + 56].querySelector('img'));
            squares[xRook - 8 * y + 56].innerHTML = '';
            [squares[xRookToMove - 8 * y + 56].querySelector('img')].forEach(eventListenersForMove);
        }
        
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

                    removeMoves(movesDrawn);
                    movesDrawn = [];
                    
                    let colorKing = turn === 'white' ? whiteKing : blackKing;
                    let opositeColor = turn === 'white' ? 'black' : 'white';
                    if (board[colorKing.x][colorKing.y][`${opositeColor}Attack`])
                    if (getMate()) {
                            let gameResultEl = gameOverEl.querySelector('h2');
                            let resultColor = opositeColor === piecesUser ? 'greenyellow' : 'red';

                            gameOverEl.querySelector('p').innerHTML = 'by checkmate';
                            gameResultEl.innerHTML = `${opositeColor.charAt(0).toUpperCase()+opositeColor.slice(1)} won`;
                            gameResultEl.style.color = resultColor;
                            gameResultEl.style.filter = `drop-shadow(0 0 2.5vh ${resultColor})`;
                            gameOverEl.style.zIndex = '50';
                            gameOverEl.style.opacity = '100';
                        }
                    break;
                }
        pieceEl.style.zIndex = '1';
        movedByTouch = false;
    }

    function movePieceAtBoardTouch(e) {
        addEventListener('touchmove', preventDefault, { passive: false });
        bodyEl.style.overscrollBehavior = 'contain';

        let distancePiece = getDistance(pieceEl.closest('[data-square]'));

        for (let i = 0; i < e.changedTouches.length; i++) {
            if (distanceBoard[0] < e.changedTouches[i].pageX && distanceBoard[0] + piecesMoveEl.clientWidth > e.changedTouches[i].pageX)
                pieceEl.style.left = `${e.changedTouches[i].pageX - distancePiece[0] - pieceEl.offsetWidth / 2}px`;

            if (distanceBoard[1] < e.changedTouches[i].pageY && distanceBoard[1] + piecesMoveEl.clientHeight > e.changedTouches[i].pageY)
                pieceEl.style.top = `${e.changedTouches[i].pageY - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
        }
    }

    let parentClick, xClick, yClick;
    squares.forEach(moveSquare => {
        moveSquare.onclick = function(e) {
            let tempX = e.currentTarget.dataset.square.charCodeAt(0) - 97;
            let tempY = 8 - e.currentTarget.dataset.square[1];
            if (board[tempX][tempY].piece != null && board[tempX][tempY].piece.color === turn) {
                parentClick = e.currentTarget;
                xClick = tempX;
                yClick = tempY;
            } else if ((board[tempX][tempY].piece === null || board[tempX][tempY].piece.color != turn) && parentClick != undefined) {
                let finalParent = e.currentTarget;

                let xToMove = finalParent.dataset.square.charCodeAt(0) - 97;
                let yToMove = 8 - finalParent.dataset.square[1];
                pieceEl = parentClick.querySelector('img');

                movementEnd(xClick, yClick, xToMove, yToMove, finalParent, parentClick);
                parentClick = undefined;
            }
        }
    });

    pieceEl.ondragstart = () => false;

    pieceEl.onmousedown = function(e) {
        pieceEl = e.currentTarget;
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

        pieceEl = e.currentTarget;
        let startCase = movementStart(parent, x, y);
        parent = startCase[0];
        x = startCase[1];
        y = startCase[2];

        movePieceAtBoardTouch(e);
        movedByTouch = true;
    });

    pieceEl.addEventListener('touchmove', movePieceAtBoardTouch);

    pieceEl.addEventListener('touchend', e => {
        removeEventListener('touchmove', preventDefault, { passive: false });
        bodyEl.style.overscrollBehavior = 'auto';

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

pieces.forEach(eventListenersForMove);

let resetEls = document.querySelectorAll('.reset');

resetEls.forEach(resetEl => {
    resetEl.onclick = () => {
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
                [newPiece].forEach(eventListenersForMove);

                squares[i].appendChild(newPiece);
            }
        }
        gameOverEl.style.opacity = '0';
        gameOverEl.style.zIndex = '-100';
    }
});
