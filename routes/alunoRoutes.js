const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

router.get('/vitrine', alunoController.vitrine);

module.exports = router;
