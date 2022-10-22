// ---------ínicio tabuleiro----------
let square = {
    aWhite: false,
    aBlack: false,
    piece: 'none'
};

let matrizQuadrados = [[],[],[],[],[],[],[],[]];

for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++)
        matrizQuadrados[i][j] = square;

let verifyBordBarriers = (x, y) => (x <= 7 && x >= 0 && y <= 7 && y >= 0);

// ---------Fim tabuleiro----------

// ---------Início peças----------

let king = {
    type: 'white',
    x: 4,
    y: 7,
    moves: (x, y) => {
        let possibleKingMoves = [];
        for (let i = 0; i < 8; i++) {
            let inX = x + Math.cos(Math.PI / 4 * i), inY = y + Math.sin(Math.PI / 4 * i);
            inX = inX.toFixed(0);
            inY = inY.toFixed(0);
            if (verifyBordBarriers(inX, inY))
                possibleKingMoves.push([inX, inY]);
        }
        return possibleKingMoves;
    }
};

let knight = {
    type: 'white',
    x: 1,
    y: 7,
    moves: (x, y) => {
        const arrKnight = [[x-1, y-2], [x+1, y-2], [x+2, y-1], [x+2, y+1], [x+1, y+2], [x-1, y+2], [x-2, y+1], [x-2, y-1]];
        let possibleKnightMoves = [];
        for (let i = 0; i < 8; i++) {
            if (verifyBordBarriers(arrKnight[i]))
                possibleKnightMoves.push(arrKnight[i]);
        }
        return possibleKnightMoves;
    }
}

/*let pawn = {
    type: 'white',
    x: 0,
    y: 6,
    moves: (x,y) => {
        //quando for possível verificar se tem openentes nas diagonais, considerar os possíveis lances de (x-1, y-1) e (x+1, y-1)
    }
}*/

let bishop = {
    type: 'white',
    x: 2,
    y: 7,
    moves: (x, y) => {
        let i; let j;
        let possibleBishopMoves = [];
        for (i = x, j = y; i >= 0 && j >= 0; i--, j--) {
            possibleBishopMoves.push([i, j]);
        }
        for (i = x, j = y; i >= 7 && j >= 0; i++, j--) {
            possibleBishopMoves.push([i, j]);
        }
        for (i = x, j = y; i >= 0 && j <= 7; i--, j++) {
            possibleBishopMoves.push([i, j]);
        }
        for (i = x, j = y; i >= 7 && j <= 7; i++, j++) {
            possibleBishopMoves.push([i, j]);
        }
        return possibleBishopMoves;
    }
}

let rock = {
    type: 'white',
    x: 0,
    y: 7,
    moves: (x, y) => {
        let possibleRockMoves = [];
        let i;
        for (i = x; i >= 0 ; i--) {
            possibleRockMoves.push([i, y]);
        }
        for (i = x; i < 8; i++) {
            possibleRockMoves.push([i, y]);
        }
        for (i = y; i >= 0; i--) {
            possibleRockMoves.push([x, i]);
        }
        for (i = y; i < 8; i++) {
            possibleRockMoves.push([x, i]);
        }
        return possibleRockMoves;
    }
}

let queen = {
    type: 'white',
    x: 3,
    y: 7,
    moves: (x, y) => {
        let i; let j;
        let possibleQueenMoves = [];
        for (i = x, j = y; i >= 0 && j >= 0; i--, j--) {
            possibleQueenMoves.push([i, j]);
        }
        for (i = x, j = y; i >= 7 && j >= 0; i++, j--) {
            possibleQueenMoves.push([i, j]);
        }
        for (i = x, j = y; i >= 0 && j <= 7; i--, j++) {
            possibleQueenMoves.push([i, j]);
        }
        for (i = x, j = y; i >= 7 && j <= 7; i++, j++) {
            possibleQueenMoves.push([i, j]);
        }
        for (i = x; i >= 0 ; i--) {
            possibleQueenMoves.push([i, y]);
        }
        for (i = x; i < 8; i++) {
            possibleQueenMoves.push([i, y]);
        }
        for (i = y; i >= 0; i--) {
            possibleQueenMoves.push([x, i]);
        }
        for (i = ys; i < 8; i++) {
            possibleQueenMoves.push([x, i]);
        }
        return possibleQueenMoves;
    }
}


// ---------Fim peças----------

/*const whiteKing = Object.create(king);
mat = whiteKing.moves(3, 7);
for (let i = 0; i < mat.length; i++)
    console.log(`${mat[i][0]}, ${mat[i][1]}`);

const blackKing = Object.create(king);
blackKing.y = 0;*/

// ---------Inicio movimentos----------

let pieces = document.querySelectorAll('.piece');
let squares = document.querySelectorAll('#pieces-move div');
let finalMove;

pieces.forEach(pieceEl => {
    pieceEl.addEventListener('dragstart', () => {
        pieceEl.classList.add('grabed');
    });

    pieceEl.addEventListener('dragend', () => {
        // verification
        pieceEl.classList.remove('grabed');
        finalMove.innerHTML = '';
        finalMove.appendChild(pieceEl);
    });
});

squares.forEach(squareEl => {
    squareEl.addEventListener('dragenter', e => {
        finalMove = e.currentTarget;
    });
});
