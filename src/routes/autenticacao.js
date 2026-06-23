const express = require('express');
const bcrypt  = require('bcrypt');
const router  = express.Router();
const db      = require('../config/database');

// Página inicial
router.get('/', (req, res) => {
    res.render('inicial');
});

// Login
router.get('/login', (req, res) => {
    res.render('autenticacao/login', { erro: null });
});

router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Verificar primeiro se é admin
    db.query(
        'SELECT * FROM administrador WHERE login = ?',
        [email],
        async (erro, resultado) => {
            if (erro) return res.send('Erro ao buscar administrador.');

            if (resultado.length > 0) {
                const admin = resultado[0];
                const senhaCorreta = await bcrypt.compare(senha, admin.senha);

                if (senhaCorreta) {
                    req.session.admin = {
                        id:    admin.id_admin,
                        login: admin.login
                    };
                    return res.redirect('/painel');
                }
            }

            // Se não for admin, verificar cliente
            db.query(
                'SELECT * FROM cliente WHERE email = ?',
                [email],
                async (erro2, resultado2) => {
                    if (erro2) return res.send('Erro ao buscar cliente.');

                    if (resultado2.length === 0) {
                        return res.render('autenticacao/login', {
                            erro: 'E-mail ou senha inválidos.'
                        });
                    }

                    const cliente = resultado2[0];
                    const senhaCorreta = await bcrypt.compare(senha, cliente.senha);

                    if (!senhaCorreta) {
                        return res.render('autenticacao/login', {
                            erro: 'E-mail ou senha inválidos.'
                        });
                    }

                    req.session.usuario = {
                        id:    cliente.id_cliente,
                        nome:  cliente.nome,
                        email: cliente.email
                    };

                    res.redirect('/cardapio');
                }
            );
        }
    );
});

// Cadastro de cliente
router.get('/cadastrar', (req, res) => {
    res.render('autenticacao/cadastrar', { erro: null });
});

router.post('/cadastrar', async (req, res) => {
    const { nome, email, senha, confirmar_senha } = req.body;

    if (senha !== confirmar_senha) {
        return res.render('autenticacao/cadastrar', {
            erro: 'As senhas não coincidem.'
        });
    }

    if (senha.length < 6) {
        return res.render('autenticacao/cadastrar', {
            erro: 'A senha deve ter no mínimo 6 caracteres.'
        });
    }

    db.query(
        'SELECT id_cliente FROM cliente WHERE email = ?',
        [email],
        async (erro, resultado) => {
            if (erro) return res.send('Erro ao verificar e-mail.');

            if (resultado.length > 0) {
                return res.render('autenticacao/cadastrar', {
                    erro: 'Este e-mail já está cadastrado.'
                });
            }

            const hash = await bcrypt.hash(senha, 10);

            db.query(
                'INSERT INTO cliente (nome, email, senha) VALUES (?, ?, ?)',
                [nome, email, hash],
                (erro2, resultado2) => {
                    if (erro2) return res.send('Erro ao cadastrar cliente.');

                    req.session.usuario = {
                        id:    resultado2.insertId,
                        nome,
                        email
                    };

                    res.redirect('/cardapio');
                }
            );
        }
    );
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Cardápio público
router.get('/cardapio', (req, res) => {
    db.query(
        'SELECT * FROM produto WHERE ativo = TRUE ORDER BY categoria, nome',
        (erro, produtos) => {
            if (erro) return res.send('Erro ao buscar produtos.');
            res.render('cliente/cardapio', { produtos });
        }
    );
});

module.exports = router;