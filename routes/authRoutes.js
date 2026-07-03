const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/", authController.login);
router.post("/login", authController.autenticar);
router.get("/cadastro", authController.formCadastro);
router.post("/cadastro", authController.cadastrar);
router.post("/logout", authController.logout);
router.get("/recuperar-senha", authController.formRecuperarSenha);
router.post("/recuperar-senha", authController.enviarRecuperacao);
router.get("/nova-senha/:token", authController.formNovaSenha);
router.post("/nova-senha/:token", authController.salvarNovaSenha);

module.exports = router;
