let botaoConta = document.querySelector('#botao-nova-conta');
let userEl = document.querySelector('#usuario-novo');
let idadeEl = document.querySelector('#idade-nova');
let senhaEl = document.querySelector('#senha-nova');
let botaoConfirmar = document.querySelector('#botao-confirmar');
let botoesSumir = document.querySelectorAll('.sumir');
let loginEl = document.querySelector('#login');
let mainEl = document.querySelector('main');
let botaoLoginEl = document.querySelector('#login-btn');

botaoConta.addEventListener('click', () => {
    botaoConta.style.left = '-100vh';
    userEl.style.left = '84.2vh';
    userEl.style.top = '68vh';
    idadeEl.style.right = '117.2vh';
    idadeEl.style.top = '74vh';
    senhaEl.style.top = '80vh';
    senhaEl.style.left = '84.2vh';
    botaoConfirmar.style.left = '92vh';
    botaoConfirmar.style.top = '89vh';
});

for (let botao of botoesSumir) {
    botao.addEventListener('click', () => {
        loginEl.style.transition = 'none';
        loginEl.style.left = '-100vh';
        userEl.style.transition = 'none';
        userEl.style.left = '-100vh';
        idadeEl.style.transition = 'none';
        idadeEl.style.left = '-100vh';
        senhaEl.style.transition = 'none';
        senhaEl.style.left = '-100vh';
        botaoConfirmar.style.transition = 'none';
        botaoConfirmar.style.left = '-100vh';
    });
}
mainEl.addEventListener('click', () => {
    loginEl.style.transition = 'none';
    loginEl.style.left = '-100vh';
    userEl.style.transition = 'none';
    userEl.style.left = '-100vh';
    idadeEl.style.transition = 'none';
    idadeEl.style.left = '-100vh';
    senhaEl.style.transition = 'none';
    senhaEl.style.left = '-100vh';
    botaoConfirmar.style.transition = 'none';
    botaoConfirmar.style.left = '-100vh';
});