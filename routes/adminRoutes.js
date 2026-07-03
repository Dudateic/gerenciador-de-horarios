const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/dashboard", adminController.dashboard);

router.get("/professores", adminController.professores);
router.post("/professores", adminController.criarProfessor);
router.get("/professores/:id/editar", adminController.formEditarProfessor);
router.post("/professores/:id/editar", adminController.editarProfessor);
router.post("/professores/:id/excluir", adminController.excluirProfessor);

router.get("/estudantes", adminController.estudantes);
router.post("/estudantes", adminController.criarEstudante);
router.get("/estudantes/:id/editar", adminController.formEditarEstudante);
router.post("/estudantes/:id/editar", adminController.editarEstudante);
router.post("/estudantes/:id/excluir", adminController.excluirEstudante);
router.get("/estudantes", adminController.estudantes);
router.post("/estudantes/:id/excluir", adminController.excluirEstudante);

router.get("/disciplinas-turmas", adminController.disciplinasTurmas);
router.post("/disciplinas", adminController.criarDisciplina);
router.post("/turmas", adminController.criarTurma);

router.get("/relatorios/turmas", adminController.listarTurmas);
router.get("/relatorios/turmas/:id/editar", adminController.formEditarTurma);
router.post("/relatorios/turmas/:id/editar", adminController.editarTurma);
router.post("/relatorios/turmas/:id/excluir", adminController.excluirTurma);
router.get("/relatorios/carga-docente", adminController.relatorioCargaDocente);

router.get("/configuracoes", adminController.configuracoes);

module.exports = router;
