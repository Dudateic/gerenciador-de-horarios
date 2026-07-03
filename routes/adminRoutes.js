const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/dashboard", adminController.dashboard);

/* Professores */
router.get("/professores", adminController.professores);
router.post("/professores", adminController.criarProfessor);
router.get("/professores/:id/editar", adminController.formEditarProfessor);
router.post("/professores/:id/editar", adminController.editarProfessor);
router.post("/professores/:id/excluir", adminController.excluirProfessor);

/* Estudantes */
router.get("/estudantes", adminController.estudantes);
router.post("/estudantes", adminController.criarEstudante);
router.get("/estudantes/:id/editar", adminController.formEditarEstudante);
router.post("/estudantes/:id/editar", adminController.editarEstudante);
router.post("/estudantes/:id/excluir", adminController.excluirEstudante);

/* Disciplinas e Turmas */
router.get("/disciplinas-turmas", adminController.disciplinasTurmas);

router.post("/disciplinas", adminController.criarDisciplina);
router.get("/disciplinas/:id/editar", adminController.formEditarDisciplina);
router.post("/disciplinas/:id/editar", adminController.editarDisciplina);
router.post("/disciplinas/:id/excluir", adminController.excluirDisciplina);

router.post("/turmas", adminController.criarTurma);
router.get("/turmas/:id/editar", adminController.formEditarTurma);
router.post("/turmas/:id/editar", adminController.editarTurma);
router.post("/turmas/:id/excluir", adminController.excluirTurma);

/* Relatórios */
router.get("/relatorios/turmas", adminController.listarTurmas);
router.get("/relatorios/turmas/:id/editar", adminController.formEditarTurma);
router.post("/relatorios/turmas/:id/editar", adminController.editarTurma);
router.post("/relatorios/turmas/:id/excluir", adminController.excluirTurma);
router.get("/relatorios/carga-docente", adminController.relatorioCargaDocente);

/* Configurações */
router.get("/configuracoes", adminController.configuracoes);

module.exports = router;