const ITENS_POR_PAGINA = 20;

let dados = [];
let paginaAtual = 1;

/* ===== CARREGAR CSV ===== */
fetch('./produto.csv')
    .then(r => r.text())
    .then(csv => {
        const linhas = csv.trim().split(/\r?\n/);
        linhas.shift(); // remove cabeçalho

        linhas.forEach(l => {
            const c = l.split(';');
            if (parseInt(c[3]) > 0) { // estoque
                dados.push(c);
            }
        });

        renderizarProdutos();
    });

/* ===== CARD ===== */
function criarCard(l) {
    const codigo = l[0].padStart(4, '0');
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

/* ===== CATÁLOGO ===== */
function renderizarProdutos() {
    const el = document.getElementById('produtos');
    el.innerHTML = '';

    const totalPaginas = Math.ceil(dados.length / ITENS_POR_PAGINA);

    if (paginaAtual < 1) paginaAtual = 1;
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;

    dados.slice(inicio, fim).forEach(l => {
        el.innerHTML += criarCard(l);
    });

    document.getElementById('paginaAtual').innerText =
        `Página ${paginaAtual} de ${totalPaginas}`;

    // desativa botões corretamente
    document.getElementById('anterior').disabled = paginaAtual === 1;
    document.getElementById('proximo').disabled = paginaAtual === totalPaginas;
}

/* ===== BOTÕES ===== */
document.getElementById('proximo').onclick = () => {
    paginaAtual++;
    renderizarProdutos();
};

document.getElementById('anterior').onclick = () => {
    paginaAtual--;
    renderizarProdutos();
};
