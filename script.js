const palavrasFacil = ["casa", "carro", "rio", "bola", "gato", "peixe", "sol", "lua", "mar", "flor"];
const palavrasMedio = ["banana", "morango", "abacaxi", "cachorro", "elefante", "computador", "celular", "televisao", "carro", "bicicleta", "moto", "avião", "barco", "oceano", "praia", "montanha", "valeta", "floresta", "deserto", "cidade", "vilarejo", "fazenda", "roça", "estrada", "ponte"];
const palavrasDificil = [...palavrasMedio, "programacao", "javascript", "html", "css", "desenvolvimento", "aplicativo", "rede", "servidor", "cliente", "banco", "dados", "sistema", "informacao", "tecnologia", "virtual", "internet", "software", "hardware", "memoria", "processador", "arquitetura", "sinal", "antena", "frequencia", "comunicacao"];
const palavrasExtremo = [...palavrasDificil, "neurociencia", "nanotecnologia", "astrofisica", "bioquimica", "fisiologia", "geopolitica", "etimologia", "filosofia", "antropologia", "arqueologia", "linguistica", "metafisica", "ontologia", "epistemologia", "heuristica", "cibernetica", "robotica", "genetica", "biotecnologia", "psicologia", "sociologia", "demografia", "urbanismo", "arquitetura", "engenharia", "matematica", "fisica", "quimica", "biologia", "geologia", "geografia", "historia", "literatura", "poesia", "museologia", "arte"];

const niveis = {
    facil: { tamanho: 15, palavras: palavrasFacil },
    medio: { tamanho: 20, palavras: palavrasMedio },
    dificil: { tamanho: 40, palavras: palavrasDificil },
    extremo: { tamanho: 100, palavras: palavrasExtremo }
};

document.getElementById('iniciar').addEventListener('click', iniciarJogo);
document.getElementById('desistir').addEventListener('click', desistirJogo);
document.getElementById('proximo').addEventListener('click', proximoJogo);

let palavrasEncontradas = 0;

function iniciarJogo() {
    const nivel = document.getElementById('dificuldade').value;
    const { tamanho, palavras } = niveis[nivel];
    const gridContainer = document.getElementById('grid-container');
    const palavrasContainer = document.getElementById('palavras-container');

    gridContainer.innerHTML = '';
    palavrasContainer.innerHTML = '';

    gridContainer.style.gridTemplateColumns = `repeat(${tamanho}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${tamanho}, 1fr)`;

    const grid = criarGrid(tamanho, palavras);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = document.createElement('button');
            cell.textContent = grid[i][j];
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.addEventListener('click', verificarPalavra);
            gridContainer.appendChild(cell);
        }
    }

    const ul = document.createElement('ul');
    palavras.forEach(palavra => {
        const li = document.createElement('li');
        li.textContent = palavra.toUpperCase();
        li.dataset.palavra = palavra.toUpperCase();
        ul.appendChild(li);
    });
    palavrasContainer.appendChild(ul);

    palavrasEncontradas = 0;
    document.getElementById('desistir').classList.remove('disabled');
    document.getElementById('proximo').classList.add('disabled');
}

function criarGrid(tamanho, palavras) {
    const grid = Array.from({ length: tamanho }, () => Array(tamanho).fill(''));
    palavras.forEach(palavra => {
        inserirPalavraNoGrid(grid, palavra.toUpperCase());
    });
    completarGrid(grid);
    return grid;
}

function inserirPalavraNoGrid(grid, palavra) {
    const direcoes = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    const tamanho = grid.length;
    let inserida = false;

    while (!inserida) {
        const direcao = direcoes[Math.floor(Math.random() * direcoes.length)];
        const x = Math.floor(Math.random() * tamanho);
        const y = Math.floor(Math.random() * tamanho);

        if (cabePalavra(grid, palavra, x, y, direcao)) {
            for (let i = 0; i < palavra.length; i++) {
                grid[x + i * direcao[0]][y + i * direcao[1]] = palavra[i];
            }
            inserida = true;
        }
    }
}

function cabePalavra(grid, palavra, x, y, direcao) {
    for (let i = 0; i < palavra.length; i++) {
        const nx = x + i * direcao[0];
        const ny = y + i * direcao[1];
        if (nx >= grid.length || ny >= grid.length || ny < 0 || grid[nx][ny] !== '') {
            return false;
        }
    }
    return true;
}

function completarGrid(grid) {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '') {
                grid[i][j] = letras[Math.floor(Math.random() * letras.length)];
            }
        }
    }
}

function verificarPalavra(event) {
    const cell = event.target;
    cell.classList.toggle('selected');
    verificarTodasPalavras();
}

function verificarTodasPalavras() {
    const palavrasContainer = document.getElementById('palavras-container');
    const palavras = palavrasContainer.querySelectorAll('li');

    palavras.forEach(palavra => {
        const letras = palavra.dataset.palavra.split('');
        const selecionadas = [];
        document.querySelectorAll('.selected').forEach(cell => {
            selecionadas.push(cell.textContent);
        });

        if (letras.every(letra => selecionadas.includes(letra))) {
            palavra.classList.add('riscada');
            document.querySelectorAll('.selected').forEach(cell => {
                cell.classList.add('found');
                cell.classList.remove('selected');
            });
            palavrasEncontradas++;
        }
    });

    if (palavrasEncontradas === palavras.length) {
        document.getElementById('proximo').classList.remove('disabled');
    }
}

function desistirJogo() {
    alert('Você desistiu do jogo!');
    resetarJogo();
}

function proximoJogo() {
    resetarJogo();
    iniciarJogo();
}

function resetarJogo() {
    document.getElementById('grid-container').innerHTML = '';
    document.getElementById('palavras-container').innerHTML = '';
    document.getElementById('desistir').classList.add('disabled');
    document.getElementById('proximo').classList.add('disabled');
}
