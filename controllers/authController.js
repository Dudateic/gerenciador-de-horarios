const crypto = require("crypto");
const Aluno = require("../models/Aluno");
const Admin = require("../models/Admin");
const { loginUser, logoutUser } = require("../middlewares/authMiddleware");
const { validarCodigoAdmin } = require("../utils/localAdminKey");

function redirectWithMsg(path, tipo, texto) {
  return `${path}?${tipo}=${encodeURIComponent(texto)}`;
}

function normalizarEmail(email) {
  return String(email || "").trim().toLowerCase();
}

exports.login = (req, res) => {
  res.render("login", { erro: req.query.erro, sucesso: req.query.sucesso });
};

exports.autenticar = async (req, res) => {
  const email = normalizarEmail(req.body.email);
  const senha = String(req.body.senha || "").trim();

  if (!email || !senha) {
    return res.redirect(redirectWithMsg("/", "erro", "Informe e-mail e senha."));
  }

  const admin = await Admin.findOne({ where: { email } });
  if (admin && admin.ativo !== false && senha === admin.senha) {
    loginUser(res, { id: admin.id, nome: admin.nome, email: admin.email, perfil: "admin" });
    return res.redirect("/admin/dashboard");
  }

  const aluno = await Aluno.findOne({ where: { email } });
  if (!aluno || aluno.ativo === false) {
    return res.redirect(redirectWithMsg("/", "erro", "E-mail ou senha inválidos."));
  }

  const senhaDoAluno = aluno.senha || aluno.matricula || "123456";
  if (senha !== senhaDoAluno) {
    return res.redirect(redirectWithMsg("/", "erro", "E-mail ou senha inválidos."));
  }

  loginUser(res, {
    id: aluno.id,
    nome: aluno.nome,
    email: aluno.email,
    perfil: "aluno",
  });
  return res.redirect("/aluno/vitrine");
};

exports.formCadastro = (req, res) => {
  res.render("cadastro", { erro: req.query.erro, sucesso: req.query.sucesso });
};

exports.cadastrar = async (req, res) => {
  const nome = String(req.body.nome || "").trim();
  const email = normalizarEmail(req.body.email);
  const senha = String(req.body.senha || "").trim();
  const confirmarSenha = String(req.body.confirmarSenha || "").trim();
  const perfil = String(req.body.perfil || "aluno").trim();
  const codigoAdmin = String(req.body.codigoAdmin || "").trim();
  const matricula = String(req.body.matricula || "").trim();
  const curso = String(req.body.curso || "Engenharia de Computação").trim();
  const semestre = String(req.body.semestre || "").trim();

  if (!nome || !email || !senha || !confirmarSenha) {
    return res.redirect(redirectWithMsg("/cadastro", "erro", "Preencha nome, e-mail e senha."));
  }

  if (senha.length < 6) {
    return res.redirect(redirectWithMsg("/cadastro", "erro", "A senha deve ter pelo menos 6 caracteres."));
  }

  if (senha !== confirmarSenha) {
    return res.redirect(redirectWithMsg("/cadastro", "erro", "As senhas não conferem."));
  }

  const alunoExistente = await Aluno.findOne({ where: { email } });
  const adminExistente = await Admin.findOne({ where: { email } });
  if (alunoExistente || adminExistente) {
    return res.redirect(redirectWithMsg("/cadastro", "erro", "Já existe um cadastro com esse e-mail."));
  }

  if (perfil === "admin") {
    if (!validarCodigoAdmin(codigoAdmin)) {
      return res.redirect(redirectWithMsg("/cadastro", "erro", "Código especial de administrador inválido."));
    }

    await Admin.create({ nome, email, senha, ativo: true });
    return res.redirect(redirectWithMsg("/", "sucesso", "Cadastro de administrador criado. Faça login."));
  }

  await Aluno.create({
    nome,
    email,
    senha,
    matricula: matricula || null,
    curso: curso || "Engenharia de Computação",
    semestre: semestre || null,
    ativo: true,
  });

  return res.redirect(redirectWithMsg("/", "sucesso", "Cadastro criado. Faça login."));
};

exports.logout = (req, res) => {
  logoutUser(res);
  res.redirect(redirectWithMsg("/", "sucesso", "Você saiu do sistema."));
};

exports.formRecuperarSenha = (req, res) => {
  res.render("recuperar-senha", {
    erro: req.query.erro,
    sucesso: req.query.sucesso,
    resetLink: req.query.resetLink,
  });
};

exports.enviarRecuperacao = async (req, res) => {
  const email = normalizarEmail(req.body.email);
  if (!email) return res.redirect(redirectWithMsg("/recuperar-senha", "erro", "Informe seu e-mail."));

  const aluno = await Aluno.findOne({ where: { email } });
  const admin = await Admin.findOne({ where: { email } });
  const usuario = aluno || admin;

  if (!usuario) {
    return res.redirect(
      redirectWithMsg("/recuperar-senha", "erro", "Nenhum cadastro foi encontrado com esse e-mail.")
    );
  }

  const token = crypto.randomBytes(24).toString("hex");
  await usuario.update({ resetToken: token });
  const resetLink = `/nova-senha/${token}`;
  return res.redirect(
    `/recuperar-senha?sucesso=${encodeURIComponent(
      "Link de recuperação gerado. Em produção, esse link seria enviado por e-mail."
    )}&resetLink=${encodeURIComponent(resetLink)}`
  );
};

exports.formNovaSenha = async (req, res) => {
  const aluno = await Aluno.findOne({ where: { resetToken: req.params.token } });
  const admin = await Admin.findOne({ where: { resetToken: req.params.token } });
  if (!aluno && !admin) return res.redirect(redirectWithMsg("/recuperar-senha", "erro", "Link inválido ou expirado."));
  res.render("nova-senha", { token: req.params.token, erro: req.query.erro });
};

exports.salvarNovaSenha = async (req, res) => {
  const { token } = req.params;
  const senha = String(req.body.senha || "").trim();
  const confirmarSenha = String(req.body.confirmarSenha || "").trim();

  if (senha.length < 6) {
    return res.redirect(redirectWithMsg(`/nova-senha/${token}`, "erro", "A senha deve ter pelo menos 6 caracteres."));
  }
  if (senha !== confirmarSenha) {
    return res.redirect(redirectWithMsg(`/nova-senha/${token}`, "erro", "As senhas não conferem."));
  }

  const aluno = await Aluno.findOne({ where: { resetToken: token } });
  const admin = await Admin.findOne({ where: { resetToken: token } });
  const usuario = aluno || admin;
  if (!usuario) return res.redirect(redirectWithMsg("/recuperar-senha", "erro", "Link inválido ou expirado."));

  await usuario.update({ senha, resetToken: null });
  return res.redirect(redirectWithMsg("/", "sucesso", "Senha alterada. Faça login com a nova senha."));
};
