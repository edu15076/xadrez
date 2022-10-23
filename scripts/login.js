let botaoConta = document.querySelector('#botao-nova-conta');
let userEl = document.querySelector('#usuario-novo');
let idadeEl = document.querySelector('#idade-nova');
let senhaEl = document.querySelector('#senha-nova');
let botaoConfirmar = document.querySelector('#botao-confirmar');
let botoesSumir = document.querySelectorAll('.sumir');
let loginEl = document.querySelector('#login');
let senhaConfirmacao = document.querySelector('#senha-confirmacao');
let torreEl = document.querySelector('#torre-animacao');
let senhaInput = document.querySelector('#senha-nova input');
let senhaConfirmacaoInput = document.querySelector('#senha-confirmacao input');
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

function moveEsquerda() {
    torreEl.style.right = '60vh';
}

function apareceConfirmacao() {
    senhaConfirmacao.style.transition = 'none';
    senhaConfirmacao.style.top = '75vh';
    senhaConfirmacao.style.right = '58vh';
}

senhaEl.addEventListener('change', () => {
    let temp;
    torreEl.style.top = '77vh';
    temp = setTimeout(moveEsquerda, 2000);
    temp = setTimeout(apareceConfirmacao, 4200);
});

for (let botao of botoesSumir) {
    botao.addEventListener('click', () => {
        if (senhaInput.value != senhaConfirmacaoInput.value && senhaConfirmacaoInput.value != '') {
            senhaConfirmacaoInput.value = '';
            senhaEl.value = '';
            senhaConfirmacaoInput.placeholder = 'CONFIRMAÇÃO INVÁLIDA';
            senhaConfirmacaoInput.style.border = '.65vh solid red';
            
        }
        else if(senhaConfirmacaoInput.value != ''){
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
        torreEl.style.transition = 'none';
        torreEl.style.left = '-100vh';
        senhaConfirmacao.style.transition = 'none';
        senhaConfirmacao.style.left = '-100vh';
        }
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
