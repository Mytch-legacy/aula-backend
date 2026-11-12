require('dotenv').config();

const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
});

conexao.connect((erro) => {
    if (erro) {
        console.error('Erro ao conectar ao MySQL:', erro);
        return;
    }

    console.log('Conectado ao banco de dados banco_questoes!');
});

module.exports = conexao;