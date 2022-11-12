/** The current piece color to move. */
let turn = 'white';

/**
 * If en passant is possible it contains the possition, an `Array`, where en passant is possible.
 * 
 * `null` if en passant is not possible.
*/
let enPassant = null;

/** If there is a game on going */
let gameOn = false;

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

let whitePieces = [];
let blackPieces = [];

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

                switch (board[i][j].piece.color) {
                    case 'white': whitePieces.push(board[i][j].piece); break;
                    default: blackPieces.push(board[i][j].piece);
                }
            }
        }
    whiteKing = board[4][7].piece;
    blackKing = board[4][0].piece;
    getAttacks();
}

function createPiceForBoard(pieceName, x, y, color, moved) {
    let newPiece;
    switch (pieceName) {
        case 'pawn':
            newPiece = Object.create(pawn);
            newPiece.moved = moved;
            break;
        case 'knight':
            newPiece = Object.create(knight);
            break;
        case 'bishop':
            newPiece = Object.create(bishop);
            break;
        case 'rook':
            newPiece = Object.create(rook);
            newPiece.moved = moved;
            break;
        case 'queen':
            newPiece = Object.create(queen);
            break;
        default:
            newPiece = Object.create(king);
            newPiece.moved = moved;
    }
    newPiece.x = x;
    newPiece.y = y;
    newPiece.color = color;
    newPiece.piece = pieceName;

    return newPiece;
}

function removePiece(piece) {
    let index;
    let color = piece.color;
    switch (color) {
        case 'white':
            index = whitePieces.indexOf(piece);
            whitePieces.splice(index, 1);
            break;
        default:
            index = blackPieces.indexOf(piece);
            blackPieces.splice(index, 1);
    }
}

function addPiece(piece) {
    switch (piece.color) {
        case 'white':
            whitePieces.push(piece);
            break;
        default:
            blackPieces.push(piece);
    }
}

function substitutePiece(piece, newPiece) {
    let color = piece.color;
    switch (color) {
        case 'white':
            whitePieces.splice(whitePieces.indexOf(piece), 1);
            whitePieces.push(newPiece);
            break;
        default:
            blackPieces.splice(blackPieces.indexOf(piece), 1);
            blackPieces.push(newPiece);
    }
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
        
        canvasEl.width = 300;
        canvasEl.height = 300;

        canvasEl.style.width = `${side}px`;
        canvasEl.style.height = `${side}px`;
        
        let ctx = canvasEl.getContext('2d');
        let circle = new Path2D();
        ctx.fillStyle = '#2e2e2e5a';
        
        if (squares[move[0] - 8 * move[1] + 56].querySelector(':first-child') === null) {
            circle.arc(150, 150, 60, 0, 2 * Math.PI);
            ctx.fill(circle);
        } else {
            circle.arc(150, 150, 150, 0, 2 * Math.PI, true);
            circle.arc(150, 150, 120, 0, 2 * Math.PI, false);
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
    if (moves.length === 0) return;
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

    whitePieces.forEach(whitePiece => {
        let attacks = whitePiece.attacks();
        attacks.forEach(attack => {
            board[attack[0]][attack[1]]['whiteAttack'] = true;
        });
    });

    blackPieces.forEach(blackPiece => {
        let attacks = blackPiece.attacks();
        attacks.forEach(attack => {
            board[attack[0]][attack[1]]['blackAttack'] = true;
        });
    });
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
    let opositeColor = turn === 'white' ? 'black' : 'white';
    let colorPieces = turn === 'white' ? blackPieces : whitePieces;
    board[kingX][kingY][`${opositeColor}Attack`] = false;

    
    for (let colorPiece of colorPieces) {
        let attacks = colorPiece.attacks();
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
    let movePieces = turn === 'white' ? whitePieces : blackPieces;
    movePieces.forEach(possibleMove => {
        if (possibleMove.moves().length != 0)
            return false;
    });

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

function roundToHalf(n) {
    n = Math.abs(n)
    if (n % 1 < .25)
        return Math.floor(n);
    if (n % 1 >= .75)
        return Math.ceil(n);
    return n - n % 1 + .5;
}

addEventListener('resize', () => {
    removeMoves(movesDrawn);
    drawMoves(movesDrawn);
    distanceBoard = getDistance(piecesMoveEl);
});

let gameOverEl = document.getElementById('game-over');

function preventDefault(e) { e.preventDefault(); }

let lastParent;
let lastParentToMove;
let lastFinalParent;

/**
 * @return The board x, y cordinates to the `squares` cordinates.
 */
 function boardToSquares(x, y) {
    return x - 8 * y + 56;
}

function finalStepAtBoard(x, y, xToMove, yToMove) {
    removeMoves(movesDrawn);
    movesDrawn = [];
    
    let colorKing = turn === 'white' ? whiteKing : blackKing;
    let opositeColor = turn === 'white' ? 'black' : 'white';
    if (turn, colorKing, board[colorKing.x][colorKing.y].piece.moves().length === 0) {
        if (board[colorKing.x][colorKing.y][`${opositeColor}Attack`] && getMate()) {
            let gameResultEl = gameOverEl.querySelector('h2');
            let resultColor = opositeColor === piecesUser ? 'greenyellow' : 'red';

            gameOverEl.querySelector('p').innerHTML = 'by checkmate';
            gameResultEl.innerHTML = `${opositeColor.charAt(0).toUpperCase()+opositeColor.slice(1)} won`;
            gameResultEl.style.color = resultColor;
            gameResultEl.style.filter = `drop-shadow(0 0 2.5vh ${resultColor})`;
            gameOverEl.style.zIndex = '50';
            gameOverEl.style.opacity = '100';
        }
    }

    if (gameOn) {
        if (lastParentToMove != undefined) lastParentToMove.style.backgroundColor = 'transparent';
        if (lastFinalParent != undefined) lastFinalParent.style.backgroundColor = 'transparent';
    } else
        gameOn = true;
    if (lastParent != undefined) lastParent.style.backgroundColor = 'transparent';
    lastParentToMove = squares[boardToSquares(x, y)];
    lastFinalParent = squares[boardToSquares(xToMove, yToMove)];
    lastFinalParent.style.backgroundColor = 'rgba(255, 217, 91, .8)';
    lastParentToMove.style.backgroundColor = 'rgba(255, 217, 91, .8)';
    
    movedByClick = false;
}

/**
 * Remove a pice of its `starting position` and add a `piece` on the `final position` with the atributes of the parameter `piece`.
 * 
 * All special moves (castel, promotion, en passant, etc...) are analized by the function.
 * 
 * @param {*} startingPosition An [x, y] array with the starting position of a piece
 * @param {*} finalPosition An [x, y] array with the final position of a piece
 * @param {*} piece The name of a pice
 */
function moveAtBoard(startingPosition, finalPosition, piece) {
    if (piece === 'pawn' && enPassant != null && enPassant[0] === finalPosition[0] && enPassant[1] === finalPosition[1]) {
        removePiece(board[finalPosition[0]][startingPosition[1]].piece);
        board[finalPosition[0]][startingPosition[1]].piece = null;
        squares[boardToSquares(finalPosition[0], startingPosition[1])].innerHTML = '';
        enPassant = null;
    } else if (piece === 'pawn' && Math.abs(finalPosition[1]-startingPosition[1]) === 2) {
        enPassant = [startingPosition[0], startingPosition[1]+board[startingPosition[0]][startingPosition[1]].piece.moveDirection()];
    } else
        enPassant = null;

    if (piece === 'king' && Math.abs(startingPosition[0]-finalPosition[0]) === 2) {
        let xRook = startingPosition[0]-finalPosition[0] > 0 ? 0 : 7;
        let xRookToMove = startingPosition[0]-finalPosition[0] > 0 ? 3 : 5;
        board[xRookToMove][startingPosition[1]].piece = board[startingPosition[0]+3][startingPosition[1]].piece;
        board[xRookToMove][startingPosition[1]].piece.moved = true;
        board[xRookToMove][startingPosition[1]].piece.x = xRookToMove;
        board[xRook][startingPosition[1]].piece = null;
        
        squares[boardToSquares(xRookToMove, startingPosition[1])].appendChild(squares[boardToSquares(xRook, startingPosition[1])].querySelector('img'));
        squares[boardToSquares(xRook, startingPosition[1])].innerHTML = '';
        [squares[boardToSquares(xRookToMove, startingPosition[1])].querySelector('img')].forEach(eventListenersForMove);
    }

    if (board[finalPosition[0]][finalPosition[1]].piece != null)
        removePiece(board[finalPosition[0]][finalPosition[1]].piece);

    if (board[startingPosition[0]][startingPosition[1]].piece.piece != piece) {
        board[finalPosition[0]][finalPosition[1]].piece = createPiceForBoard(piece, finalPosition[0], finalPosition[1], turn, true);
        substitutePiece(board[startingPosition[0]][startingPosition[1]].piece, board[finalPosition[0]][finalPosition[1]].piece);
    } else {
        board[finalPosition[0]][finalPosition[1]].piece = board[startingPosition[0]][startingPosition[1]].piece;
        board[finalPosition[0]][finalPosition[1]].piece.x = finalPosition[0];
        board[finalPosition[0]][finalPosition[1]].piece.y = finalPosition[1];
        if (board[finalPosition[0]][finalPosition[1]].piece.moved != undefined)
            board[finalPosition[0]][finalPosition[1]].piece.moved = true;
    }

    board[startingPosition[0]][startingPosition[1]].piece = null;

    let newPiece = document.createElement('img');
    newPiece.classList.add('piece');
    newPiece.src = `img/${board[finalPosition[0]][finalPosition[1]].piece.color}_${piece}.svg`;
    newPiece.draggable = false;
    [newPiece].forEach(eventListenersForMove);

    squares[boardToSquares(startingPosition[0], startingPosition[1])].innerHTML = '';
    squares[boardToSquares(finalPosition[0], finalPosition[1])].innerHTML = '';
    squares[boardToSquares(finalPosition[0], finalPosition[1])].appendChild(newPiece);

    getAttacks();
    turn = turn === 'white' ? 'black' : 'white';

    finalStepAtBoard(startingPosition[0], startingPosition[1], finalPosition[0], finalPosition[1]);
}

/** Let a `piece` move. */
function eventListenersForMove(pieceEl) {
    let movedByClick = false;

    function promotePawn(x, y, xToMove, yToMove) {
        let pawnColor = board[x][y].piece.color;
        let promotionEl = document.getElementById(`${pawnColor}-promotion`);
        let promotionPieceEl = promotionEl.querySelectorAll('img');
        let parent = squares[boardToSquares(x, y)];
        let finalParent = squares[boardToSquares(xToMove, yToMove)];

        function positionPromotionDiv() {
            if (pawnColor != piecesUser) {
                promotionEl.style.flexDirection = 'column-reverse';
                promotionEl.style.top = `${piecesMoveEl.clientHeight / 2 + getDistance(piecesMoveEl)[1]}px`;
            } else {
                promotionEl.style.flexDirection = 'column';
                promotionEl.style.top = `${getDistance(piecesMoveEl)[1] - 0.5}px`;
            }

            if (piecesUser === 'black')
                promotionEl.style.left = `${(7 - xToMove) * piecesMoveEl.clientHeight / 8 + getDistance(piecesMoveEl)[0]}px`;
            else
                promotionEl.style.left = `${xToMove * piecesMoveEl.clientHeight / 8 + getDistance(piecesMoveEl)[0]}px`;
        }
        positionPromotionDiv();

        promotionEl.style.zIndex = '101';
        promotionEl.style.opacity = '100';

        let parentS = parent.querySelector('img');
        let finalParentS = finalParent.querySelector('img');
        parent.innerHTML = '';
        finalParent.innerHTML = '';

        addEventListener('resize', () => { positionPromotionDiv(); });

        function undoPromotion(e) {
            if (e.target.closest('section') != promotionEl) {
                promotionEl.style.opacity = '0';
                promotionEl.style.zIndex = '-100';

                parent.appendChild(parentS);
                if (finalParentS != null) finalParent.appendChild(finalParentS);
                lastFinalParent.style.backgroundColor = 'transparent';
                lastParentToMove.style.backgroundColor = 'transparent';
                lastParent = lastParentToMove = lastFinalParent = undefined;
            }
            bodyEl.onclick = null;
        }
        bodyEl.onclick = !movedByClick ? undoPromotion : () => { bodyEl.onclick = undoPromotion; };
        
        promotionPieceEl.forEach(pieceToSelect => {
            pieceToSelect.onclick = () => {
                if (board[xToMove][yToMove].piece != null)
                    removePiece(board[xToMove][yToMove].piece);

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

                substitutePiece(board[x][y].piece, board[xToMove][yToMove].piece);

                board[x][y].piece = null;
                
                let newPiece = document.createElement('img');
                newPiece.src = pieceToSelect.src;
                newPiece.classList.add('piece');
                newPiece.draggable = false;
                [newPiece].forEach(eventListenersForMove);

                finalParent.appendChild(newPiece);
                getAttacks();
                turn = turn === 'white' ? 'black' : 'white';
                promotionEl.style.opacity = '0';
                promotionEl.style.zIndex = '-100';
                pieceToSelect.onclick = null;

                removeMoves(movesDrawn);
            }
        });
        finalStepAtBoard(x, y, xToMove, yToMove);
    }

    function movementStart(parent, x, y) {
        bodyEl.style.overflow = 'hidden';

        parent = pieceEl.closest('[data-square]');
        x = parent.dataset.square.charCodeAt(0) - 97;
        y = 8 - parent.dataset.square[1];
        pieceEl.style.zIndex = '101';
        
        if (board[x][y].piece.color === turn) {
            if (lastParent != undefined) lastParent.style.backgroundColor = 'transparent';
            parent.style.backgroundColor = 'rgba(255, 217, 91, .8)';
            lastParent = parent;
            if (lastParentToMove != undefined) lastParentToMove.style.backgroundColor = 'rgba(255, 217, 91, .8)';

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
        else if (e.pageX <= distanceBoard[0])
            pieceEl.style.left = `${distanceBoard[0] - distancePiece[0] - pieceEl.offsetWidth / 2}px`;
        else
            pieceEl.style.left = `${distanceBoard[0] + piecesMoveEl.clientWidth - distancePiece[0] - pieceEl.offsetWidth / 2}px`;

        if (distanceBoard[1] < e.pageY && distanceBoard[1] + piecesMoveEl.clientHeight > e.pageY)
            pieceEl.style.top = `${e.pageY - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
        else if (e.pageY <= distanceBoard[1])
            pieceEl.style.top = `${distanceBoard[1] - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
        else 
            pieceEl.style.top = `${distanceBoard[1] + piecesMoveEl.clientHeight - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
    }

    function movementEnd(x, y, xToMove, yToMove) {
        if (board[x][y].piece != null && board[x][y].piece.color === turn)
            for (let pieceMove of board[x][y].piece.moves())
                if (pieceMove[0] === xToMove && pieceMove[1] === yToMove) {
                    if (board[x][y].piece.piece === 'pawn' && (yToMove === 0 || yToMove === 7))
                        promotePawn(x, y, xToMove, yToMove);
                    else
                        moveAtBoard([x, y], [xToMove, yToMove], board[x][y].piece.piece);
                    if (pieceEl != undefined)
                        pieceEl.style.zIndex = '1';
                    return true;
                } else if (movedByClick && x != xToMove && y != yToMove) {
                    removeMoves(movesDrawn);
                    movesDrawn = [];
                }
        if (pieceEl != undefined)
                pieceEl.style.zIndex = '1';
        movedByClick = false;
        return false;
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

    function moveByClick(e) {
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

            movedByClick = true;
            if (!movementEnd(xClick, yClick, xToMove, yToMove) && lastParent != undefined) {
                lastParent.style.backgroundColor = 'transparent';
                removeMoves(movesDrawn);
            }
            parentClick = undefined;
        }
    }

    squares.forEach(moveSquare => {
        moveSquare.onclick = e => moveByClick(e);
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

        if (lastParent != undefined && board[x][y].piece.color != turn) {
            lastParent.style.backgroundColor = 'transparent';
            removeMoves(movesDrawn);
            movesDrawn = [];
        }

        bodyEl.addEventListener('mousemove', movePieceAtBoard);

        bodyEl.onmouseup = function(e) {
            bodyEl.removeEventListener('mousemove', movePieceAtBoard);
            bodyEl.style.overflow = 'auto';

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
            
            movementEnd(x, y, xToMove, yToMove);
            bodyEl.onmouseup = null;
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

        if (lastParent != undefined && board[x][y].piece.color != turn) {
            lastParent.style.backgroundColor = 'transparent';
            removeMoves(movesDrawn);
            movesDrawn = [];
        }
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
        
        movementEnd(x, y, xToMove, yToMove);

        if (board[x][y].piece != null && board[x][y].piece.color === turn) {
            parentClick = parent;
            xClick = x;
            yClick = y;

            squares.forEach(moveSquare => {
                moveSquare.onclick = e => moveByClick(e);
            });
        }
    });
}

pieces.forEach(eventListenersForMove);

let resetEls = document.querySelectorAll('.reset');

resetEls.forEach(resetEl => {
    resetEl.onclick = () => {
        whitePieces = [];
        blackPieces = [];
        originalBoardSettings();
        turn = 'white';
        
        for (let i = 0; i < 64; i++) {
            squares[i].style.backgroundColor = 'transparent';
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
        gameOn = false;
        lastParent = lastParentToMove = lastFinalParent = undefined;
    }
});
