const express = require('express');
const conexao = require('./db');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurações
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API do Banco de Questões funcionando!');
});

// Rota de teste
app.get('/api/status', (req, res) => {
    res.json({
        mensagem: 'Servidor funcionando corretamente!',
        status: 'online'
    });
});

app.get('/api/usuarios', (req, res) => {
    const sql = `
        SELECT id, nome, email, perfil, data_criacao
        FROM usuarios
    `;

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                mensagem: 'Erro ao consultar usuários'
            });
        }

        res.json(resultados);
    });
});

app.post('/api/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos.'
        });
    }

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const sql = `
            INSERT INTO usuarios (nome, email, senha_hash, perfil)
            VALUES (?, ?, ?, ?)
        `;

        conexao.query(
            sql,
            [nome, email, senhaHash, 'professor'],
            (erro, resultado) => {
                if (erro) {
                    if (erro.code === 'ER_DUP_ENTRY') {
                        return res.status(409).json({
                            mensagem: 'Este e-mail já está cadastrado.'
                        });
                    }

                    return res.status(500).json({
                        mensagem: 'Erro ao cadastrar usuário.'
                    });
                }

                res.status(201).json({
                    mensagem: 'Professor cadastrado com sucesso!',
                    id: resultado.insertId
                });
            }
        );
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao processar a senha.'
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});