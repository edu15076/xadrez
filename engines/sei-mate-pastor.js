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
        switch(arrayInAnalize[i].piece.piece) {
            case 'pawn': total+= pawnValue; break;
            case 'bishop': total+= bishopValue; break;
            case 'knight': total+= knightValue; break;
            case 'rook': total+= rookValue; break;
            case 'queen': total+= queenValue; break;
            default: total+= kingValue;
        }
    }

    return total;
}

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

        if (profundidade === 0)
            return getMaterialValue(cor) - getMaterialValue(corOposta);
        
        getAttacks();

        let arrayInAnalize = getAllMoves(cor);
        
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
