-- ============================================================
--  Encanto Doceria — Script de criação do banco de dados
-- ============================================================

CREATE DATABASE IF NOT EXISTS encanto_doceria
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE encanto_doceria;

-- Administrador
CREATE TABLE IF NOT EXISTS administrador (
  id_admin    INT           NOT NULL AUTO_INCREMENT,
  login       VARCHAR(120)  NOT NULL UNIQUE,
  senha       VARCHAR(255)  NOT NULL,
  PRIMARY KEY (id_admin)
);

-- Cliente
CREATE TABLE IF NOT EXISTS cliente (
  id_cliente  INT           NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(120)  NOT NULL,
  email       VARCHAR(120)  NOT NULL UNIQUE,
  senha       VARCHAR(255)  NOT NULL,
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cliente)
);

-- Endereço (1:N com Cliente)
CREATE TABLE IF NOT EXISTS endereco (
  id_endereco INT           NOT NULL AUTO_INCREMENT,
  rua         VARCHAR(150)  NOT NULL,
  numero      VARCHAR(20)   NOT NULL,
  complemento VARCHAR(100)  NULL,
  bairro      VARCHAR(100)  NOT NULL,
  cidade      VARCHAR(100)  NOT NULL,
  estado      CHAR(2)       NOT NULL,
  cep         VARCHAR(10)   NULL,
  id_cliente  INT           NOT NULL,
  PRIMARY KEY (id_endereco),
  CONSTRAINT fk_endereco_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Produto (1:N com Administrador)
CREATE TABLE IF NOT EXISTS produto (
  id_produto  INT             NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(120)    NOT NULL,
  descricao   TEXT            NULL,
  preco       DECIMAL(10, 2)  NOT NULL,
  imagem      VARCHAR(255)    NULL,
  categoria   VARCHAR(80)     NOT NULL,
  estoque     INT             NOT NULL DEFAULT 0,
  ativo       BOOLEAN         NOT NULL DEFAULT TRUE,
  id_admin    INT             NOT NULL,
  PRIMARY KEY (id_produto),
  CONSTRAINT fk_produto_admin
    FOREIGN KEY (id_admin) REFERENCES administrador (id_admin)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Pedido (1:N com Cliente e Endereço)
CREATE TABLE IF NOT EXISTS pedido (
  id_pedido   INT             NOT NULL AUTO_INCREMENT,
  data        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status      VARCHAR(50)     NOT NULL DEFAULT 'pendente',
  total       DECIMAL(10, 2)  NOT NULL DEFAULT 0.00,
  id_cliente  INT             NOT NULL,
  id_endereco INT             NOT NULL,
  PRIMARY KEY (id_pedido),
  CONSTRAINT fk_pedido_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_pedido_endereco
    FOREIGN KEY (id_endereco) REFERENCES endereco (id_endereco)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Pagamento (1:N com Pedido)
CREATE TABLE IF NOT EXISTS pagamento (
  id_pagamento    INT             NOT NULL AUTO_INCREMENT,
  tipo            VARCHAR(50)     NOT NULL,
  status          VARCHAR(50)     NOT NULL DEFAULT 'pendente',
  valor           DECIMAL(10, 2)  NOT NULL,
  data_pagamento  DATETIME        NULL,
  id_pedido       INT             NOT NULL,
  PRIMARY KEY (id_pagamento),
  CONSTRAINT fk_pagamento_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ItemPedido (N:N entre Pedido e Produto)
CREATE TABLE IF NOT EXISTS item_pedido (
  id_item         INT             NOT NULL AUTO_INCREMENT,
  quantidade      INT             NOT NULL DEFAULT 1,
  preco_unitario  DECIMAL(10, 2)  NOT NULL,
  id_pedido       INT             NOT NULL,
  id_produto      INT             NOT NULL,
  PRIMARY KEY (id_item),
  CONSTRAINT fk_itempedido_pedido
    FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_itempedido_produto
    FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Carrinho (1:N com Cliente)
CREATE TABLE IF NOT EXISTS carrinho (
  id_carrinho INT       NOT NULL AUTO_INCREMENT,
  created_at  DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_cliente  INT       NOT NULL,
  PRIMARY KEY (id_carrinho),
  CONSTRAINT fk_carrinho_cliente
    FOREIGN KEY (id_cliente) REFERENCES cliente (id_cliente)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ItemCarrinho (N:N entre Carrinho e Produto)
CREATE TABLE IF NOT EXISTS item_carrinho (
  id_item     INT  NOT NULL AUTO_INCREMENT,
  quantidade  INT  NOT NULL DEFAULT 1,
  id_carrinho INT  NOT NULL,
  id_produto  INT  NOT NULL,
  PRIMARY KEY (id_item),
  CONSTRAINT fk_itemcarrinho_carrinho
    FOREIGN KEY (id_carrinho) REFERENCES carrinho (id_carrinho)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_itemcarrinho_produto
    FOREIGN KEY (id_produto) REFERENCES produto (id_produto)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Admin padrão (senha: admin123)
INSERT INTO administrador (login, senha)
VALUES ('admin@encantodoceria.com', '$2b$10$FevYgnY3xs4YTS4ClpJMmeYL3CQQajUxcBNao6D72YTWbSOZshpMy');

-- Produtos de exemplo
INSERT INTO produto (nome, descricao, preco, categoria, estoque, ativo, id_admin) VALUES
  ('Brigadeiro Gourmet',  'Brigadeiro artesanal com chocolate belga',      4.50,  'Doces Finos', 50, TRUE, 1),
  ('Trufa de Maracujá',   'Trufa cremosa com recheio de maracujá fresco',  6.00,  'Trufas',      30, TRUE, 1),
  ('Bolo de Chocolate',   'Bolo úmido com cobertura de ganache',           55.00, 'Bolos',       10, TRUE, 1),
  ('Beijinho de Coco',    'Docinho de coco com cravo',                      4.00,  'Doces Finos', 40, TRUE, 1),
  ('Trufa de Limão',      'Trufa com ganache de limão siciliano',           6.00,  'Trufas',      25, TRUE, 1);