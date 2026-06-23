require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path    = require('path');

const app = express();
const db  = require('./src/config/database');

// Rotas
const autenticacaoRoutes = require('./src/routes/autenticacao');
const produtoRoutes      = require('./src/routes/produto');
const carrinhoRoutes     = require('./src/routes/carrinho');
const clienteRoutes      = require('./src/routes/cliente');
const pedidoRoutes       = require('./src/routes/pedido');

// Configurações gerais
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessão
app.use(session({
    secret: 'encanto-doceria-secret-2026',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Variáveis globais para as views
app.use((req, res, next) => {
    res.locals.usuarioLogado = req.session.usuario || null;
    res.locals.adminLogado   = req.session.admin   || null;
    res.locals.carrinho      = req.session.carrinho || [];
    next();
});

// Registrar rotas
app.use('/',         autenticacaoRoutes);
app.use('/produtos', produtoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/cliente',  clienteRoutes);
app.use('/pedido',   pedidoRoutes);

// Páginas simples
app.get('/sobre', (req, res) => {
    res.render('sobre');
});

app.get('/painel', (req, res) => {
    if (!req.session.admin) return res.redirect('/login');
    res.render('administrador/painel');
});

// Servidor
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});