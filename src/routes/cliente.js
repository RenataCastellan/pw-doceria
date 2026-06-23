const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { autenticarCliente } = require('../middlewares/auth');

// Perfil do cliente
router.get('/perfil', autenticarCliente, (req, res) => {
    const id = req.session.usuario.id;

    db.query(
        `SELECT c.nome, c.email, c.created_at,
                COUNT(p.id_pedido) AS total_pedidos
         FROM cliente c
         LEFT JOIN pedido p ON p.id_cliente = c.id_cliente
         WHERE c.id_cliente = ?
         GROUP BY c.id_cliente`,
        [id],
        (erro, resultado) => {
            if (erro || resultado.length === 0) return res.send('Erro ao buscar perfil.');
            res.render('cliente/perfil', { cliente: resultado[0] });
        }
    );
});

module.exports = router;