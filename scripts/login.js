let botaoConta = document.querySelector('#botao-nova-conta');
let loginNomeInput = document.querySelector('#nome-logar');
let loginSenhaInput = document.querySelector('#senha-logar');
let userEl = document.querySelector('#usuario-novo');
let idadeEl = document.querySelector('#idade-nova');
let senhaEl = document.querySelector('#senha-nova');
let botaoConfirmar = document.querySelector('#botao-confirmar');
let botoesSumir = document.querySelectorAll('.sumir');
let loginEl = document.querySelector('#login');
let senhaInput = document.querySelector('#senha-nova input');
let senhaConfirmacaoInput = document.querySelector('#senha-confirmacao input');
let mainEl = document.querySelector('main');
let loginBtnEl = document.querySelector('#botao-login');

let criarContaEl = {
    botao: document.querySelector('#botao-nova-conta'),
    nome: document.querySelector('#novo-nome'),
    idade: document.querySelector('#idade'),
    senha: document.querySelector('#nova-senha'),
    confirmacao: {
        senha: document.querySelector('#senha-confirmacao'),
        torre: document.querySelector('#torre-animacao'),
    }
}

loginNomeInput.addEventListener('keyup', e => {
    if(e.key === 'Enter') {
        loginSenhaInput.focus();
    }
});

criarContaEl.nome.addEventListener('keyup', e => {
    if(e.key === 'Enter') {
        criarContaEl.senha.focus();
    }
});


localStorage.getItem('logado', false);
localStorage.getItem('tem usuario', false);

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
        criarContaEl.confirmacao.torre.style.display = 'none';
        senhaConfirmacaoInput.style.display = 'none';
}

function moveEsquerda() {
    criarContaEl.confirmacao.torre.style.right = '60vh';
}

function apareceConfirmacao() {
    criarContaEl.confirmacao.senha.style.transition = 'none';
    criarContaEl.confirmacao.senha.style.top = '75vh';
    criarContaEl.confirmacao.senha.style.right = '58vh';
}

let confirma = (validador, aSerValidado) => {
    if(aSerValidado === validador && aSerValidado && validador) {
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
            criarContaEl.confirmacao.torre.style.display = 'none';
            senhaConfirmacaoInput.style.display = 'none';
        }
    });
}

let camposCompletos = () => {
    let loginIncompleto = 0;

    if(!criarContaEl.nome.value) {
        criarContaEl.nome.placeholder="Digite um nome válido";
        criarContaEl.nome.style.border="0.4vh solid rgb(136, 0, 0)";
    
        loginIncompleto++;
    }
    if(!criarContaEl.senha.value) {
        criarContaEl.senha.placeholder="Digite uma senha válida";
        criarContaEl.senha.style.border="0.4vh solid rgb(136, 0, 0)";
        
        loginIncompleto++;
    }
    
    
    if(loginIncompleto !== 0) {
        return false;
    }

    return true;
    
}

let criarPerfil = () => {
    localStorage.removeItem('usuario');
    
    let usuario = {
        nome: criarContaEl.nome.value,
        idade: idadeEl.value,
        senha: criarContaEl.senha.value,
        score: 0,
        vitorias: 0,
        derrotas: 0,
        tema: 'wood',
        tabuleiro: ''
    }
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    localStorage.setItem('tem usuario', true);
    
    localStorage.setItem('logado', true);
    
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

    criarContaEl.nome.focus();
});

let logar = () => {
    let loginIncompleto = 0;
    let confirmacaoUser, confirmacaoSenha;
    
    if(!loginNomeInput.value) {
        loginNomeInput.placeholder="Digite um nome válido";
        loginNomeInput.style.border="0.4vh solid rgb(136, 0, 0)";

        loginIncompleto++;
    }
    if(!loginSenhaInput.value) {
        loginSenhaInput.placeholder="Digite uma senha válida";
        loginSenhaInput.style.border="0.4vh solid rgb(136, 0, 0)";
        
        loginIncompleto++;
    }
    if(loginIncompleto !== 0) {
        return;
    }

    let usuario = JSON.parse(localStorage.getItem('usuario'));

    confirmacaoSenha = confirma(usuario.senha, loginSenhaInput.value);
    confirmacaoUser = confirma(usuario.nome, loginNomeInput.value);
    
    if(!confirmacaoSenha || !confirmacaoUser) {
        loginNomeInput.value = loginSenhaInput.value = '';
        loginNomeInput.placeholder = loginSenhaInput.placeholder = "incorreto";
        loginNomeInput.style.border = loginSenhaInput.style.border = "0.4vh solid rgb(136, 0, 0)";
        
        return;
    }
    
    localStorage.setItem('tem usuario', true);

    localStorage.setItem('logado',true);

    criaInformacoesDeUsuario();

    selecionaTabuleiro(usuario);

    sumir();
}

loginSenhaInput.addEventListener('keyup', e => {
    if(e.key === 'Enter') {
        logar();
    }
});

criarContaEl.senha.addEventListener('keyup', e => {
    if(e.key === 'Enter'&& camposCompletos() === true) {
        let temp;
        criarContaEl.confirmacao.torre.style.top = '77vh';
        temp = setTimeout(moveEsquerda, 2000);
        temp = setTimeout(apareceConfirmacao, 4200);

        senhaConfirmacaoInput.focus();
    
        criarContaEl.confirmacao.senha.addEventListener('keyup', (e) => {
            if(e.key === 'Enter' && confirma(criarContaEl.senha.value, senhaConfirmacaoInput.value)) {
                criarPerfil();
            }
            else if(e.key === 'Enter' && !confirma(criarContaEl.senha.value, senhaConfirmacaoInput.value)) {
                    senhaConfirmacaoInput.value = '';
                    senhaConfirmacaoInput.placeholder="senha incorreta";
                    senhaConfirmacaoInput.style.border="0.4vh solid rgb(136, 0, 0)";
            }
        });
	}
});

mainEl.addEventListener('click', sumir);

botaoConfirmar.addEventListener('click', () => {
    let temp;
    criarContaEl.confirmacao.torre.style.top = '77vh';
    temp = setTimeout(moveEsquerda, 2000);
    temp = setTimeout(apareceConfirmacao, 4200);

    senhaConfirmacaoInput.focus();

    botaoConfirmar.addEventListener("click", () => {
        if(confirma(criarContaEl.senha.value, senhaConfirmacaoInput.value)) {
            criarPerfil();
        }
        else if(!criarContaEl.confirmacao.senha.value) {
            senhaConfirmacaoInput.value = '';
            senhaConfirmacaoInput.placeholder="senha incorreta";
            senhaConfirmacaoInput.style.border="0.4vh solid rgb(136, 0, 0)";
        }
    });
});

loginBtnEl.addEventListener('click', logar);
