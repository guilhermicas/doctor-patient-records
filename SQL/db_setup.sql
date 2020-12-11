DROP DATABASE IF EXISTS DPRecords;

CREATE DATABASE DPRecords;

USE DPRecords;

CREATE TABLE User (
  user_id INT AUTO_INCREMENT,
  nome VARCHAR(256) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  password VARCHAR(256) NOT NULL,
  created_at DATE DEFAULT CURRENT_TIME,
  PRIMARY KEY (user_id)
);

CREATE TABLE Categoria (
  categoria_id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descricao VARCHAR(256),
  cor VARCHAR(7) NOT NULL DEFAULT "#F00",
  PRIMARY KEY (categoria_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Paciente (
  paciente_id INT AUTO_INCREMENT,
  user_id INT NOT NULL,
  categoria_id INT,
  nome VARCHAR(256) NOT NULL,
  PRIMARY KEY (paciente_id),
  created_at DATE DEFAULT CURRENT_TIME,
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  FOREIGN KEY (categoria_id) REFERENCES Categoria(categoria_id)
);

CREATE TABLE Atributo (
  atributo_id INT AUTO_INCREMENT,
  paciente_id INT NOT NULL,
  titulo VARCHAR(120) NOT NULL,
  descricao VARCHAR(1000),
  PRIMARY KEY (atributo_id),
  FOREIGN KEY (paciente_id) REFERENCES Paciente(paciente_id)
);
