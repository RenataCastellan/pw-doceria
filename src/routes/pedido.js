const express = require('express');
const router  = express.Router();
const db      = require('../config/database');
const { autenticarCliente } = require('../middlewares/auth');

const WHATSAPP_DOCERIA = '5569999999999';

// Formulário de endereço + pagamento
router.get('/finalizar', autenticarCliente, (req, res) => {
    const carrinho = req.session.carrinho || [];

    if (carrinho.length === 0) {
        return res.redirect('/carrinho');
    }

    const total = carrinho.reduce((soma, item) => soma + item.subtotal, 0);
    res.render('pedido/finalizar', { carrinho, total, erro: null });
});

// Processar pedido e redirecionar para WhatsApp
router.post('/finalizar', autenticarCliente, (req, res) => {
    const { rua, numero, complemento, bairro, cidade, estado, cep, pagamento } = req.body;
    const carrinho   = req.session.carrinho || [];
    const id_cliente = req.session.usuario.id;

    if (carrinho.length === 0) return res.redirect('/carrinho');

    if (!rua || !numero || !bairro || !cidade || !estado) {
        const total = carrinho.reduce((soma, item) => soma + item.subtotal, 0);
        return res.render('pedido/finalizar', {
            carrinho, total,
            erro: 'Preencha todos os campos obrigatórios do endereço.'
        });
    }

    const total = carrinho.reduce((soma, item) => soma + item.subtotal, 0);

    const sqlEndereco = `
        INSERT INTO endereco (rua, numero, complemento, bairro, cidade, estado, cep, id_cliente)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sqlEndereco, [rua, numero, complemento || null, bairro, cidade, estado, cep || null, id_cliente],
        (erro, resEndereco) => {
            if (erro) return res.send('Erro ao salvar endereço.');

            const id_endereco = resEndereco.insertId;

            db.query(
                'INSERT INTO pedido (total, id_cliente, id_endereco) VALUES (?, ?, ?)',
                [total, id_cliente, id_endereco],
                (erro2, resPedido) => {
                    if (erro2) return res.send('Erro ao criar pedido.');

                    const id_pedido = resPedido.insertId;

                    const itens = carrinho.map(i =>
                        [id_pedido, i.id_produto, i.quantidade, i.preco]
                    );

                    db.query(
                        'INSERT INTO item_pedido (id_pedido, id_produto, quantidade, preco_unitario) VALUES ?',
                        [itens],
                        (erro3) => {
                            if (erro3) return res.send('Erro ao salvar itens do pedido.');

                            db.query(
                                'INSERT INTO pagamento (tipo, status, valor, id_pedido) VALUES (?, ?, ?, ?)',
                                [pagamento, 'pendente', total, id_pedido],
                                (erro4) => {
                                    if (erro4) return res.send('Erro ao salvar pagamento.');

                                    const nomeCliente = req.session.usuario.nome;
                                    let mensagem = `🍰 *Pedido — Encanto Doceria*\n\n`;
                                    mensagem += `👤 Cliente: ${nomeCliente}\n\n`;
                                    mensagem += `🛒 *Itens do pedido:*\n`;

                                    carrinho.forEach(item => {
                                        const subtotal = item.subtotal.toFixed(2).replace('.', ',');
                                        mensagem += `• ${item.nome} x${item.quantidade} — R$ ${subtotal}\n`;
                                    });

                                    mensagem += `\n💰 *Total: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
                                    mensagem += `\n💳 Pagamento: ${pagamento}\n`;
                                    mensagem += `\n📍 *Endereço de entrega:*\n`;
                                    mensagem += `${rua}, ${numero}`;
                                    if (complemento) mensagem += ` — ${complemento}`;
                                    mensagem += `\n${bairro} — ${cidade}/${estado}`;
                                    if (cep) mensagem += ` — CEP: ${cep}`;

                                    req.session.carrinho = [];

                                    const urlWhatsApp = `https://wa.me/${WHATSAPP_DOCERIA}?text=${encodeURIComponent(mensagem)}`;
                                    res.redirect(urlWhatsApp);
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

module.exports = router;