const temas = document.querySelectorAll('.temas');

let temUsuario = localStorage.getItem('tem usuario');
temUsuario = JSON.parse(temUsuario);

let darkSquare = 'rgb(163, 116, 86)';
let lightSquare = 'rgb(240, 217, 181)';

let selecionaTabuleiro = (user) => {
    switch (user.tema) {
        case 'wood':
            darkSquare = 'rgb(163, 116, 86)';
            lightSquare = 'rgb(240, 217, 181)';
        break;
        case 'blue':
            darkSquare = 'rgb(45, 66, 106)';
            lightSquare = 'rgb(132, 146, 172)';
        break;
        case 'modern':
            darkSquare = 'rgb(73, 73, 72)';
            lightSquare = 'rgb(170, 170, 170)';
        break;
        case 'traditional':
            darkSquare = 'rgb(29, 93, 51)';
            lightSquare = 'rgb(233, 227, 219)';
        break;
        }
        
    drawBoard();
}

/** Draw the chess board on the screen. */
function drawBoard() {
    let boardEl = document.getElementById('board');
        
    if (boardEl.getContext) {
        let boardCtx = boardEl.getContext('2d', { alpha: false });
        
        for (let i = 0; i < 8; i++)
        for (let j = 0; j < 8; j++) {
            boardCtx.fillStyle = (j + i) % 2 == 0 ? lightSquare : darkSquare;
            boardCtx.fillRect(i, j, 1, 1);
        }
    }
}
    
function mudaCor(tema) {
       
    tema.addEventListener('click', (e) => {
        let user = localStorage.getItem('usuario');
        user = JSON.parse(user);
           
        if(temUsuario) {
           user.tema = tema.dataset.tema;
           localStorage.setItem('usuario', JSON.stringify(user));
        }
            
        let temaEscolhido = e.currentTarget;
            
        darkSquare = temaEscolhido.dataset.darkSquare;
        lightSquare = temaEscolhido.dataset.lightSquare;
        
        drawBoard();
        
        fechaConfiguracoes();
    });
}
    
temas.forEach(mudaCor);
    
onload = () => {
    drawBoard();
    loginNomeInput.focus();
} 
