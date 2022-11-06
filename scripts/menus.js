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
