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

let boxEl = document.querySelector('.container');
let menuEl = document.querySelector('#menu');
let cont = 0;

function menu(contador) {
    if (cont % 2 == 1)
        menuEl.style.left = '80vw';
    else
        menuEl.style.left = '100vw';
}

boxEl.addEventListener('click', ()=> {
    menu(cont);
    cont++;
});
/*por algum motivo o menu n tá voltando, eu vou ver isso dps. Tentei usando toggle numa class tbm, só q n foi ;(
usando toggle:
no css: .opened {
    left: 80vw;
}
no js: menuEl.classList.toggle('opened');*/
