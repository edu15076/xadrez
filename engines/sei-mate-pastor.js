
const pawnValue = 10;
const bishopValue = 30;
const knightValue = 30;
const rookValue = 50;
const queenValue = 90;
const kingValue = 1000;

let engineColor = 'black';

function getMaterialValue(cor) {
    let arrayInAnalize = (cor == 'white') ? whitePieces : blackPieces;
    let total = 0;
    
    for (let i = 0; i < arrayInAnalize.length; i++) {
        switch(arrayInAnalize[i].piece) {
            case 'pawn': total+= pawnValue; break;
            case 'bishop': total+= bishopValue; break;
            case 'knight': total+= knightValue; break;
            case 'rook': total+= rookValue; break;
            case 'queen': total+= queenValue; break;
            default: total+= kingValue;
        }
    }
    
    if (cor == 'black')
        total*= -1;

    return total;
}

function getAllMoves() {
    let moves = [[]];
    let movesFromThisPiece = [[]];
    let moveBeingAnalized = [];
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].piece != null && board[i][j].piece.color == engineColor) {
                movesFromThisPiece = board[i][j].piece.moves();
                for (let k = 0; k < movesFromThisPiece.length; k++) {
                    moveBeingAnalized = movesFromThisPiece[k];
                    moves.push([j*8 + i, moveBeingAnalized[1]*8 + moveBeingAnalized[0]]);
                }
            }
        }
    }

    return moves;
}

function engineMove(profundidade) {
    if (profundidade == 0)
        return 1;
    
    let bestMaterial = 2000;

    let arrayBeingAnalized = getAllMoves();
    let pieceInMovement = [];
    let pieceCaptured = [];
    let moveBeingAnalized = [];

    let moveToReturn = [];

    for (let i = 0; i < arrayBeingAnalized.length; i++) {
        moveBeingAnalized = arrayBeingAnalized[i];
        
        if (moveBeingAnalized.length != 0) {
            pieceInMovement = board[moveBeingAnalized[0] % 8][Math.floor(moveBeingAnalized[0] / 8)].piece;
            pieceCaptured = board[moveBeingAnalized[1] % 8][Math.floor(moveBeingAnalized[1] / 8)].piece;

            board[moveBeingAnalized[0] % 8][Math.floor(moveBeingAnalized[0] / 8)].piece = null;
            board[moveBeingAnalized[1] % 8][Math.floor(moveBeingAnalized[1] / 8)].piece = pieceInMovement;

            if (pieceCaptured != null)
                removePiece(pieceCaptured);
            profundidade--;
            engineMove(profundidade);

            let totalMaterialAfterMove = getMaterialValue('white') - getMaterialValue('black');

            if (totalMaterialAfterMove < bestMaterial) {
                bestMaterial = totalMaterialAfterMove;
                moveToReturn = arrayBeingAnalized[i];
            }

            board[moveBeingAnalized[0] % 8][Math.floor(moveBeingAnalized[0] / 8)].piece = pieceInMovement;
            board[moveBeingAnalized[1] % 8][Math.floor(moveBeingAnalized[1] / 8)].piece = pieceCaptured;
        }
    }

    console.log(moveToReturn);
}
