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

/**
 * Move a piece at the `board` global variable only.
 * 
 * @param {*} piece A object of the `piece` being moved.
 * @param {*} move An array `[x, y]` of the final position of `piece`.
 * @param {*} doGetAttacks An optional parameter that determines if `getAttacks` should be executed. This should be set to true if you are getting the piece moves by `piece.moves()`.
 * @param {*} pieceName An optional parameter that can be changed in order to promote a pawn.
 * @returns `{piece: piece, movedPiece: movedPiece, lastPiece: lastPiece, lastEnPassant: lastEnPassant, lastCastle: lastCastle}` which is the parameter for `undoMoveAtVBoard`.
 */
function moveAtVBoard(piece, move, doGetAttacks=false, pieceName=null) {
    if (pieceName === null)
        pieceName = piece.piece;

    const somePiece = {
        x: null,
        y: null,
        name: null,
        color: null,
        moved: null
    }

    let lastPiece = null;
    let movedPiece = Object.create(somePiece);
    let movedPieceFinal = Object.create(somePiece);
    let lastEnPassant = enPassant;
    let lastCastle = null;

    movedPiece.x = piece.x;
    movedPiece.y = piece.y;
    movedPiece.name = piece.piece;
    movedPiece.color = piece.color;
    if (piece.moved != undefined)
        movedPiece.moved = piece.moved;

    movedPieceFinal.x = move[0];
    movedPieceFinal.y = move[1];
    movedPieceFinal.name = pieceName;
    movedPieceFinal.color = piece.color;
    movedPieceFinal.moved = true;

    if (piece.piece === 'pawn' && enPassant != null && enPassant[0] === move[0] && enPassant[1] === move[1]) {
        lastPiece = Object.create(somePiece);

        lastPiece.x = move[0];
        lastPiece.y = piece.y;
        lastPiece.name = board[move[0]][piece.y].piece.piece;
        lastPiece.color = board[move[0]][piece.y].piece.color;
        lastPiece.moved = true;

        removePiece(board[move[0]][piece.y].piece);
        board[move[0]][piece.y].piece = null;
        enPassant = null;
    } else if (piece.piece === 'pawn' && Math.abs(move[1]-piece.y) === 2) {
        enPassant = [piece.x, piece.y+board[piece.x][piece.y].piece.moveDirection()];
    } else
        enPassant = null;

    if (piece.piece === 'king' && Math.abs(piece.x-move[0]) === 2) {
        let xRook = piece.x-move[0] > 0 ? 0 : 7;
        let xRookToMove = piece.x-move[0] > 0 ? 3 : 5;
        board[xRookToMove][piece.y].piece = board[xRook][piece.y].piece;
        board[xRookToMove][piece.y].piece.moved = true;
        board[xRookToMove][piece.y].piece.x = xRookToMove;
        board[xRook][piece.y].piece = null;

        lastCastle = {
            x: xRookToMove,
            y: piece.y,
            color: piece.piece,
            xCastled: xRook
        }
    }

    if (board[move[0]][move[1]].piece != null) {
        lastPiece = Object.create(somePiece);

        lastPiece.x = move[0];
        lastPiece.y = move[1];
        lastPiece.name = board[move[0]][move[1]].piece.piece;
        lastPiece.color = board[move[0]][move[1]].piece.color;
        if (board[move[0]][move[1]].piece.moved != undefined)
            lastPiece.moved = board[move[0]][move[1]].piece.moved;

        removePiece(board[move[0]][move[1]].piece);
    }

    if (piece.piece != pieceName) {
        board[move[0]][move[1]].piece = createPiceForBoard(pieceName, move[0], move[1], piece.color, true);
        substitutePiece(board[piece.x][piece.y].piece, board[move[0]][move[1]].piece);
        board[piece.x][piece.y].piece = null;
        piece = board[move[0]][move[1]].piece;
    } else {
        board[piece.x][piece.y].piece = null;
        board[move[0]][move[1]].piece = piece;
        piece.x = board[move[0]][move[1]].piece.x = move[0];
        piece.y = board[move[0]][move[1]].piece.y = move[1];
        if (board[move[0]][move[1]].piece.moved != undefined)
            board[move[0]][move[1]].piece.moved = true;
    }

    piece.piece = pieceName;

    if (doGetAttacks) getAttacks();

    return {piece: piece, movedPiece: movedPiece, movedPieceFinal: movedPieceFinal, lastPiece: lastPiece, lastEnPassant: lastEnPassant, lastCastle: lastCastle};
}

function undoMoveAtVBoard(moveStats) {
    if (moveStats.piece.piece != moveStats.movedPiece.name) {
        board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece = createPiceForBoard(moveStats.movedPiece.name, moveStats.movedPiece.x, moveStats.movedPiece.y, moveStats.movedPiece.color, moveStats.movedPiece.moved);
        substitutePiece(board[moveStats.piece.x][moveStats.piece.y].piece, board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece);
        board[moveStats.piece.x][moveStats.piece.y].piece = null;
        moveStats.piece = board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece;
    } else {
        board[moveStats.piece.x][moveStats.piece.y].piece = null;

        moveStats.piece.x = moveStats.movedPiece.x;
        moveStats.piece.y = moveStats.movedPiece.y;
        if (moveStats.piece.moved != undefined)
            moveStats.piece.moved = moveStats.movedPiece.moved;

        board[moveStats.piece.x][moveStats.piece.y].piece = moveStats.piece;
    }
    
    if (moveStats.lastPiece != null) {
        let lastPiece = createPiceForBoard(moveStats.lastPiece.name, moveStats.lastPiece.x, moveStats.lastPiece.y, moveStats.lastPiece.color, moveStats.lastPiece.moved);
        addPiece(lastPiece);
        board[moveStats.lastPiece.x][moveStats.lastPiece.y].piece = lastPiece;
    }

    if (moveStats.lastCastle != null) {
        board[moveStats.lastCastle.xCastled][moveStats.lastCastle.y].piece = board[moveStats.lastCastle.x][moveStats.lastCastle.y].piece;
        board[moveStats.lastCastle.xCastled][moveStats.lastCastle.y].piece.moved = false;
        board[moveStats.lastCastle.x][moveStats.lastCastle.y].piece = null;
    }

    enPassant = moveStats.lastEnPassant;
}
