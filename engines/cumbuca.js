let bestMove = {
    x: 0,
    y: 0,
    piece: 'queen'
}

function cumbucaEvalMid() {
    let points = 0;
    let p = turn === 'white' ? 1 : -1;

    whitePieces.forEach(wPiece => {
        points += wPiece.score * p / 2;
    });

    blackPieces.forEach(bPiece => {
        points += bPiece.score * p / 2;
    });

    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            if (board[i][j].whiteAttack)
                if (p === 1)
                    points += p - board[i][j].whiteValueAtt / 2000;
                else
                    points += (p - board[i][j].whiteValueAtt / 2000) / 2;
            if (board[i][j].blackAttack)
                if (p === -1)
                    points -= p + board[i][j].blackValueAtt / 2000;
                else
                    points -= (p + board[i][j].blackValueAtt / 2000) / 2;
        }

    

    return points;
}

const xy = {
    x: null,
    y: null
}

function cumbuca() {
    let cumbucaMax = (a, b) => a > b ? a : b;
    let cumbucaMin = (a, b) => a < b ? a : b;

    /** must be even */
    const maxDepth = 4;

    let bestEval = -1000000;
    let bestMove = [];

    function cumbucaMiniMax(color=turn, depth=maxDepth, maximazedPlayer=true, alpha=-999999, beta=999999) {
        if (depth === 0)
            return cumbucaEvalMid();

        let piecesOfColor;
        let opositeColor;
        if (color === 'white') {
            piecesOfColor = whitePieces;
            opositeColor = 'black';
        } else {
            piecesOfColor = blackPieces;
            opositeColor = 'white';
        }

        let minOrMaxEval = maximazedPlayer ? -999999 : 999999;

        for (let piece of piecesOfColor) {
            let moves = piece.moves();
            for (let move of moves) {
                let moveBackup;
                moveBackup = moveAtVBoard([piece.x, piece.y], move);

                let eval = cumbucaMiniMax(opositeColor, depth-1, !maximazedPlayer, alpha, beta);

                undoMoveAtVBoard(moveBackup, piece);

                if (depth === maxDepth && eval > bestEval) {
                    bestEval = eval;
                    bestMove = [[moveBackup.movedPiece.x, moveBackup.movedPiece.y], [move[0], move[1]], piece.piece];
                }

                if (maximazedPlayer) {
                    minOrMaxEval = cumbucaMax(minOrMaxEval, eval);
                    alpha = cumbucaMax(minOrMaxEval, alpha);
                    if (beta <= alpha)
                        return minOrMaxEval;
                } else {
                    minOrMaxEval = cumbucaMin(minOrMaxEval, eval);
                    beta = cumbucaMin(minOrMaxEval, beta);
                    if (beta <= alpha)
                        return minOrMaxEval;
                }
            }
        }

        return minOrMaxEval;
    }

    console.log(cumbucaMiniMax());
    getAttacks();
    resetPieces();
    moveAtBoard(bestMove[0], bestMove[1], bestMove[2], false, true);
}
