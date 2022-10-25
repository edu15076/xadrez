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
