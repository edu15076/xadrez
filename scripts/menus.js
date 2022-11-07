let boxEl = document.querySelector('.container');
let checkboxMenuEl = document.querySelector('#checkbox-menu');
let menuEl = document.querySelector('nav');

let configuracoesBtn = document.querySelector('#configuracoes-btn');
let configuracaoEl = document.querySelector('#configuracoes');
let configuracaoJanela = document.querySelector('#configuracoes-janela');
let temasEl = document.querySelectorAll('.temas');

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

for (const tema of temas) {
    tema.addEventListener('click', fechaConfiguracoes);
}

let piecesUser = 'white';
let chooseColorButtons = document.querySelectorAll('#choose-color span');

function rotateBoard(choosedColor) {
    let newColor = choosedColor.dataset.color;
    if (newColor != piecesUser) {
        squares.forEach(squareEl => {
            let left = 87.5 - 100 * squareEl.offsetLeft / piecesMoveEl.clientHeight;
            let top = 87.5 - 100 * squareEl.offsetTop / piecesMoveEl.clientHeight;
            
            left = left % 1 === 0.5 ? left : roundToHalf(left);
            top = top % 1 === 0.5 ? top : roundToHalf(top);

            squareEl.style.left = `${left}%`;
            squareEl.style.top = `${top}%`;
        });
        piecesUser = newColor;
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