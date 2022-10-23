let botaoConta = document.querySelector('#botao-nova-conta');
let userEl = document.querySelector('#usuario-novo');
let idadeEl = document.querySelector('#idade-nova');
let senhaEl = document.querySelector('#senha-nova');
let botaoConfirmar = document.querySelector('#botao-confirmar');
let botoesSumir = document.querySelectorAll('.sumir');
let loginEl = document.querySelector('#login');
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

let criaPerfil = () => {
    let loginIncompleto = 0;

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

    localStorage.removeItem('usuario');

    let usuario = {
        nome: novoNomeInput.value,
        idade: idadeEl.value,
        senha: novaSenhaInput.value,
        score: 0,
        vitorias: 0,
        derrotas: 0,
        empates: 0
    }

    localStorage.setItem('usuario', JSON.stringify(usuario));

    sumir();
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
/*
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
*/
mainEl.addEventListener('click', sumir);

botaoConfirmar.addEventListener('click', criaPerfil);