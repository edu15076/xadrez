const cor = {
    wood: {
        darkSquare: 'rgb(181, 136, 99)',
        lightSquare: 'rgb(240, 217, 181)'
    },
    modern: {
        darkSquare: 'rgb(24, 24, 24)',
        lightSquare: 'rgb(170, 170, 170)'
    },
    classic: {
        darkSquare: 'rgb(42, 119, 11)',
        lightSquare: 'rgb(218, 196, 170)'
    }
}

let darkSquare = cor.wood.darkSquare;
let lightSquare = cor.wood.lightSquare;

const defineCorClassic = () => {
    darkSquare = cor.classic.darkSquare;
    lightSquare = cor.classic.lightSquare;
}
const defineCorWood = () => {
    darkSquare = cor.wood.darkSquare;
    lightSquare = cor.wood.lightSquare;
}
const defineCorModern = () => {
    darkSquare = cor.modern.darkSquare;
    lightSquare = cor.modern.lightSquare;
}

//talvez tenha que chamar a função drawBoard dentro das alterar cor
//para atualizar a cor, não tenho certeza, vou esperar termos mais
//avanço no html para ver isso direitinho
//Ass: Eloy

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