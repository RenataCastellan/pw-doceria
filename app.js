const express = require('express');
const app = express();
const db = require('./src/config/database');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('inicial');
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

app.get('/login', (req,res)=>{
    res.render('autenticacao/login');
});

app.get('/produtos', (req, res) => {

    db.query('SELECT * FROM produtos', (erro, resultados) => {

        if (erro) {
            console.log(erro);
            return res.send('Erro ao buscar produtos');
        }

        res.render('produto/listar', {
            produtos: resultados
        });

    });

});

app.get('/produtos/cadastrar', (req, res) => {
    res.render('produto/cadastrar');
});

app.post('/produtos/cadastrar', (req, res) => {

    const { nome, descricao, preco } = req.body;

    const sql = `
        INSERT INTO produtos (nome, descricao, preco)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nome, descricao, preco], (erro) => {

        if (erro) {
            console.log(erro);
            return res.send('Erro ao salvar produto');
        }

        res.redirect('/produtos');
    });

});

app.get('/produtos/editar/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'SELECT * FROM produtos WHERE id = ?',
        [id],
        (erro, resultado) => {

            if (erro) {
                console.log(erro);
                return res.send('Erro');
            }

            res.render('produto/editar', {
                produto: resultado[0]
            });

        }
    );

});

app.post('/produtos/editar/:id', (req, res) => {

    const id = req.params.id;

    const { nome, descricao, preco } = req.body;

    db.query(
        `UPDATE produtos
         SET nome = ?, descricao = ?, preco = ?
         WHERE id = ?`,
        [nome, descricao, preco, id],
        (erro) => {

            if (erro) {
                console.log(erro);
                return res.send('Erro ao atualizar');
            }

            res.redirect('/produtos');
        }
    );

});