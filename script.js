// Configuração das matérias para cada nível
const materiasFundamental = [
    { nome: "Matemática", id: "matematica" },
    { nome: "Português", id: "português" },
    { nome: "Educação Física", id: "edfísica" },
    { nome: "Geografia", id: "geografia" },
    { nome: "História", id: "historia" },
    { nome: "Inglês", id: "ingles" },
    { nome: "Arte", id: "arte" },
    { nome: "Cid. e Civismo", id: "cidcivismo" }
];

const materiasMedio = [
    { nome: "Português", id: "português" },
    { nome: "Matemática", id: "matematica" },
    { nome: "História", id: "historia" },
    { nome: "Geografia", id: "geografia" },
    { nome: "Sociologia", id: "sociologia" },
    { nome: "Filosofia", id: "filosofia" },
    { nome: "Arte", id: "arte" },
    { nome: "Cid. e Civismo", id: "cidcivismo" },
    { nome: "Educação Física", id: "edfísica" },
    { nome: "Robótica", id: "robotica" },
    { nome: "Química", id: "quimica" },
    { nome: "Biologia", id: "biologia" },
    { nome: "Física", id: "fisica" }
];

// Base de Dados de perguntas (Exemplo escalável com perguntas reais)
// Cada matéria deve conter um array com até 40 objetos de pergunta como os abaixo.
const bancoPerguntas = {
    matematica: [
        { q: "Quanto é 5 + 7?", options: ["10", "11", "12", "13"], correct: 2 },
        { q: "Qual o resultado de 9 x 8?", options: ["72", "81", "64", "70"], correct: 0 }
    ],
    portugues: [
        { q: "Qual palavra é um substantivo?", options: ["Correr", "Bonito", "Cachorro", "Rapidamente"], correct: 2 }
    ],
    geografia: [
        { q: "Qual o maior país em extensão territorial?", options: ["Canadá", "Rússia", "China", "Brasil"], correct: 1 }
    ],
    // Adicione os arrays para as demais matérias aqui seguindo o mesmo padrão estruturado.
};

// Estado Global da Aplicação
let tamanhoFonteAtual = 16;
let anoSelecionado = "";
let materiaSelecionada = "";
let indicePerguntaAtual = 0;

// Navegação entre Telas
function irPara(telaId) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });
    document.getElementById(`tela-${telaId}`).classList.add('ativa');
}

// Acessibilidade: Tamanho da Fonte
function alterarFonte(direcao) {
    tamanhoFonteAtual += direcao;
    // Evita tamanhos extremos de fonte
    if (tamanhoFonteAtual < 12) tamanhoFonteAtual = 12;
    if (tamanhoFonteAtual > 24) tamanhoFonteAtual = 24;
    document.documentElement.style.setProperty('--tamanho-base', `${tamanhoFonteAtual}px`);
}

// Acessibilidade: Modo Claro / Escuro
function alternarTema() {
    const html = document.documentElement;
    const btn = document.getElementById('btn-tema');
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        btn.innerText = 'Modo Escuro';
    } else {
        html.setAttribute('data-theme', 'dark');
        btn.innerText = 'Modo Claro';
    }
}

// Seleção de Ano e renderização das matérias específicas
function selecionarAno(ano) {
    anoSelecionado = ano;
    const gradeMaterias = document.getElementById('grade-materias');
    gradeMaterias.innerHTML = '';
    
    // Altera o título da página de matérias
    const sufixo = ano.includes('ef') ? `${ano.charAt(0)}º Ano do Fundamental` : '1º Ano do Ensino Médio';
    document.getElementById('titulo-ano').innerText = `Matérias - ${sufixo}`;

    // Decide quais matérias carregar
    const listaMaterias = ano.includes('ef') ? materiasFundamental : materiasMedio;

    listaMaterias.forEach(mat => {
        const btn = document.createElement('button');
        btn.innerText = mat.nome;
        btn.className = 'btn-materia';
        // Atribui cor correspondente baseada na variável CSS
        btn.style.backgroundColor = `var(--mat-${mat.id})`;
        btn.onclick = () => carregarQuiz(mat.id, mat.nome);
        gradeMaterias.appendChild(btn);
    });

    irPara('materias');
}

function voltarParaMaterias() {
    selecionarAno(anoSelecionado);
}

// Lógica de Perguntas e Quiz
function carregarQuiz(materiaId, materiaNome) {
    materiaSelecionada = materiaId;
    indicePerguntaAtual = 0;
    document.getElementById('quiz-materia-titulo').innerText = materiaNome;
    document.getElementById('quiz-materia-titulo').style.color = `var(--mat-${materiaId})`;
    
    irPara('quiz');
    exibirPergunta();
}

function exibirPergunta() {
    const perguntas = bancoPerguntas[materiaSelecionada] || [];
    
    if (perguntas.length === 0) {
        document.getElementById('pergunta-texto').innerText = "Novas perguntas para essa matéria serão liberadas em breve!";
        document.getElementById('opcoes-respostas').innerHTML = '';
        document.getElementById('btn-proxima').style.display = 'none';
        return;
    }

    const perguntaObj = perguntas[indicePerguntaAtual];
    document.getElementById('num-pergunta').innerText = indicePerguntaAtual + 1;
    document.getElementById('pergunta-texto').innerText = perguntaObj.q;

    const containerOpcoes = document.getElementById('opcoes-respostas');
    containerOpcoes.innerHTML = '';

    perguntaObj.options.forEach((opcao, index) => {
        const btnOpcao = document.createElement('button');
        btnOpcao.className = 'btn-opcao';
        btnOpcao.innerText = opcao;
        btnOpcao.onclick = () => verificarResposta(index, perguntaObj.correct);
        containerOpcoes.appendChild(btnOpcao);
    });

    document.getElementById('btn-proxima').style.display = 'none';
}

function verificarResposta(selecionada, correta) {
    const botoes = document.querySelectorAll('#opcoes-respostas button');
    
    // Bloqueia cliques adicionais nas opções
    botoes.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correta) {
            btn.classList.add('correto');
        } else if (index === selecionada) {
            btn.classList.add('errado');
        }
    });

    document.getElementById('btn-proxima').style.display = 'block';
}

function proximaPergunta() {
    const perguntas = bancoPerguntas[materiaSelecionada] || [];
    // Limita o quiz em 40 perguntas
    if (indicePerguntaAtual < perguntas.length - 1 && indicePerguntaAtual < 39) {
        indicePerguntaAtual++;
        exibirPergunta();
    } else {
        alert("Parabéns! Você completou todas as perguntas disponíveis desta matéria!");
        voltarParaMaterias();
    }
}

// Simulação simples de senha para Área de Pais
function abrirAreaPais() {
    const senha = prompt("Acesso restrito. Digite a senha dos pais (padrão: 1234):");
    if (senha === "1234") {
        irPara('pais');
    } else {
        alert("Senha incorreta. Acesso negado.");
    }
}
