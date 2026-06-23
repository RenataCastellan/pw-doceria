const express = require('express');
const router  = express.Router();
const db      = require('../config/database');

// Função auxiliar: garantir que o carrinho existe na sessão
function getCarrinho(req) {
    if (!req.session.carrinho) req.session.carrinho = [];
    return req.session.carrinho;
}

// Ver carrinho
router.get('/', (req, res) => {
    const carrinho = getCarrinho(req);
    const total = carrinho.reduce((soma, item) => soma + item.subtotal, 0);
    res.render('carrinho/index', { carrinho, total });
});

// Adicionar produto ao carrinho
router.post('/adicionar', (req, res) => {
    const { id_produto, quantidade } = req.body;
    const qtd = parseInt(quantidade) || 1;

    db.query(
        'SELECT * FROM produto WHERE id_produto = ? AND ativo = TRUE',
        [id_produto],
        (erro, resultado) => {
            if (erro || resultado.length === 0) {
                return res.redirect('/cardapio');
            }

            const produto  = resultado[0];
            const carrinho = getCarrinho(req);

            const index = carrinho.findIndex(i => i.id_produto == id_produto);

            if (index >= 0) {
                carrinho[index].quantidade += qtd;
                carrinho[index].subtotal    = carrinho[index].quantidade * carrinho[index].preco;
            } else {
                carrinho.push({
                    id_produto: produto.id_produto,
                    nome:       produto.nome,
                    imagem:     produto.imagem,
                    preco:      parseFloat(produto.preco),
                    quantidade: qtd,
                    subtotal:   parseFloat(produto.preco) * qtd
                });
            }

            req.session.carrinho = carrinho;
            res.redirect('/carrinho');
        }
    );
});

// Alterar quantidade
router.post('/quantidade', (req, res) => {
    const { id_produto, acao } = req.body;
    const carrinho = getCarrinho(req);

    const index = carrinho.findIndex(i => i.id_produto == id_produto);

    if (index >= 0) {
        if (acao === 'aumentar') {
            carrinho[index].quantidade++;
        } else if (acao === 'diminuir' && carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
        }
        carrinho[index].subtotal = carrinho[index].quantidade * carrinho[index].preco;
    }

    req.session.carrinho = carrinho;
    res.redirect('/carrinho');
});

// Remover item
router.post('/remover', (req, res) => {
    const { id_produto } = req.body;
    req.session.carrinho = getCarrinho(req).filter(i => i.id_produto != id_produto);
    res.redirect('/carrinho');
});

// Limpar carrinho
router.post('/limpar', (req, res) => {
    req.session.carrinho = [];
    res.redirect('/carrinho');
});

module.exports = router;