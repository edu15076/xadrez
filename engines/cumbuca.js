function cumbucaEvalMid() {
    let points = 0;
    let p = turn.charAt(0) === 'w' ? 1 : -1;

    for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            if (board[i][j].piece != null) {
                points += board[i][j].piece.score * p;
                if (board[i][j].piece.color.charAt(0) === 'w') {
                    if (board[i][j].piece.piece.charAt(0) != 'p')
                        points += board[i][j].piece.notSavingKingMoves().length / (board[i][j].piece.score + 200) * 600 * p;
                } else
                    if (board[i][j].piece.piece.charAt(0) != 'p')
                        points -= board[i][j].piece.notSavingKingMoves().length / (-board[i][j].piece.score + 200) * 600 * p;

                if (board[i][j].whiteAttack)
                    points += p * board[i][j].wAtk / 6;
                if (board[i][j].blackAttack)
                    points -= p * board[i][j].bAtk / 6;
            }
        }

    if (board[whiteKing.x][whiteKing.y].blackAttack)
        points -= p * 2 * board[whiteKing.x][whiteKing.y].bAtk;
    else if (board[blackKing.x][blackKing.y].whiteAttack)
        points += p * 2 * board[blackKing.x][blackKing.y].wAtk;

    whiteKing.attacks().forEach(atk => {
        if (board[atk[0]][atk[1]].blackAttack)
            if (board[atk[0]][atk[1]].bAtk - board[atk[0]][atk[1]].wAtk > 0)
                points -= p * (board[atk[0]][atk[1]].bAtk - board[atk[0]][atk[1]].wAtk);

        if (board[atk[0]][atk[1]].piece != null && (board[atk[0]][atk[1]].piece.color.charAt(0) === 'w' || board[atk[0]][atk[1]].piece.piece.charAt(0) === 'p'))
            points += p;
    });

    blackKing.attacks().forEach(atk => {
        if (board[atk[0]][atk[1]].whiteAttack)
            if (board[atk[0]][atk[1]].wAtk - board[atk[0]][atk[1]].bAtk > 0)
                points += p * (board[atk[0]][atk[1]].wAtk - board[atk[0]][atk[1]].bAtk);

        if (board[atk[0]][atk[1]].piece != null && (board[atk[0]][atk[1]].piece.color.charAt(0) === 'b' || board[atk[0]][atk[1]].piece.piece.charAt(0) === 'p'))
            points -= p;
    });

    return points;
}

function cumbuca() {
    let cumbucaMax = (a, b) => a > b ? a : b;
    let cumbucaMin = (a, b) => a < b ? a : b;

    /** must be even if low */
    const maxDepth = 4;

    let bestEval = -1000000;
    let bestMove = [];

    function cumbucaMiniMax(color=turn, depth=maxDepth, maximazedPlayer=true, alpha=-999999, beta=999999) {
        if (depth === 0)
            return cumbucaEvalMid();

        let piecesOfColor;
        let opositeColor;
        let kingColorAtk;

        switch (color) {
            case 'white':
                piecesOfColor = whitePieces;
                opositeColor = 'black'; 
                kingColorAtk = board[whiteKing.x][whiteKing.y].blackAttack;
                break;
            default:
                piecesOfColor = blackPieces;
                opositeColor = 'white';
                kingColorAtk = board[blackKing.x][blackKing.y].whiteAttack;
        }

        let minOrMaxEval = maximazedPlayer ? -999999 : 999999;

        getAttacks();

        let moves = [];
        for (let piece of piecesOfColor) {
            let a = 0;
            let b = 0;
            for (let move of piece.moves()) {
                if (board[move[0]][move[1]].piece != null) {
                    if (Math.abs(board[piece.x][piece.y].piece.score) < Math.abs(board[move[0]][move[1]].piece.score)) {
                        moves.unshift([[piece.x, piece.y], move]);
                        a++;
                    } else if (board[move[0]][move[1]].piece[`${color.charAt(0)}Atk`] > board[move[0]][move[1]].piece[`${opositeColor.charAt(0)}Atk`]) {
                        moves.splice(a, 0, [[piece.x, piece.y], move]);
                        b++;
                    } else
                        moves.splice(a+b, 0, [[piece.x, piece.y], move]);
                } else if (board[piece.x][piece.y].piece[`${color.charAt(0)}Atk`] - board[piece.x][piece.y].piece[`${opositeColor.charAt(0)}Atk`] < 0) {
                    moves.splice(a, 0, [[piece.x, piece.y], move]);
                    b++;
                } else
                    moves.push([[piece.x, piece.y], move]);
            }
        }

        if (moves.length === 0)
            if (kingColorAtk)
                return minOrMaxEval;
            else
                return 0;

        for (let move of moves) {
            let moveBackup;
            let pieceName = board[move[0][0]][move[0][1]].piece.piece;
            if ((move[1][1] === 7 || move[1][1] === 0) && pieceName === 'pawn') {
                moveBackup = moveAtVBoard(move[0], move[1], 'queen');
                pieceName = 'queen';
            } else
                moveBackup = moveAtVBoard(move[0], move[1]);

            let eval = cumbucaMiniMax(opositeColor, depth-1, !maximazedPlayer, alpha, beta);

            undoMoveAtVBoard(moveBackup);

            if (depth === maxDepth && eval > bestEval) {
                bestEval = eval;
                bestMove = [move[0], move[1], pieceName];
            }

            if (maximazedPlayer) {
                minOrMaxEval = cumbucaMax(minOrMaxEval, eval);
                alpha = cumbucaMax(minOrMaxEval, alpha);
            } else {
                minOrMaxEval = cumbucaMin(minOrMaxEval, eval);
                beta = cumbucaMin(minOrMaxEval, beta);
            }

            if (beta <= alpha)
                break;
        }

        return minOrMaxEval;
    }

    cumbucaMiniMax();
    moveAtBoard(bestMove[0], bestMove[1], bestMove[2], false, true);
}
