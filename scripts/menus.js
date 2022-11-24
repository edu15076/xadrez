let boxEl = document.querySelector('.container');
let checkboxMenuEl = document.querySelector('#checkbox-menu');
let menuEl = document.querySelector('nav');
let main = document.querySelector('main');

let configuracoesBtn = document.querySelector('#configuracoes-btn');
let configuracaoEl = document.querySelector('#configuracoes');
let configuracaoJanela = document.querySelector('#configuracoes-janela');
let temasEl = document.querySelectorAll('.temas');

const fechaMenu = () => {
    menuEl.classList.remove('aberto');
    checkboxMenuEl.checked = false;
};

/* Pensei em colocar atalhos de teclado mas to
estudando a melhor forma de fazer.

function keyPressed(evt){
    evt = evt || window.event;
    var key = evt.keyCode || evt.which;
    return String.fromCharCode(key); 
}

let acionaAtalho = e => {
    let tecla = keyPressed(e);

    if(tecla === 'C' || tecla === 'c') {
        abreConfiguracoes();
        console.log(1);
    }
}

//document.onkeydown = acionaAtalho
main.addEventListener('keyup', acionaAtalho);
*/
const abreConfiguracoes = () => {
    configuracaoEl.classList.remove('pop-up-configuracoes-fechado');
    configuracaoEl.classList.add('pop-up-configuracoes-aberto');
    menuEl.classList.remove('aberto');
    checkboxMenuEl.checked = false;
};

const fechaConfiguracoes = () => {
    configuracaoEl.classList.add('pop-up-configuracoes-fechado');
    configuracaoEl.classList.remove('pop-up-configuracoes-aberto');
};

boxEl.addEventListener('change', () => {
    menuEl.classList.toggle('aberto');
});

configuracoesBtn.addEventListener('click', abreConfiguracoes);

configuracaoEl.addEventListener('click', fechaConfiguracoes);

main.addEventListener('click', fechaMenu);

for (const tema of temas) {
    tema.addEventListener('click', fechaConfiguracoes);
}

let colorScreening = 'white';
let actualColor = 'white';
let pvp = false;
let flipBoardEl = document.getElementById('flip-board');
let chooseColorButtons = document.querySelectorAll('#choose-color span');
let whiteEl = document.getElementById('white');
let blackEl = document.getElementById('black');

function playerViewTop(el) {
    el.style.marginBottom = getComputedStyle(el).marginTop;
    el.style.marginTop = '0';
}

function playerViewBottom(el) {
    el.style.marginTop = getComputedStyle(el).marginBottom;
    el.style.marginBottom = '0';
}

function rotateBoard() {
    squares.forEach(squareEl => {
        let left = 87.5 - 100 * squareEl.offsetLeft / piecesMoveEl.clientHeight;
        let top = 87.5 - 100 * squareEl.offsetTop / piecesMoveEl.clientHeight;
        
        left = left % 1 === 0.5 ? left : roundToHalf(left);
        top = top % 1 === 0.5 ? top : roundToHalf(top);

        squareEl.style.left = `${left}%`;
        squareEl.style.top = `${top}%`;
    });

    actualColor = actualColor === 'white' ? 'black' : 'white';

    if (actualColor === 'white') {
        whiteEl.style.gridArea = '3 / 2 / 4 / 3';
        blackEl.style.gridArea = '1 / 2 / 2 / 3';
        whiteEl.style.alignItems = 'start';
        blackEl.style.alignItems = 'end';

        document.querySelectorAll('#white > *').forEach(playerViewBottom);
        document.querySelectorAll('#black > *').forEach(playerViewTop);
    } else {
        whiteEl.style.gridArea = '1 / 2 / 2 / 3';
        blackEl.style.gridArea = '3 / 2 / 4 / 3';
        whiteEl.style.alignItems = 'end';
        blackEl.style.alignItems = 'start';

        document.querySelectorAll('#white > *').forEach(playerViewTop);
        document.querySelectorAll('#black > *').forEach(playerViewBottom);
    }

    if (pvp || delay) colorScreening = colorScreening === 'white' ? 'black' : 'white';
}

flipBoardEl.onclick = rotateBoard;

let playEl = document.querySelector('#play .opcoes');
let chooseBlackEl = blackEl.querySelector('div:last-of-type');
let chooseWhiteEl = whiteEl.querySelector('div:last-of-type');
let blackPlayerEl = blackEl.querySelector('p');
let whitePlayerEl = whiteEl.querySelector('p');

playEl.onclick = () => {
    let valBlack = chooseBlackEl.querySelector('select').value;
    let valWhite = chooseWhiteEl.querySelector('select').value;

    blackEl.querySelector('div:first-of-type').style.display = 'flex';
    whiteEl.querySelector('div:first-of-type').style.display = 'flex';
    blackPlayerEl.innerHTML = valBlack;
    whitePlayerEl.innerHTML = valWhite;
    chooseBlackEl.style.display = 'none';
    chooseWhiteEl.style.display = 'none';
    document.getElementById('play').style.display = 'none';

    let enginesPlaying = 2;

    let userColor = 'black';

    switch (valBlack) {
        case 'you':
            fnBlack = () => null;
            enginesPlaying--;
            break;
        case 'cumbuca (2000)':
            fnBlack = () => null;
            break;
        case 'stockdog (2000)':
            fnBlack = () => null;
            break;
        case 'random engine (???)':
            fnBlack = randEngine;
            break;
    }

    switch (valWhite) {
        case 'you':
            fnWhite = () => null;
            enginesPlaying--;
            userColor = 'white';
            break;
        case 'cumbuca (2000)':
            fnWhite = () => null;
            break;
        case 'stockdog (2000)':
            fnWhite = () => null;
            break;
        case 'random engine (???)':
            fnWhite = randEngine;
            break;
    }

    delay = enginesPlaying === 2;
    pvp = enginesPlaying === 0;
    colorScreening = actualColor;

    if (enginesPlaying === 1)
        colorScreening = userColor;
    if (pvp)
        playerCanMove = true;

    gameOn = true;
    flowControl();
}

let loginMenuBtn = document.querySelector('#login-btn');

let criaInformacoesDeUsuario = () => {
    menuEl.removeChild(loginMenuBtn);

    let usuario = JSON.parse(localStorage.getItem('usuario'));

    let divInformacoesDoUsuarioEl = document.createElement('div');
    let informacoesEl = document.createElement('ul');

    menuEl.insertBefore(divInformacoesDoUsuarioEl, document.querySelector('#configuracoes-btn'));

    let tableEl = document.createElement('table');
    tableEl.innerHTML = `<tr><td><strong>V</strong></td><td><strong>D</strong></td></tr>
    <tr><td><strong>${usuario.vitorias}</strong></td><td><strong>${usuario.derrotas}</strong></td></tr>`;
    divInformacoesDoUsuarioEl.appendChild(tableEl);
    
    divInformacoesDoUsuarioEl.insertBefore(informacoesEl, tableEl);
    
    let pontos = document.createElement('li');
    pontos.innerHTML = `<strong>${usuario.score}</strong>`;
    informacoesEl.appendChild(pontos);
    
    let nomeDoUsuario = document.createElement('li');
    nomeDoUsuario.innerHTML = `<strong>${usuario.nome}</strong>`;
    informacoesEl.insertBefore(nomeDoUsuario, pontos);
    
    divInformacoesDoUsuarioEl.classList.add('usuario-informacoes');
}

let saveBtn = document.querySelector('#save');

let exibeTabuleiroFinal = () => {
    html2canvas(document.querySelector('#tabuleiro-e-pecas')).then(canvas => {
        let imagemCodificadaEmURL = canvas.toDataURL();

        document.querySelector('#pecas-resultado').src = imagemCodificadaEmURL;
    });
}

let salvaTabuleiroFinal = () => {
    let linkEl = document.createElement('a');
    linkEl.download = 'resultado.png';
    linkEl.href = document.querySelector('#pecas-resultado').src;

    document.body.appendChild(linkEl);

    linkEl.click();
}

saveBtn.addEventListener('click', salvaTabuleiroFinal);
