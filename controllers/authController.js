exports.login = (req, res) => {
  res.render("login", { erro: req.query.erro });
};

exports.autenticar = (req, res) => {
  const { perfil } = req.body;

  if (perfil === "admin") return res.redirect("/admin/dashboard");
  if (perfil === "aluno") return res.redirect("/aluno/vitrine");

  return res.redirect("/?erro=Selecione um perfil válido");
};
