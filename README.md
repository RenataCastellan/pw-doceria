# 🍰 Encanto Doceria — Sistema de Cardápio e Gestão de Pedidos

Sistema web desenvolvido para a disciplina de Projeto de Software Web do curso de Análise e Desenvolvimento de Sistemas — IFRO Campus Ji-Paraná.

## 👩‍💻 Acadêmicas

- Rafaela Pereira da Silva
- Renata Lima Lopes Castellan

---

## 📋 Sobre o Projeto

O sistema Encanto Doceria é um cardápio digital interativo que permite:

- Clientes visualizarem produtos, adicionarem ao carrinho e finalizarem pedidos via WhatsApp
- Administradores gerenciarem o cardápio (cadastrar, editar e excluir produtos)

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** com **Express**
- **EJS** — template engine para as views
- **MySQL** — banco de dados
- **bcrypt** — criptografia de senhas
- **express-session** — gerenciamento de sessão
- **dotenv** — variáveis de ambiente

---

## ✅ Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MySQL](https://www.mysql.com/) (versão 8 ou superior)
- [Git](https://git-scm.com/)

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/RenataCastellan/pw-doceria.git
cd pw-doceria
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Abra o **MySQL Workbench** e execute o script SQL localizado em:

```
database/schema.sql
```

Isso vai criar o banco de dados, todas as tabelas e inserir os dados iniciais (admin + produtos de exemplo).

### 4. Configure as variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto copiando o `.env.example`:

```bash
# Windows CMD
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Abra o `.env` e preencha com suas credenciais do MySQL:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=encanto_doceria
```

### 5. Inicie o servidor

```bash
node app.js
```

### 6. Acesse no navegador

```
http://localhost:3000
```

---

## 👤 Credenciais de Acesso

### Administrador
| Campo | Valor |
|-------|-------|
| E-mail | admin@encantodoceria.com |
| Senha | admin123 |

### Cliente
Crie uma conta acessando `/cadastrar` ou clicando em **Cadastrar** no menu.

---

## 📁 Estrutura do Projeto

```
pw-doceria/
├── database/
│   └── schema.sql          # Script de criação do banco de dados
├── public/
│   ├── css/
│   │   └── style.css       # Estilos da aplicação
│   └── imagens/            # Imagens estáticas
├── src/
│   ├── config/
│   │   └── database.js     # Configuração da conexão com MySQL
│   ├── middlewares/
│   │   └── auth.js         # Middleware de autenticação
│   └── routes/
│       ├── autenticacao.js # Rotas de login, cadastro e cardápio
│       ├── carrinho.js     # Rotas do carrinho de compras
│       ├── cliente.js      # Rotas do perfil do cliente
│       ├── pedido.js       # Rotas de finalização do pedido
│       └── produto.js      # Rotas de CRUD de produtos (admin)
├── views/
│   ├── administrador/      # Views do painel admin
│   ├── autenticacao/       # Views de login e cadastro
│   ├── carrinho/           # View do carrinho
│   ├── cliente/            # Views do cardápio e perfil
│   ├── layouts/            # Header e footer compartilhados
│   ├── pedido/             # View de finalização do pedido
│   ├── produto/            # Views de CRUD de produtos
│   ├── inicial.ejs         # Página inicial
│   └── sobre.ejs           # Página sobre
├── app.js                  # Arquivo principal da aplicação
├── .env.example            # Exemplo de variáveis de ambiente
└── package.json            # Dependências do projeto
```

---

## ⚙️ Funcionalidades

### Cliente
- Visualizar cardápio por categoria
- Adicionar produtos ao carrinho
- Alterar quantidade e remover itens do carrinho
- Cadastrar conta e fazer login
- Informar endereço de entrega
- Escolher forma de pagamento (PIX, Cartão de Crédito, Cartão de Débito, Dinheiro)
- Finalizar pedido via WhatsApp

### Administrador
- Login seguro
- Painel administrativo
- Cadastrar, editar e excluir produtos do cardápio
- Controle de estoque e visibilidade dos produtos
