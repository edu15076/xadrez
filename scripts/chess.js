// ---------ínicio tabuleiro----------


let square = {
    aWhite: false,
    aBlack: false,
    piece: null
};

let board = [[],[],[],[],[],[],[],[]];

function originalBoardSettings() {
    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            board[i][j] = Object.create(square);
            if (j === 3 || j === 4)
                board[i][j].aWhite = board[i][j].aBlack = false; 
            else if (j === 5)
                board[i][j].aWhite = true;
            else if (j === 2)
                board[i][j].aBlack = true;
            else if (j === 0) {
                board[i][j].aWhite = false;
                if (i === 0 || i === 7) {
                    board[i][j].aBlack = false;
                    board[i][j].piece = Object.create(rook);
                    board[i][j].piece.x = i;
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else if (i === 1 || i === 6) {
                    board[i][j].aBlack = true;
                    board[i][j].piece = Object.create(knight);
                    board[i][j].piece.x = i;
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else if (i === 2 || i === 5) {
                    board[i][j].aBlack = true;
                    board[i][j].piece = Object.create(bishop);
                    board[i][j].piece.x = i;
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else if (i === 3) {
                    board[i][j].aBlack = true;
                    board[i][j].piece = Object.create(queen);
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                } else {
                    board[i][j].aBlack = true;
                    board[i][j].piece = Object.create(king);
                    board[i][j].piece.y = 0;
                    board[i][j].piece.color = 'black';
                }
            } else if (j === 1) {
                board[i][j].aWhite = false;
                board[i][j].aBlack = true;
                board[i][j].piece = Object.create(pawn);
                board[i][j].piece.x = i;
                board[i][j].piece.y = 1;
                board[i][j].piece.color = 'black';
            } else if (j === 6) {
                board[i][j].aBlack = false;
                board[i][j].aWhite = true;
                board[i][j].piece = Object.create(pawn);
                board[i][j].piece.x = i;
            } else if (j === 7) {
                board[i][j].aBlack = false;
                if (i === 0 || i === 7) {
                    board[i][j].piece = Object.create(rook);
                    board[i][j].piece.x = i;
                } else if (i === 1 || i === 6) {
                    board[i][j].aWhite = true;
                    board[i][j].piece = Object.create(knight);
                    board[i][j].piece.x = i;
                } else if (i === 2 || i === 5) {
                    board[i][j].aWhite = true;
                    board[i][j].piece = Object.create(bishop);
                    board[i][j].piece.x = i;
                } else if (i === 3) {
                    board[i][j].aWhite = true;
                    board[i][j].piece = Object.create(queen);
                } else {
                    board[i][j].aWhite = true;
                    board[i][j].piece = Object.create(king);
                }
            }
        }
}
originalBoardSettings();

// ---------Fim tabuleiro----------
let pieces = document.querySelectorAll('.piece');
let squares = document.querySelectorAll('#pieces-move div');

function drawMoves(moves) {
    for (let move of moves) {
        let canvasEl = document.createElement('canvas');
        let boardEl = document.getElementById('board');
        let side = boardEl.clientWidth / 8;
        
        canvasEl.width = side;
        canvasEl.height = side;
        
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

function removeMoves(moves) {
    moves.forEach(move => {
        let canvas = squares[move[0] - 8 * move[1] + 56].querySelector('canvas');
        squares[move[0] - 8 * move[1] + 56].removeChild(canvas);
    });
}

let finalMove;
let movesDrawn = [];

pieces.forEach(pieceEl => {
    pieceEl.addEventListener('click', () => {
        removeMoves(movesDrawn);

        let parent = pieceEl.closest('[data-square]');
        let x = parent.dataset.square.charCodeAt(0) - 97;
        let y = 8 - parent.dataset.square[1];

        drawMoves(board[x][y].piece.moves());

        movesDrawn = board[x][y].piece.moves();
    });

    pieceEl.addEventListener('dragstart', () => {
        pieceEl.classList.add('grabed');
        
        removeMoves(movesDrawn);

        let parent = pieceEl.closest('[data-square]');
        let x = parent.dataset.square.charCodeAt(0) - 97;
        let y = 8 - parent.dataset.square[1];
        
        drawMoves(board[x][y].piece.moves());

        movesDrawn = board[x][y].piece.moves();
    });
    
    pieceEl.addEventListener('dragend', () => {
        let parent = pieceEl.closest('[data-square]');
        let xPiece = parent.dataset.square.charCodeAt(0) - 97;
        let yPiece = 8 - parent.dataset.square[1];

        let xSquare = finalMove.dataset.square.charCodeAt(0) - 97;
        let ySquare = 8 - finalMove.dataset.square[1];
        
        for (let pieceMove of board[xPiece][yPiece].piece.moves()) {
            if (pieceMove[0] === xSquare && pieceMove[1] === ySquare) {

                board[xSquare][ySquare].piece = board[xPiece][yPiece].piece;
                board[xSquare][ySquare].piece.x = xSquare;
                board[xSquare][ySquare].piece.y = ySquare;
                if (board[xSquare][ySquare].piece.moved != undefined)
                    board[xSquare][ySquare].piece.moved = true;

                board[xPiece][yPiece].piece = null;
                
                removeMoves(movesDrawn);
                movesDrawn = [];
                
                finalMove.innerHTML = '';
                finalMove.appendChild(pieceEl);
                break;
            }
        }

        pieceEl.classList.remove('grabed');
    });
});

squares.forEach(squareEl => {
    squareEl.addEventListener('dragenter', e => {
        finalMove = e.currentTarget;
    });
});
let remove = document.getElementById('rem');

remove.addEventListener('click', () => {
    originalBoardSettings();
    for (let i = 0; i < 64; i++) {
        let x = squares[i].dataset.square.charCodeAt(0) - 97;
        let y = 8 - squares[i].dataset.square[1];
        
        squares[i].innerHTML = '';
        if (board[x][y].piece != null) {
            let newPiece = document.createElement('img');
            newPiece.classList.add('piece');
            newPiece.src = `img/${board[x][y].piece.color}_${board[x][y].piece.piece}.svg`;
            squares[i].appendChild(newPiece);
        }
    }
});
// ---------Inicio movimentos----------

