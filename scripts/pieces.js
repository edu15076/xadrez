let verifyBordBarriers = (x, y) => (x <= 7 && x >= 0 && y <= 7 && y >= 0);

function findShortMoves(pieceObj, directions) {
    let possibleMoves = [];
    
    directions.forEach(direction => {
        if (verifyBordBarriers(direction[0], direction[1]) && (board[direction[0]][direction[1]].piece === null || board[direction[0]][direction[1]].piece.color != pieceObj.color))
            possibleMoves.push(direction);
    });
    
    return possibleMoves;
}

function findLongMoves(pieceObj, directions) {
    let possibleMoves = [];
    
    directions.forEach(direction => {
        let x = direction[0] + pieceObj.x;
        let y = direction[1] + pieceObj.y;
        for ( ; x >= 0 && y >= 0; x += direction[0], y += direction[1])
            if (verifyBordBarriers(x, y)) {
                if (board[x][y].piece === null)
                    possibleMoves.push([x, y]);
                else if (board[x][y].piece.color != pieceObj.color) {
                    possibleMoves.push([x, y]);
                    break;
                } else break;
            }
            else break;
    });
    
    return possibleMoves;
}

let king = {
    piece: 'king',
    color: 'white',
    x: 4,
    y: 7,
    moved: false,
    moves() {
        const x = this.x;
        const y = this.y;
        
        let kingMoves = findShortMoves(this, [[x+1, y], [x+1, y+1], [x, y+1], [x-1, y+1], [x-1, y], [x-1, y-1], [x, y-1], [x+1, y-1]]);
        return kingMoves;
    }
};

let knight = {
    piece: 'knight',
    color: 'white',
    x: 1,
    y: 7,
    moves() {
        const x = this.x;
        const y = this.y;

        let knightMoves = findShortMoves(this, [[x-1, y-2], [x+1, y-2], [x+2, y-1], [x+2, y+1], [x+1, y+2], [x-1, y+2], [x-2, y+1], [x-2, y-1]]);
        return knightMoves;
    }
}

let pawn = {
    piece: 'pawn',
    color: 'white',
    x: 0,
    y: 6,
    moved: false,
    moveDirection() {
        return this.color === 'white' ? -1 : 1;
    },

    moves() {
        let pawnMoves = findShortMoves(this, [[this.x, this.y + this.moveDirection()]]);
        return pawnMoves;
    }
}

let bishop = {
    piece: 'bishop',
    color: 'white',
    x: 2,
    y: 7,
    moves() {
        let bishopMoves = findLongMoves(this, [[1, 1], [-1, -1], [1, -1], [-1, 1]]);
        return bishopMoves;
    }
}

let rook = {
    piece: 'rook',
    color: 'white',
    x: 0,
    y: 7,
    moved: false,
    moves() {
        let rookMoves = findLongMoves(this, [[1, 0], [0, 1], [-1, 0], [0, -1]]);
        return rookMoves;
    }
}

let queen = {
    piece: 'queen',
    color: 'white',
    x: 3,
    y: 7,
    moves() {
        let queenMoves = findLongMoves(this, [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]);
        return queenMoves;
    }
}
