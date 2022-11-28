const pawnValue = 10;
const bishopValue = 30;
const knightValue = 30;
const rookValue = 50;
const queenValue = 90;
const kingValue = 1000;

let engineColor = 'black';

function endGames(cor) {
    let oppositeColor = cor === 'white' ? blackCount : whiteCount;
    let arrayInAnalize = cor === 'white' ? whitePieces : blackPieces;
    let oppositeArray = cor === 'white' ? blackPieces : whitePieces;
    let xKing;
    let yKing;


    for (let i = 0; i < oppositeArray.length; i++) {
        if (oppositeArray[i].piece == 'king') {
            xKing = oppositeArray.x;
            yKing = oppositeArray.y;
            break;
        }
    }

    if (oppositeColor == 1)
        for (let i = 0; i < arrayInAnalize.length; i++) {
            let rowDistanceKing = arrayInAnalize[i].x - xKing;
            let columnDistanceKing = arrayInAnalize[i].y - yKing;
            let valueOfDistance =  20 - Math.abs(rowDistanceKing) - Math.abs(columnDistanceKing);
            arrayInAnalize[i].extra = valueOfDistance;
        }
}

function calculateExtras(cor) {
    let arrayInAnalize = cor === 'white' ? whitePieces : blackPieces;
    let oppositeCount = cor === 'white' ? blackCount : whiteCount;

    endGames(cor);

    for (let i = 0; i < arrayInAnalize.length; i++) {
        if (arrayInAnalize[i].piece == 'pawn'
        && ((arrayInAnalize[i].x == 5 && (arrayInAnalize[i].y == 3 || arrayInAnalize[i].y == 4))
        || (arrayInAnalize[i].x == 4 && (arrayInAnalize[i].y == 3 || arrayInAnalize[i].y == 4))))
            arrayInAnalize[i].extra = 20;
        else if (arrayInAnalize[i].piece == 'knight'
        && (arrayInAnalize[i].y >= 3 && arrayInAnalize[i].y <= 4 && arrayInAnalize[i].x != 0 && arrayInAnalize[i].x != 7))
            arrayInAnalize[i].extra = 16;
        else if (arrayInAnalize[i].piece == 'bishop'
        && (arrayInAnalize[i].y != 0 && arrayInAnalize[i].x != 0 && arrayInAnalize[i].x != 7))
            arrayInAnalize[i].extra = 16;
        else if (arrayInAnalize[i].piece == 'pawn' && oppositeCount <= 8)
            arrayInAnalize[i].extra = 60;
        else if (arrayInAnalize[i].piece == 'pawn' && arrayInAnalize[i].y == 7)
            arrayInAnalize[i].extra = 900;
        else
            arrayInAnalize[i].extra = 0;
    }
}

function getMaterialValue(cor) {
    let arrayInAnalize = (cor == 'white') ? whitePieces : blackPieces;
    let total = 0;

    calculateExtras(cor)
    
    for (let i = 0; i < arrayInAnalize.length; i++) {
        total+= arrayInAnalize[i].score;
        total+= arrayInAnalize[i].extra;
    }

    return total;
}

getMaterialValue('white');

function getAllMoves(cor) {
    let moves = [];
    let movesFromThisPiece = [];
    let moveBeingAnalized = [];
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].piece != null && board[i][j].piece.color == cor) {
                movesFromThisPiece = board[i][j].piece.moves();
                for (let k = 0; k < movesFromThisPiece.length; k++) {
                    moveBeingAnalized = movesFromThisPiece[k];
                    moves.push([[i, j], [moveBeingAnalized[0], moveBeingAnalized[1]]]);
                }
            }
        }
    }

    return moves;
}

function seiPastor (profundidadeFora, corFora) {
    let bestMove = [];
    let bestEval = -Infinity;
    let profundidadeMax = 4;
    
    function miniMax(profundidade=profundidadeFora, cor=corFora, alpha=-999999, beta=999999) {
        let corOposta = cor === 'white' ? 'black' : 'white';
        let piecesArray = cor === 'white' ? whitePieces : blackPieces;

        if (profundidade === 0)
            return getMaterialValue(cor) - getMaterialValue(corOposta);
        
        getAttacks();

        let arrayInAnalize = getAllMoves(cor);

        for (let i = 0; i < piecesArray.length; i++)
            if (piecesArray.piece == 'king') {
                if (arrayInAnalize.length == 0) {
                    let verifier = getCheck(piecesArray.x, piecesArray.y, turn);
                    
                    if (verifier == true)
                        return -Infinity;
                    return 0;
                }
                break;
            }
        
        if (cor === turn) {
            let maxEvaluation = -999999;
            
            for (let teste of arrayInAnalize) {
                let bkp;
                let name = board[teste[0][0]][teste[0][1]].piece.piece;
                if ((teste[1][1] === 7 || teste[1][1] === 0) && name === 'pawn') {
                    bkp = moveAtVBoard(teste[0], teste[1], 'queen');
                    name = 'queen';
                } else
                    bkp = moveAtVBoard(teste[0], teste[1]);
                                    
                let evaluation = miniMax(profundidade-1, corOposta, alpha, beta);

                undoMoveAtVBoard(bkp);

                if (profundidade === profundidadeMax && evaluation > bestEval) {
                    bestEval = evaluation;
                    bestMove = [teste[0], teste[1], name];
                }

                maxEvaluation = maxEvaluation > evaluation ? maxEvaluation : evaluation;
                alpha = alpha > maxEvaluation ? alpha : maxEvaluation;
                if (beta <= alpha)
                    break;

            }
            return maxEvaluation;
        } 
        else {
            let minEvaluation = 999999;

            for (let teste of arrayInAnalize) {
                let bkp;
                let name = board[teste[0][0]][teste[0][1]].piece.piece;
                if ((teste[1][1] === 7 || teste[1][1] === 0) && name === 'pawn') {
                    board[teste[0][0]][teste[0][1]].piece.extra = 900;
                    bkp = moveAtVBoard(teste[0], teste[1], 'queen');
                    name = 'queen';
                } else
                    bkp = moveAtVBoard(teste[0], teste[1]);

                let evaluation = miniMax(profundidade-1, corOposta, alpha, beta);

                undoMoveAtVBoard(bkp);

                minEvaluation = minEvaluation < evaluation ? minEvaluation : evaluation;
                beta = beta < minEvaluation ? beta : minEvaluation;
                if (beta <= alpha)
                    break;
            }
            return minEvaluation;
        }
    }

    miniMax();

    return bestMove;
}

function engineMove(profundidade=4, cor=turn) {
    let moveToReturn = seiPastor(profundidade, cor);

    moveAtBoard(moveToReturn[0], moveToReturn[1], moveToReturn[2], false, true);
}
