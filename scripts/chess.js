// ---------ínicio tabuleiro----------
let turn = 'white';

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
    });
    possiblesMoves = [];
    possiblesMoves.length = 0;
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
let destinationSquare = null;

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

    pieceEl.ondragstart = () => false;

    pieceEl.onmousedown = function(e) {
        removeMoves(movesDrawn);
        let parent, x, y;

        let startCase = movementStart(parent, x, y);
        parent = startCase[0];
        x = startCase[1];
        y = startCase[2];

        function movePieceAtBoard(e) {
            let distancePiece = getDistance(pieceEl.closest('[data-square]'));

            if (distanceBoard[0] < e.pageX && distanceBoard[0] + piecesMoveEl.clientWidth > e.pageX)
                pieceEl.style.left = `${e.pageX - distancePiece[0] - pieceEl.offsetWidth / 2}px`;

            if (distanceBoard[1] < e.pageY && distanceBoard[1] + piecesMoveEl.clientHeight > e.pageY)
                pieceEl.style.top = `${e.pageY - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
        }

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
            
            if (board[x][y].piece.color === turn)
                for (let pieceMove of board[x][y].piece.moves())
                    if (pieceMove[0] === xToMove && pieceMove[1] === yToMove) {
                        removeMoves(movesDrawn);
                        movesDrawn = [];

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

                        break;
                    }
            pieceEl.style.zIndex = '1';
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
    });

    pieceEl.addEventListener('touchmove', e => {
        let distancePiece = getDistance(pieceEl.closest('[data-square]'));

        for (let i = 0; i < e.changedTouches.length; i++) {
            if (distanceBoard[0] < e.changedTouches[i].pageX && distanceBoard[0] + piecesMoveEl.clientWidth > e.changedTouches[i].pageX)
                pieceEl.style.left = `${e.changedTouches[i].pageX - distancePiece[0] - pieceEl.offsetWidth / 2}px`;

            if (distanceBoard[1] < e.changedTouches[i].pageY && distanceBoard[1] + piecesMoveEl.clientHeight > e.changedTouches[i].pageY)
                pieceEl.style.top = `${e.changedTouches[i].pageY - distancePiece[1] - pieceEl.offsetWidth / 2}px`;
        }
    });

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
        
        if (board[x][y].piece.color === turn)
            for (let pieceMove of board[x][y].piece.moves())
                if (pieceMove[0] === xToMove && pieceMove[1] === yToMove) {
                    removeMoves(movesDrawn);
                    movesDrawn = [];

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

                    break;
                }
        pieceEl.style.zIndex = '1';
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

/**
 * esse função vai ser ativa quando alguem clicar em uma peça, se logo em seguida ela clicar em uma opição de movimento a peça move
 * porem se a opição de movimento for capturar outra peça dá erro
 */

pieces.forEach(pieceEl => {
    pieceEl.addEventListener('click', () => {
        removeMoves(movesDrawn);

        let parent = pieceEl.closest('[data-square]');
        let x = parent.dataset.square.charCodeAt(0) - 97;
        let y = 8 - parent.dataset.square[1];

        pieceEl.style.zIndex = '101';
        
        if (board[x][y].piece.color === turn) {
            movesDrawn = board[x][y].piece.moves();
            drawMoves(movesDrawn);
        } else
            movesDrawn = [];

        for(let possibleMove of possiblesMoves) {
            possibleMove.addEventListener('click', e => {

                let finalParent = e.currentTarget;
                let xToMove = finalParent.dataset.square.charCodeAt(0) - 97;
                let yToMove = 8 - finalParent.dataset.square[1];
                
                if (finalParent === null) {
                    pieceEl.style.zIndex = '1';
                    pieceEl.onmouseup = null;
                    return;
                }

/**
 * tá dando esse erro, na linha 378, (linha do for):
 * Uncaught TypeError: Cannot read properties of null (reading 'moves')
 */
                for (let pieceMove of board[x][y].piece.moves()) {
                    if (pieceMove[0] === xToMove && pieceMove[1] === yToMove) {
                        board[xToMove][yToMove].piece = board[x][y].piece;
                        board[xToMove][yToMove].piece.x = xToMove;
                        board[xToMove][yToMove].piece.y = yToMove;
                        if (board[xToMove][yToMove].piece.moved != undefined)
                            board[xToMove][yToMove].piece.moved = true;
                        
                        board[x][y].piece = null;
                        
                        removeMoves(movesDrawn);
                        movesDrawn = [];
                        
                        finalParent.innerHTML = '';
                        finalParent.appendChild(pieceEl);
                        getAttacks();
                        turn = turn === 'white' ? 'black' : 'white';
                        break;
                    }
                }
            })
        }
    })
})