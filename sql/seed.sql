\c horarios_db;

TRUNCATE TABLE "Matriculas", "Horarios", "Turmas", "Disciplinas", "Professors", "Alunos" RESTART IDENTITY CASCADE;

INSERT INTO "Alunos" (nome, matricula, email, curso, semestre, ativo, "createdAt", "updatedAt") VALUES
('Ana Clara Santos','20261001','ana.santos@uefs.br','Engenharia de Computação','1º Semestre',true,NOW(),NOW()),
('Bruno Oliveira','20261002','bruno.oliveira@uefs.br','Engenharia de Computação','3º Semestre',true,NOW(),NOW()),
('Carla Souza','20261003','carla.souza@uefs.br','Engenharia de Computação','5º Semestre',true,NOW(),NOW()),
('Diego Lima','20261004','diego.lima@uefs.br','Engenharia de Computação','7º Semestre',true,NOW(),NOW());

INSERT INTO "Professors" (nome, email, area, ativo, disciplinas, "cargaSemanal", "createdAt", "updatedAt") VALUES
('Fernando Paixão','fernando.paixao@uefs.br','Física e Sistemas Digitais',true,'Física I, Circuitos Digitais',0,NOW(),NOW()),
('Gabriela Chaves','gabriela.chaves@uefs.br','Matemática',true,'Cálculo I, Álgebra Linear',0,NOW(),NOW()),
('Ramon Menezes','ramon.menezes@uefs.br','Computação',true,'Algoritmos, Estrutura de Dados',0,NOW(),NOW()),
('Juliana Ramos','juliana.ramos@uefs.br','Engenharia de Software',true,'Banco de Dados, Engenharia de Software',0,NOW(),NOW());

INSERT INTO "Disciplinas" (nome, codigo, semestre, "cargaHoraria", coordenador, prerequisito, "createdAt", "updatedAt") VALUES
('Algoritmos','TEC101','1º Semestre',60,'Ramon Menezes','',NOW(),NOW()),
('Cálculo I','MAT101','1º Semestre',60,'Gabriela Chaves','',NOW(),NOW()),
('Estrutura de Dados','TEC202','3º Semestre',60,'Ramon Menezes','Algoritmos',NOW(),NOW()),
('Banco de Dados','TEC404','5º Semestre',60,'Juliana Ramos','Estrutura de Dados',NOW(),NOW()),
('Circuitos Digitais','TEC301','3º Semestre',60,'Fernando Paixão','Física I',NOW(),NOW());

INSERT INTO "Turmas" (nome, disciplina, professor, cor, dias, horario, sala, vagas, "vagasOcupadas", ativa, "createdAt", "updatedAt") VALUES
('Algoritmos','Algoritmos','Ramon Menezes','#2563eb','Seg, Qua','08:00 - 10:00','Lab 01',40,12,true,NOW(),NOW()),
('Cálculo I','Cálculo I','Gabriela Chaves','#f59e0b','Ter, Qui','14:00 - 16:00','Sala 12',45,20,true,NOW(),NOW()),
('Banco de Dados','Banco de Dados','Juliana Ramos','#7c3aed','Seg, Qua','19:00 - 21:00','Lab 02',35,18,true,NOW(),NOW()),
('Circuitos Digitais','Circuitos Digitais','Fernando Paixão','#10b981','Sex','10:00 - 12:00','Lab 03',30,10,true,NOW(),NOW());

INSERT INTO "Horarios" (disciplina, periodo, "diaSemana", "horarioInicio", "horarioFim", "createdAt", "updatedAt") VALUES
('Algoritmos','Manhã','Segunda','08:00','10:00',NOW(),NOW()),
('Cálculo I','Tarde','Terça','14:00','16:00',NOW(),NOW()),
('Banco de Dados','Noite','Segunda','19:00','21:00',NOW(),NOW());

INSERT INTO "Matriculas" ("alunoId", "turmaId", status, "createdAt", "updatedAt") VALUES
(1,1,'Ativa',NOW(),NOW()),
(2,3,'Ativa',NOW(),NOW()),
(3,4,'Ativa',NOW(),NOW());
