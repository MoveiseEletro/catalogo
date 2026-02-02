const ITENS_POR_PAGINA = 30;

let dados = [];
let paginaAtual = 1;
let indiceCodigo = -1;
let indiceNome = -1;
let indicePreco = -1;
let indiceEstoque = -1;

fetch('./produto.csv')
    .then(response => response.text())
    .then(csv => {
        const linhas = csv.trim().split(/\r?\n/);

        linhas.forEach((linha, index) => {
            const colunas = linha.trim().split(';');
            if (colunas.length < 4) return;

            if (index === 0) {
                colunas.forEach((col, i) => {
                    const nomeCol = col.toUpperCase();
                    if (nomeCol === 'CODIGO') indiceCodigo = i;
                    if (nomeCol === 'MERCADORIA') indiceNome = i;
                    if (nomeCol === 'PRECO') indicePreco = i;
                    if (nomeCol === 'ESTOQUE') indiceEstoque = i;
                });
            } else {
                const estoque = parseInt(colunas[indiceEstoque], 10);
                if (!isNaN(estoque) && estoque > 0) {
                    dados.push(colunas);
                }
            }
        });

        renderizarProdutos();
        configurarPaginacao();
    });

function renderizarProdutos() {
    const container = document.getElementById('produtos');
    container.innerHTML = '';

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;

    dados.slice(inicio, fim).forEach(linha => {
        const codigo = linha[indiceCodigo].padStart(4, '0');
        const nome = linha[indiceNome];
        const precoBruto = linha[indicePreco];

        const num = parseFloat(precoBruto.replace(',', '.'));
        const preco = !isNaN(num)
            ? num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
            : precoBruto;

        const card = document.createElement('div');
        card.className = 'produto';

        card.innerHTML = `
            <div class="foto">
                <img src="./imagens/${codigo}-1.webp"
                     alt="${nome}"
                     loading="lazy"
                     onerror="this.src='./imagens/sem-foto.webp'">
            </div>
            <div class="info">
                <h3>${nome}</h3>
                <div class="preco">${preco}</div>
            </div>
        `;

        container.appendChild(card);
    });

    document.getElementById('paginaAtual').innerText =
        `Página ${paginaAtual} de ${Math.ceil(dados.length / ITENS_POR_PAGINA)}`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function configurarPaginacao() {
    const totalPaginas = Math.ceil(dados.length / ITENS_POR_PAGINA);

    document.getElementById('anterior').onclick = () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarProdutos();
        }
    };

    document.getElementById('proximo').onclick = () => {
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarProdutos();
        }
    };
}
