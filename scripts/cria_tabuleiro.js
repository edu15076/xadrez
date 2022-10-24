const temas = document.querySelectorAll('.temas');

let temUsuario = localStorage.getItem('tem usuario');
temUsuario = JSON.parse(temUsuario);

let darkSquare = 'rgb(181, 136, 99)';
let lightSquare = 'rgb(240, 217, 181)';

let selecionaTabuleiro = (user) => {
    switch (user.tema) {
        case 'wood':
            darkSquare = 'rgb(181, 136, 99)';
            lightSquare = 'rgb(240, 217, 181)';
            break;
        case 'blue':
            darkSquare = 'rgb(4, 14, 61)';
            lightSquare = 'rgb(211, 218, 240)';
            break;
        case 'modern':
            darkSquare = 'rgb(24, 24, 24)';
            lightSquare = 'rgb(170, 170, 170)';
            break;
        case 'traditional':
            darkSquare = 'rgb(115, 180, 89)';
            lightSquare = 'rgb(233, 227, 219)';
            break;
    }
    
    console.log(user.tema);

    drawBoard();
}

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

function mudaCor(tema) {
    /*
        Essa função tem que salvar a cor que a pessoa escolheu seja
        localStorage mas não consigo acessar o user.tema
     */
    let user = localStorage.getItem('usuario');
    JSON.parse(user);

    tema.addEventListener('click', (e) => {
        let temaEscolhido = e.currentTarget;

        darkSquare = temaEscolhido.dataset.darkSquare;
        lightSquare = temaEscolhido.dataset.lightSquare;

        drawBoard();

        fechaConfiguracoes();
    });
}

temas.forEach(mudaCor);
