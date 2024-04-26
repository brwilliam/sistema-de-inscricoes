CREATE DATABASE IF NOT EXISTS backendfsiifinal ;

CREATE TABLE Candidato (
    cpf VARCHAR(11) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    endereco VARCHAR(100) NOT NULL
);

CREATE TABLE Vaga (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cargo VARCHAR(100) NOT NULL,
    salario DECIMAL(10, 2) NOT NULL,
    quantidade INT NOT NULL
);

CREATE TABLE Candidatura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) NOT NULL,
    data_inscricao DATE NOT NULL,
    FOREIGN KEY (cpf) REFERENCES Candidato(cpf)
);

CREATE TABLE Candidatura_Vaga (
    id_Candidatura INT,
    id_Vaga INT,
    PRIMARY KEY (id_Candidatura, id_Vaga),
    FOREIGN KEY (id_Candidatura) REFERENCES Candidatura(id),
    FOREIGN KEY (id_Vaga) REFERENCES Vaga(id)
);


-- Inserções na tabela Candidato
INSERT INTO Candidato (cpf, nome, email, endereco) VALUES
('12345678901', 'João da Silva', 'joao@example.com', 'Rua X, 123'),
('23456789012', 'Maria Oliveira', 'maria@example.com', 'Rua Y, 456'),
('34567890123', 'José Santos', 'jose@example.com', 'Rua Z, 789');

-- Inserções na tabela Vaga
INSERT INTO Vaga (cargo, salario, quantidade) VALUES
('Engenheiro de Software', 8000.00, 3),
('Cientista de Dados', 10000.00, 2),
('Product Manager', 12000.00, 1);

-- Inserções na tabela Candidatura
INSERT INTO Candidatura (cpf, data_inscricao) VALUES
('12345678901', '2024-04-01'),
('23456789012', '2024-04-02'),
('34567890123', '2024-04-03');

-- Inserções na tabela Candidatura_Vaga
INSERT INTO Candidatura_Vaga (id_Candidatura, id_Vaga) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3);
