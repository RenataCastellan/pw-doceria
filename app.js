const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('inicial');
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});

app.get('/login', (req,res)=>{
    res.render('autenticacao/login');
});

app.get('/produtos', (req,res)=>{
    res.render('produto/listar');
});