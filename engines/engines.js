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

/**
 * Control the turn of each player.
 */
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
                setTimeout(fnWhite, 100);
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
                setTimeout(fnBlack, 100);
            }
    }
}

/**
 * Move a piece at the `board` global variable only.
 * 
 * @param {*} pos An array `[x, y]` of the initial position of a `piece`.
 * @param {*} move An array `[x, y]` of the final position of a `piece`.
 * @param {*} pieceName An optional parameter that can be changed in order to promote a pawn.
 * @returns `{movedPiece: movedPiece, lastPiece: lastPiece, lastEnPassant: lastEnPassant, lastCastle: lastCastle}` which is the first parameter for `undoMoveAtVBoard`.
 */
function moveAtVBoard(pos, move, pieceName=null) {
    if (pieceName === null)
        pieceName = board[pos[0]][pos[1]].piece.piece;

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

    movedPiece.x = pos[0];
    movedPiece.y = pos[1];
    movedPiece.name =board[pos[0]][pos[1]].piece.piece;
    movedPiece.color =board[pos[0]][pos[1]].piece.color;
    if (board[pos[0]][pos[1]].piece.moved != undefined)
        movedPiece.moved = board[pos[0]][pos[1]].piece.moved;

    movedPieceFinal.x = move[0];
    movedPieceFinal.y = move[1];
    movedPieceFinal.name = pieceName;
    movedPieceFinal.color = board[pos[0]][pos[1]].piece.color;
    movedPieceFinal.moved = true;

    if (board[pos[0]][pos[1]].piece.piece === 'pawn' && enPassant != null && enPassant[0] === move[0] && enPassant[1] === move[1]) {
        lastPiece = Object.create(somePiece);

        lastPiece.x = move[0];
        lastPiece.y = pos[1];
        lastPiece.name = board[move[0]][pos[1]].piece.piece;
        lastPiece.color = board[move[0]][pos[1]].piece.color;
        lastPiece.moved = true;

        removePiece(board[move[0]][pos[1]].piece);
        board[move[0]][pos[1]].piece = null;
        enPassant = null;
    } else if (board[pos[0]][pos[1]].piece.piece === 'pawn' && Math.abs(move[1]-pos[1]) === 2) {
        enPassant = [pos[0], pos[1]+board[pos[0]][pos[1]].piece.moveDirection()];
    } else
        enPassant = null;

    if (board[pos[0]][pos[1]].piece.piece === 'king' && Math.abs(pos[0]-move[0]) === 2) {
        let xRook = pos[0]-move[0] > 0 ? 0 : 7;
        let xRookToMove = pos[0]-move[0] > 0 ? 3 : 5;
        board[xRookToMove][pos[1]].piece = board[xRook][pos[1]].piece;
        board[xRookToMove][pos[1]].piece.moved = true;
        board[xRookToMove][pos[1]].piece.x = xRookToMove;
        substitutePiece(board[xRook][pos[1]].piece, board[xRookToMove][pos[1]].piece);
        board[xRook][pos[1]].piece = null;

        lastCastle = {
            x: xRookToMove,
            y: pos[1],
            color: board[pos[0]][pos[1]].piece.color,
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

    if (board[pos[0]][pos[1]].piece.piece != pieceName) {
        board[move[0]][move[1]].piece = createPiceForBoard(pieceName, move[0], move[1], board[pos[0]][pos[1]].piece.color, true);
        substitutePiece(board[pos[0]][pos[1]].piece, board[move[0]][move[1]].piece);
        board[pos[0]][pos[1]].piece = null;
    } else {
        removePiece(board[pos[0]][pos[1]].piece);
        board[move[0]][move[1]].piece = board[pos[0]][pos[1]].piece;
        board[move[0]][move[1]].piece.x = move[0];
        board[move[0]][move[1]].piece.y = move[1];
        if (board[move[0]][move[1]].piece.moved != undefined)
            board[move[0]][move[1]].piece.moved = true;
        board[pos[0]][pos[1]].piece = null;
        addPiece(board[move[0]][move[1]].piece);
    }

    getAttacks();

    return {
            movedPiece: movedPiece,
            movedPieceFinal: movedPieceFinal,
            lastPiece: lastPiece,
            lastEnPassant: lastEnPassant,
            lastCastle: lastCastle
           };
}

/**
 * Undo a move at the virtual board.
 * 
 * @param {*} moveStats The output of moveAtVBoard.
 * @param {*} piece An optional parameter of an object `piece`.
 */
function undoMoveAtVBoard(moveStats, piece=null) {
    if (moveStats.movedPieceFinal.name != moveStats.movedPiece.name) {
        board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece = createPiceForBoard(moveStats.movedPiece.name, moveStats.movedPiece.x, moveStats.movedPiece.y, moveStats.movedPiece.color, moveStats.movedPiece.moved);
        substitutePiece(board[moveStats.movedPieceFinal.x][moveStats.movedPieceFinal.y].piece, board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece);
        board[moveStats.movedPieceFinal.x][moveStats.movedPieceFinal.y].piece = null;
    } else {
        removePiece(board[moveStats.movedPieceFinal.x][moveStats.movedPieceFinal.y].piece);
        board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece = board[moveStats.movedPieceFinal.x][moveStats.movedPieceFinal.y].piece;
        
        board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece.x = moveStats.movedPiece.x;
        board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece.y = moveStats.movedPiece.y;
        if (board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece.moved != undefined)
            board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece.moved = moveStats.movedPiece.moved;
        board[moveStats.movedPieceFinal.x][moveStats.movedPieceFinal.y].piece = null;
        addPiece(board[moveStats.movedPiece.x][moveStats.movedPiece.y].piece);
    }
    
    if (moveStats.lastPiece != null) {
        let lastPiece = createPiceForBoard(moveStats.lastPiece.name, moveStats.lastPiece.x, moveStats.lastPiece.y, moveStats.lastPiece.color, moveStats.lastPiece.moved);
        addPiece(lastPiece);
        board[moveStats.lastPiece.x][moveStats.lastPiece.y].piece = lastPiece;
    }

    if (moveStats.lastCastle != null) {
        board[moveStats.lastCastle.xCastled][moveStats.lastCastle.y].piece = board[moveStats.lastCastle.x][moveStats.lastCastle.y].piece;
        board[moveStats.lastCastle.xCastled][moveStats.lastCastle.y].piece.moved = false;
        board[moveStats.lastCastle.xCastled][moveStats.lastCastle.y].piece.x = moveStats.lastCastle.xCastled;
        substitutePiece(board[moveStats.lastCastle.x][moveStats.lastCastle.y].piece, board[moveStats.lastCastle.xCastled][moveStats.lastCastle.y].piece);
        board[moveStats.lastCastle.x][moveStats.lastCastle.y].piece = null;
    }

    enPassant = moveStats.lastEnPassant;

    if (piece != null) {
        piece.x = moveStats.movedPiece.x;
        piece.y = moveStats.movedPiece.y;
        piece.piece = moveStats.movedPiece.name;
        if (piece.moved != undefined)
            piece.moved = moveStats.movedPiece.moved;
    }
}
