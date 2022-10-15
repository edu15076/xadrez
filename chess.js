const darkSquare = 'rgb(181, 136, 99)';
const lightSquare = 'rgb(240, 217, 181)';

function drawBoard() {
    let boardEl = document.getElementById('board');
    
    if (boardEl.getContext) {
        let boardCtx = boardEl.getContext('2d');

        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++) {
                boardCtx.fillStyle = (j + i) % 2 == 0 ? lightSquare : darkSquare;
                boardCtx.fillRect(i * 300, j * 300, 300, 300);
            }
    }
}

verifyBordBarriers = (x, y) => (x <= 7 && x >= 0 && y <= 7 && y >= 0);

const king = {
    x: 4,
    y: 7,
    moves: (x, y) => {
        let possibleMoves = [];
        for (let i = 0; i < 8; i++) {
            let inX = x + Math.cos(Math.PI / 4 * i), inY = y + Math.sin(Math.PI / 4 * i);
            inX = inX.toFixed(0);
            inY = inY.toFixed(0);
            if (verifyBordBarriers(inX, inY))
                possibleMoves.push([inX, inY]);
        }
        return possibleMoves;
    }
};

/*const whiteKing = Object.create(king);
mat = whiteKing.moves(3, 7);
for (let i = 0; i < mat.length; i++)
    console.log(`${mat[i][0]}, ${mat[i][1]}`);

const blackKing = Object.create(king);
blackKing.y = 0;*/

