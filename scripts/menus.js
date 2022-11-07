let boxEl = document.querySelector('.container');
let checkboxMenuEl = document.querySelector('#checkbox-menu');
let menuEl = document.querySelector('nav');

let configuracoesBtn = document.querySelector('#configuracoes-btn');
let configuracaoEl = document.querySelector('#configuracoes');
let configuracaoJanela = document.querySelector('#configuracoes-janela');
let temasEl = document.querySelectorAll('.temas');

const abreConfiguracoes = () => {
    configuracaoEl.classList.toggle('pop-up-configuracoes-fechado');
    configuracaoEl.classList.toggle('pop-up-configuracoes-aberto');
    menuEl.classList.toggle('aberto');
    checkboxMenuEl.checked = false;
};

const fechaConfiguracoes = () => {
    configuracaoEl.classList.toggle('pop-up-configuracoes-fechado');
    configuracaoEl.classList.toggle('pop-up-configuracoes-aberto');
};

boxEl.addEventListener('change', () => {
    menuEl.classList.toggle('aberto');
});

configuracoesBtn.addEventListener('click', abreConfiguracoes);

configuracaoEl.addEventListener('click', fechaConfiguracoes);

for (const tema of temas) {
    tema.addEventListener('click', fechaConfiguracoes);
}

let piecesUser = 'white';
let chooseColorButtons = document.querySelectorAll('#choose-color span');

function rotateBoard(choosedColor) {
    let newColor = choosedColor.dataset.color;
    if (newColor != piecesUser) {
        let opositeColor = newColor === 'white' ? 'black' : 'white';

        document.getElementById(`${newColor}-promotion`).style.gridArea = '3 / 2 / 4 / 3';
        document.getElementById(`${opositeColor}-promotion`).style.gridArea = '1 / 2 / 2 / 3';

        squares.forEach(squareEl => {
            squareEl.style.left = `${7 * piecesMoveEl.clientHeight / 8 - squareEl.offsetLeft}px`;
            squareEl.style.top = `${7 * piecesMoveEl.clientHeight / 8 - squareEl.offsetTop}px`;
        });
        piecesUser = newColor;
    } else {
        squares.forEach(squareEl => {
            let x = squareEl.dataset.square.charCodeAt(0) - 97;
            let y = 8 - squareEl.dataset.square[1];
            if (piecesUser === 'black') {
                x = 7 - x;
                y = 7 - y;
            }
            squareEl.style.left = `${x * piecesMoveEl.clientHeight / 8}px`;
            squareEl.style.top = `${y * piecesMoveEl.clientHeight / 8}px`;
        });
    }
}

chooseColorButtons.forEach(choosedColor => {
    choosedColor.onclick = () => {rotateBoard(choosedColor)};
});

let loginMenuBtn = document.querySelector('#login-btn');

let criaInformacoesDeUsuario = () => {
    menuEl.removeChild(loginMenuBtn);

    let usuario = JSON.parse(localStorage.getItem('usuario'));

    let divInformacoesDoUsuarioEl = document.createElement('div');
    let informacoesEl = document.createElement('ul');

    menuEl.insertBefore(divInformacoesDoUsuarioEl, document.querySelector('#choose-color'))

    divInformacoesDoUsuarioEl.appendChild(informacoesEl);

    let derrotasDoUsuario = document.createElement('li');
    derrotasDoUsuario.innerHTML = `Derrotas: <strong>${usuario.derrotas}</strong>`;
    informacoesEl.appendChild(derrotasDoUsuario);

    
    let vitoriasDoUsuario = document.createElement('li');
    vitoriasDoUsuario.innerHTML = `Vitórias: <strong>${usuario.vitorias}</strong>`;
    informacoesEl.insertBefore(vitoriasDoUsuario, derrotasDoUsuario);
    
    let pontuacaoDoUsuario = document.createElement('li');
    pontuacaoDoUsuario.innerHTML = `Pontuação: <strong>${usuario.score}</strong>`;
    informacoesEl.insertBefore(pontuacaoDoUsuario, vitoriasDoUsuario);
 
    let nomeDoUsuario = document.createElement('li');
    nomeDoUsuario.innerHTML = `<strong>${usuario.nome}</strong>`;
    informacoesEl.insertBefore(nomeDoUsuario, pontuacaoDoUsuario);
    
    divInformacoesDoUsuarioEl.classList.add('usuario-informacoes');
}