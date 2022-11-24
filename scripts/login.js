let botaoConta = document.querySelector('#login-inicial p button');
let loginNomeInput = document.querySelector('#nome-logar');
let loginSenhaInput = document.querySelector('#senha-logar');
let userEl = document.querySelector('#usuario-novo');
let senhaEl = document.querySelector('#senha-nova');
let emailEl = document.querySelector('#email');
let botaoConfirmar = document.querySelector('#botao-confirmar');
let botoesSumir = document.querySelectorAll('.sumir');
let loginEl = document.querySelector('#login');
let senhaInput = document.querySelector('#senha-nova input');
let senhaConfirmacaoInput = document.querySelector('#senha-confirmacao');
let mainEl = document.querySelector('main');
let loginBtnEl = document.querySelector('#botao-login');

let criarContaEl = {
    botao: document.querySelector('#login-inicial button'),
    nome: document.querySelector('#novo-nome'),
    senha: document.querySelector('#nova-senha'),
    confirmacao: {
        senha: document.querySelector('#senha-confirmacao'),
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

let coverEl = document.querySelector('#cover');
let centerEl = document.querySelector('#centralizing');

let sumir = () => {
    coverEl.style.display = 'none';
    centerEl.style.display = 'none';
    loginEl.style.display = 'none';
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
        senha: criarContaEl.senha.value,
        score: 0,
        vitorias: 0,
        derrotas: 0,
        tema: 'wood',
        tabuleiro: {
            moved: false,
            html: 'none',
            board: [],
            turn: 'white'
        }
    }
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    localStorage.setItem('tem usuario', true);
    
    localStorage.setItem('logado', true);

    criaInformacoesDeUsuario();

    sumir(); 
}

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

loginBtnEl.addEventListener('click', logar);

let loginInicial = document.querySelector('#login-inicial');
let novaConta = document.querySelector('#logon');
let loginText = document.querySelector('#login h2');
let loginP = document.querySelector('#login p');

botaoConta.onclick = () => {
    loginInicial.style.display = 'none';
    novaConta.style.display = 'flex';
    loginText.innerHTML = 'Logon';
    loginP.innerHTML = '↺';
    criarContaEl.nome.focus();
}

let iconeVoltar = document.querySelector('#login-topo p');

iconeVoltar.addEventListener('click', () => {
    loginInicial.style.display = 'flex';
    loginNomeInput.value = '';
    loginSenhaInput.value = '';
    criarContaEl.nome.value = '';
    criarContaEl.senha.value = '';
    criarContaEl.confirmacao.senha.value = '';
    emailEl.value = '';
    novaConta.style.display = 'none';
    loginP.innerHTML = '';
    loginText.innerHTML = 'Login';
});

coverEl.addEventListener('click', () => {
    sumir();
})