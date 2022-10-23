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

let novoNomeInput = document.querySelector('#novo-nome');
let idadeInput = document.querySelector('#idade');
let novaSenhaInput = document.querySelector('#nova-senha');

let sumir = () => {
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
}

function moveEsquerda() {
    torreEl.style.right = '60vh';
}

function apareceConfirmacao() {
    senhaConfirmacao.style.transition = 'none';
    senhaConfirmacao.style.top = '75vh';
    senhaConfirmacao.style.right = '58vh';
}

let confirmaSenha = (validador) => {
    if(senhaInput.value === validador) {
        return true;
    }
    else {
        return false;
    }
}

for (let botao of botoesSumir) {
    botao.addEventListener('click', () => {
        if (senhaInput.value != senhaConfirmacaoInput.value && senhaConfirmacaoInput.value != '') {
            senhaConfirmacaoInput.value = '';
            senhaEl.value = '';
            senhaConfirmacaoInput.placeholder = 'CONFIRMAÇÃO INVÁLIDA';
            senhaConfirmacaoInput.style.border = '0.4vh solid rgb(136, 0, 0)';

        }
        else if(senhaConfirmacaoInput.value != ''){
            sumir();
            torreEl.style.display = 'none';
            senhaConfirmacaoInput.style.display = 'none';
        }
    });
}

let criaPerfil = () => {
    let loginIncompleto = 0;
    let confirmacao;

    if(!novoNomeInput.value) {
        novoNomeInput.placeholder="Digite um nome válido";
        novoNomeInput.style.border="0.4vh solid rgb(136, 0, 0)";

        loginIncompleto++;
    }
    if(!novaSenhaInput.value) {
        novaSenhaInput.placeholder="Digite uma senha válida";
        novaSenhaInput.style.border="0.4vh solid rgb(136, 0, 0)";
        
        loginIncompleto++;
    }
    if(!idadeInput.value) {
        idadeInput.placeholder="Selecione uma idade válida";
        idadeInput.style.border="0.4vh solid rgb(136, 0, 0)";
        
        loginIncompleto++;
    }

    if(loginIncompleto !== 0) {
        return;
    }

    let temp;
        torreEl.style.top = '77vh';
        temp = setTimeout(moveEsquerda, 2000);
        temp = setTimeout(apareceConfirmacao, 4200);

    botaoConfirmar.addEventListener("click", () => {
        confirmacao = confirmaSenha(senhaConfirmacaoInput.value);
    })

    localStorage.removeItem('usuario');

    let usuario = {
        nome: novoNomeInput.value,
        idade: idadeEl.value,
        senha: novaSenhaInput.value,
        score: 0,
        vitorias: 0,
        derrotas: 0,
        empates: 0,
        tema: 'wood'
    }

    localStorage.setItem('usuario', JSON.stringify(usuario));

    if(confirmacao === true) {
        sumir(); 
    }
    else {
        return;
    }
}

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

mainEl.addEventListener('click', sumir);

botaoConfirmar.addEventListener('click', criaPerfil);
