const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/alunoController");

router.get("/vitrine", alunoController.vitrine);
router.get("/cronograma", alunoController.cronograma);
router.get("/fluxograma", alunoController.fluxograma);
router.post("/fluxograma/status", alunoController.atualizarStatus);

router.get("/matriculas", alunoController.matriculas);
router.post("/matriculas/adicionar", alunoController.adicionarMatricula);
router.post("/matriculas/:id/remover", alunoController.removerMatricula);

router.get("/grades", alunoController.grades);
router.get("/financeiro", alunoController.financeiro);

module.exports = router;
