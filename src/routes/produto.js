const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { autenticarAdmin } = require('../middlewares/auth');

// Listar produtos (admin)
router.get('/', autenticarAdmin, (req, res) => {
    db.query(
        'SELECT * FROM produto ORDER BY categoria, nome',
        (erro, produtos) => {
            if (erro) return res.send('Erro ao buscar produtos.');
            res.render('produto/listar', { produtos, sucesso: req.query.sucesso || null });
        }
    );
});

// Cadastrar produto
router.get('/cadastrar', autenticarAdmin, (req, res) => {
    res.render('produto/cadastrar', { erro: null });
});

router.post('/cadastrar', autenticarAdmin, (req, res) => {
    const { nome, descricao, preco, imagem, categoria, estoque } = req.body;
    const id_admin = req.session.admin.id;

    if (!nome || !preco || !categoria) {
        return res.render('produto/cadastrar', {
            erro: 'Nome, preço e categoria são obrigatórios.'
        });
    }

    const sql = `
        INSERT INTO produto (nome, descricao, preco, imagem, categoria, estoque, ativo, id_admin)
        VALUES (?, ?, ?, ?, ?, ?, TRUE, ?)
    `;

    db.query(sql, [nome, descricao, preco, imagem || null, categoria, estoque || 0, id_admin], (erro) => {
        if (erro) return res.send('Erro ao cadastrar produto.');
        res.redirect('/produtos?sucesso=cadastrado');
    });
});

// Editar produto
router.get('/editar/:id', autenticarAdmin, (req, res) => {
    db.query(
        'SELECT * FROM produto WHERE id_produto = ?',
        [req.params.id],
        (erro, resultado) => {
            if (erro || resultado.length === 0) return res.send('Produto não encontrado.');
            res.render('produto/editar', { produto: resultado[0], erro: null });
        }
    );
});

router.post('/editar/:id', autenticarAdmin, (req, res) => {
    const { nome, descricao, preco, imagem, categoria, estoque, ativo } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE produto
        SET nome = ?, descricao = ?, preco = ?, imagem = ?,
            categoria = ?, estoque = ?, ativo = ?
        WHERE id_produto = ?
    `;

    db.query(
        sql,
        [nome, descricao, preco, imagem || null, categoria, estoque || 0, ativo === 'on' ? 1 : 0, id],
        (erro) => {
            if (erro) return res.send('Erro ao atualizar produto.');
            res.redirect('/produtos?sucesso=editado');
        }
    );
});

// Excluir produto
router.get('/excluir/:id', autenticarAdmin, (req, res) => {
    db.query(
        'SELECT * FROM produto WHERE id_produto = ?',
        [req.params.id],
        (erro, resultado) => {
            if (erro || resultado.length === 0) return res.send('Produto não encontrado.');
            res.render('produto/excluir', { produto: resultado[0] });
        }
    );
});

router.post('/excluir/:id', autenticarAdmin, (req, res) => {
    db.query(
        'DELETE FROM produto WHERE id_produto = ?',
        [req.params.id],
        (erro) => {
            if (erro) return res.send('Erro ao excluir produto.');
            res.redirect('/produtos?sucesso=excluido');
        }
    );
});

module.exports = router;