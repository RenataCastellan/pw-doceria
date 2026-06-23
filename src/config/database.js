const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'encanto_doceria'
});

conexao.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL:', erro.message);
        process.exit(1);
    }
    console.log('✅ Conectado ao MySQL com sucesso!');
});

module.exports = conexao;