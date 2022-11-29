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

let logado = false;

let criarPerfil = () => {
    localStorage.removeItem('usuario');
    
    let usuario = {
        nome: criarContaEl.nome.value,
        senha: criarContaEl.senha.value,
        score: 800,
        vitorias: 0,
        derrotas: 0,
        tema: 'wood'
    }
    
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    localStorage.setItem('tem usuario', true);
    
    localStorage.setItem('logado', true);

    criaInformacoesDeUsuario();

    sumir(); 

    logado = true;
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

    logar = true;
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

let olhos = document.querySelectorAll('.olho-img');

for (let olhoEl of olhos) {
    olhoEl.addEventListener('click', () => { 
        let srcFromImg = olhoEl.src;
        let imgFather = olhoEl.closest('div');
        let inputImg = (imgFather.firstChild).nextSibling;

        if (srcFromImg.indexOf('fechado') == -1) {
            inputImg.type = 'text';
            olhoEl.src = "img/olho-fechado.svg";
            olhoEl.style.height = '2.5vh';
            olhoEl.style.width = '2.5vh';
            olhoEl.style.top = '';
            olhoEl.style.left = '';
        }
        else {
            inputImg.type = 'password';
            olhoEl.src = "img/olho-aberto.svg";
            olhoEl.style.height = '2.5vh';
            olhoEl.style.width = '2.5vh';
            olhoEl.style.top = '.4vh';
            olhoEl.style.left = '65%';
        }
    }
)}

let contaPontuacao = (vencedor) => {
    let usuario = JSON.parse(localStorage.getItem('usuario'));
    if(!player) {
        return;
    } else if(vencedor !== player){
        usuario.derrotas++;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        atualizaInformacoesDeUsuario();
    }
    pontuacaoEngine;

    switch (engineOponente) {
        case 'cumbuca (1500)':
            pontuacaoEngine = 1500;
            break;
        case 'sei mate pastor (800)':
            pontuacaoEngine = 800;
            break;
        case 'random engine (???)':
            pontuacaoEngine = 200;
            break;                
    }
            
    usuario.vitorias = (usuario.vitorias) ? usuario.vitorias++ : 1;
    usuario.score += contaPontuacao(11 * pontuacaoEngine / usuario.score);

    localStorage.setItem('usuario', JSON.stringify(usuario));

    atualizaInformacoesDeUsuario();
}
