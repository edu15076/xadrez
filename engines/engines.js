let possibePromotions = ['queen', 'knight', 'rook', 'bishop'];

function randEngine() {
    let piecesTurn = turn === 'white' ? whitePieces : blackPieces;
    let moves;
    let unmoveable = [];
    let randNum;
    do {
        do {
            randNum = (Math.floor(Math.random() * 100)) % piecesTurn.length;
        } while (unmoveable.indexOf(randNum) >= 0);
        moves = piecesTurn[randNum].moves();
        unmoveable.push(randNum);
    } while (moves.length === 0);

    let randMovesOfPiece = moves[(Math.floor(Math.random() * 100)) % moves.length];
    let piece = piecesTurn[randNum].piece === 'pawn' && (randMovesOfPiece[1] === 0 || randMovesOfPiece[1] === 7) ? possibePromotions[(Math.floor(Math.random() * 100)) % 4] : piecesTurn[randNum].piece;

    moveAtBoard([piecesTurn[randNum].x, piecesTurn[randNum].y], randMovesOfPiece, piece, false, true);
}

let fnWhite, fnBlack;
let delay;

function flowControl() {
    switch (turn) {
        case 'white':
            if (delay)
                setTimeout(fnWhite, 500);
            else if (pvp) 
                fnWhite();
            else if (!playerCanMove) {
                playerCanMove = true;
                fnWhite();
            } else {
                playerCanMove = false;
                setTimeout(fnWhite, 20);
            }
            break;
        default:
            if (delay)
                setTimeout(fnBlack, 500);
            else if (pvp) 
                fnBlack();
            else if (!playerCanMove) {
                playerCanMove = true;
                fnBlack();
            } else {
                playerCanMove = false;
                setTimeout(fnBlack, 20);
            }
    }
}
