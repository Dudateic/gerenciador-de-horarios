\c horarios_db;

INSERT INTO "Alunos" (nome,email,semestre,matricula,"createdAt","updatedAt") VALUES
('Ana Souza','ana@email.com','1º Semestre','2026001',NOW(),NOW()),
('Bruno Lima','bruno@email.com','3º Semestre','2026002',NOW(),NOW()),
('Carla Dias','carla@email.com','5º Semestre','2026003',NOW(),NOW());

INSERT INTO "Professors" (nome,departamento,ativo,"createdAt","updatedAt") VALUES
('Fernando Paixão','Computação',true,NOW(),NOW()),
('Gabriela Chaves','Matemática',true,NOW(),NOW()),
('Bianca Santiago','Química',true,NOW(),NOW());

INSERT INTO "Disciplinas" (nome,codigo,semestre,coordenador,prerequisito,"createdAt","updatedAt") VALUES
('Cálculo Diferencial e Integral I','MAT101','1º Semestre','Gabriela Chaves','',NOW(),NOW()),
('Programação Orientada a Objetos','INF102','3º Semestre','Fernando Paixão','Algoritmos',NOW(),NOW()),
('Banco de Dados I','INF201','5º Semestre','Fernando Paixão','POO',NOW(),NOW())
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO "Turmas" (nome,disciplina,professor,sala,dias,horario,vagas,"vagasOcupadas",ativa,"createdAt","updatedAt") VALUES
('Turma A','Física I','Fernando Paixão','Bloco A - 203','Segunda, Quarta, Sexta','10:00 - 12:00',36,28,true,NOW(),NOW()),
('Turma B','POO','Gabriela Chaves','Lab 01','Terça, Quinta','14:00 - 16:00',40,32,true,NOW(),NOW()),
('Turma C','Banco de Dados I','Bianca Santiago','Lab 02','Sexta','08:00 - 10:00',35,30,true,NOW(),NOW());

INSERT INTO "Horarios" (disciplina,periodo,"diaSemana","horarioInicio","horarioFim","createdAt","updatedAt") VALUES
('Algoritmos','Manhã','Segunda','08:00','10:00',NOW(),NOW()),
('POO','Manhã','Terça','10:00','12:00',NOW(),NOW()),
('Banco de Dados','Tarde','Quarta','14:00','16:00',NOW(),NOW()),
('Redes','Tarde','Quinta','16:00','18:00',NOW(),NOW()),
('Compiladores','Noite','Sexta','19:00','21:00',NOW(),NOW());

INSERT INTO "Matriculas" ("alunoId","turmaId","disciplinaId","createdAt","updatedAt") VALUES
(1,1,1,NOW(),NOW()),
(2,2,2,NOW(),NOW()),
(3,3,3,NOW(),NOW());
