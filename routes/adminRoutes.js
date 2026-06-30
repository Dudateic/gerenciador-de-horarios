const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.dashboard);
router.get('/disciplinas/nova', adminController.formNovaDisciplina);
router.post('/disciplinas/nova', adminController.criarDisciplina);
router.get('/relatorios/turmas', adminController.listarTurmas);
router.get('/relatorios/turmas/:id/editar', adminController.formEditarTurma);
router.post('/relatorios/turmas/:id/editar', adminController.editarTurma);
router.post('/relatorios/turmas/:id/excluir', adminController.excluirTurma);

module.exports = router;
