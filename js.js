const ITENS_POR_PAGINA = 20;
const INTERVALO = 4000;

let dados = [];
let ofertas = [];
let paginaAtual = 1;
let indiceCarrossel = 0;
let timer = null;

fetch('./produto.csv')
    .then(r => r.text())
    .then(csv => {
        const linhas = csv.trim().split(/\r?\n/);
        const cab = linhas.shift().split(';');

        const idx = {
            codigo: cab.indexOf('CODIGO'),
            nome: cab.indexOf('MERCADORIA'),
            preco: cab.indexOf('PRECO'),
            estoque: cab.indexOf('ESTOQUE'),
            oferta: cab.indexOf('OFERTA')
        };

        linhas.forEach(l => {
            const c = l.split(';');
            if (parseInt(c[idx.estoque]) > 0) {
                dados.push(c);
                if (c[idx.oferta] === 'SIM') ofertas.push(c);
            }
        });

        renderizarProdutos();
        renderizarOfertas();
        iniciar();
    });

function itensPorTela() {
    return window.innerWidth <= 600 ? 2 : 5;
}

function criarCard(l) {
    const codigo = l[0].padStart(4,'0');
    return `
        <div class="produto">
            <div class="foto">
                <img src="./imagens/${codigo}-1.webp"
                     onerror="this.src='./imagens/sem-foto.webp'">
            </div>
            <div class="info">
                <h3>${l[1]}</h3>
                <div class="preco">R$ ${l[3]}</div>
            </div>
        </div>
    `;
}

/* OFERTAS */
function renderizarOfertas() {
    const el = document.getElementById('ofertas');
    el.innerHTML = '';

    const total = itensPorTela();
    for (let i = 0; i < total; i++) {
        const idx = (indiceCarrossel + i) % ofertas.length;
        el.innerHTML += criarCard(ofertas[idx]);
    }
}

function proximo() {
    indiceCarrossel++;
    renderizarOfertas();
    reset();
}

function anterior() {
    indiceCarrossel--;
    if (indiceCarrossel < 0) indiceCarrossel = ofertas.length - 1;
    renderizarOfertas();
    reset();
}

function iniciar() {
    timer = setInterval(proximo, INTERVALO);
}

function reset() {
    clearInterval(timer);
    iniciar();
}

document.querySelector('.next').onclick = proximo;
document.querySelector('.prev').onclick = anterior;
window.addEventListener('resize', renderizarOfertas);

/* CATÁLOGO */
function renderizarProdutos() {
    const el = document.getElementById('produtos');
    el.innerHTML = '';

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;

    dados.slice(inicio, fim).forEach(l => {
        el.innerHTML += criarCard(l);
    });

    const totalPaginas = Math.ceil(dados.length / ITENS_POR_PAGINA);
    document.getElementById('paginaAtual').innerText =
        `Página ${paginaAtual} de ${totalPaginas}`;
}

document.getElementById('proximo').onclick = () => {
    paginaAtual++;
    renderizarProdutos();
};

document.getElementById('anterior').onclick = () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        renderizarProdutos();
    }
};
