exports.login = (req, res) => res.render('login');

exports.autenticar = (req, res) => {
  const { perfil } = req.body;
  if (perfil === 'admin') return res.redirect('/admin/dashboard');
  if (perfil === 'aluno') return res.redirect('/aluno/vitrine');
  return res.redirect('/');
};
