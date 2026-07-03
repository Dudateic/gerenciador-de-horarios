const { fn, col, Op } = require("sequelize");
const Aluno = require("../models/Aluno");
const Professor = require("../models/Professor");
const Turma = require("../models/Turma");
const Disciplina = require("../models/Disciplina");
const Matricula = require("../models/Matricula");
const Horario = require("../models/Horario");

function redirectWithMsg(path, tipo, texto) {
  return `${path}?${tipo}=${encodeURIComponent(texto)}`;
}

function getPeriodo(horario) {
  if (!horario) return "Não informado";
  const hora = Number(String(horario).split(":")[0]);
  if (Number.isNaN(hora)) return "Não informado";
  if (hora < 12) return "Manhã";
  if (hora < 18) return "Tarde";
  return "Noite";
}

function horasDaTurma(turma) {
  const dias = turma.dias ? turma.dias.split(",").length : 1;
  const partes = String(turma.horario || "").split(" - ");
  if (partes.length !== 2) return dias * 2;
  const [iniH, iniM] = partes[0].split(":").map(Number);
  const [fimH, fimM] = partes[1].split(":").map(Number);
  const inicio = iniH + (iniM || 0) / 60;
  const fim = fimH + (fimM || 0) / 60;
  const duracao = Math.max(fim - inicio, 1);
  return Math.round(duracao * dias);
}

exports.dashboard = async (req, res) => {
  const totalAlunos = await Aluno.count();
  const professoresAtivos = await Professor.count({ where: { ativo: true } });
  const turmasAtivas = await Turma.count({ where: { ativa: true } });
  const disciplinasCadastradas = await Disciplina.count();
  const matriculasRealizadas = await Matricula.count();

  const turmas = await Turma.findAll({ raw: true });
  const periodos = { Manhã: 0, Tarde: 0, Noite: 0 };
  turmas.forEach((turma) => {
    const inicio = String(turma.horario || "").split(" - ")[0];
    const periodo = getPeriodo(inicio);
    if (periodos[periodo] !== undefined) periodos[periodo] += 1;
  });
  const totalPeriodos = Object.values(periodos).reduce((a, b) => a + b, 0);
  const cores = { Manhã: "blue", Tarde: "orange", Noite: "purple" };
  const distribuicaoPeriodo = Object.entries(periodos).map(([periodo, total]) => ({
    periodo,
    total,
    porcentagem: totalPeriodos > 0 ? Math.round((total / totalPeriodos) * 100) : 0,
    cor: cores[periodo],
  }));

  res.render("admin/dashboard", {
    dashboard: {
      semestre: "2026.1",
      totalAlunos,
      professoresAtivos,
      turmasAtivas,
      disciplinasCadastradas,
      materiasDisponiveis: disciplinasCadastradas,
      ofertasAtivas: turmasAtivas,
      matriculasRealizadas,
      distribuicaoPeriodo,
    },
  });
};

exports.professores = async (req, res) => {
  const professores = await Professor.findAll({ order: [["nome", "ASC"]] });
  res.render("admin/professores", {
    professores,
    erro: req.query.erro,
    sucesso: req.query.sucesso,
  });
};

exports.criarProfessor = async (req, res) => {
  const { nome, email, area, disciplinas, cargaSemanal } = req.body;
  if (!nome || nome.trim().length < 3)
    return res.redirect(
      redirectWithMsg("/admin/professores", "erro", "Informe o nome do professor.")
    );
  await Professor.create({
    nome,
    email: email || null,
    area,
    disciplinas,
    cargaSemanal: cargaSemanal || 0,
    ativo: true,
  });
  res.redirect(
    redirectWithMsg("/admin/professores", "sucesso", "Professor cadastrado com sucesso.")
  );
};

exports.formEditarProfessor = async (req, res) => {
  const professor = await Professor.findByPk(req.params.id);
  if (!professor)
    return res.redirect(redirectWithMsg("/admin/professores", "erro", "Professor não encontrado."));
  res.render("admin/editar-professor", { professor, erro: req.query.erro });
};

exports.editarProfessor = async (req, res) => {
  const { nome, email, area, disciplinas, cargaSemanal, ativo } = req.body;
  if (!nome || nome.trim().length < 3)
    return res.redirect(
      redirectWithMsg(
        `/admin/professores/${req.params.id}/editar`,
        "erro",
        "Informe o nome do professor."
      )
    );
  await Professor.update(
    {
      nome,
      email: email || null,
      area,
      disciplinas,
      cargaSemanal: cargaSemanal || 0,
      ativo: ativo === "on",
    },
    { where: { id: req.params.id } }
  );
  res.redirect(redirectWithMsg("/admin/professores", "sucesso", "Professor atualizado."));
};

exports.excluirProfessor = async (req, res) => {
  await Professor.destroy({ where: { id: req.params.id } });
  res.redirect(redirectWithMsg("/admin/professores", "sucesso", "Professor excluído."));
};

exports.estudantes = async (req, res) => {
  const alunos = await Aluno.findAll({
    order: [["id", "DESC"]],
  });

  res.render("admin/estudantes", { alunos, erro: req.query.erro, sucesso: req.query.sucesso });
};

exports.criarEstudante = async (req, res) => {
  const { nome, matricula, email, semestre, senha } = req.body;
  if (!nome || nome.trim().length < 3)
    return res.redirect(
      redirectWithMsg("/admin/estudantes", "erro", "Informe o nome do estudante.")
    );
  await Aluno.create({
    nome,
    matricula: matricula || null,
    email: email || null,
    semestre,
    senha: senha || matricula || "123456",
    curso: "Engenharia de Computação",
    ativo: true,
  });
  res.redirect(
    redirectWithMsg("/admin/estudantes", "sucesso", "Estudante cadastrado com sucesso.")
  );
};

exports.formEditarEstudante = async (req, res) => {
  const aluno = await Aluno.findByPk(req.params.id);
  if (!aluno)
    return res.redirect(redirectWithMsg("/admin/estudantes", "erro", "Estudante não encontrado."));
  res.render("admin/editar-estudante", { aluno, erro: req.query.erro });
};

exports.editarEstudante = async (req, res) => {
  const { nome, matricula, email, semestre, senha, ativo } = req.body;
  if (!nome || nome.trim().length < 3)
    return res.redirect(
      redirectWithMsg(
        `/admin/estudantes/${req.params.id}/editar`,
        "erro",
        "Informe o nome do estudante."
      )
    );
  await Aluno.update(
    { nome, matricula: matricula || null, email: email || null, semestre, senha: senha || undefined, ativo: ativo === "on" },
    { where: { id: req.params.id } }
  );
  res.redirect(redirectWithMsg("/admin/estudantes", "sucesso", "Estudante atualizado."));
};

exports.excluirEstudante = async (req, res) => {
  await Aluno.destroy({
    where: { id: req.params.id },
  });

  res.redirect(redirectWithMsg("/admin/estudantes", "sucesso", "Estudante excluído."));
};

exports.disciplinasTurmas = async (req, res) => {
  const disciplinas = await Disciplina.findAll({
    include: ["prerequisito", "correquisito"],
    order: [
      ["semestre", "ASC"],
      ["nome", "ASC"],
    ],
  });

  const professores = await Professor.findAll({
    where: { ativo: true },
    order: [["nome", "ASC"]],
  });

  const turmas = await Turma.findAll({
    order: [["id", "DESC"]],
  });

  res.render("admin/disciplinas-turmas", {
    disciplinas,
    professores,
    turmas,
  });
};

exports.criarDisciplina = async (req, res) => {
  try {
    const { nome, codigo, semestre, cargaHoraria, coordenador, prerequisitoId, correquisitoId } = req.body;

    if (!nome || !codigo || !semestre) {
      return res.redirect(
        redirectWithMsg("/admin/disciplinas-turmas", "erro", "Preencha nome, código e semestre da disciplina.")
      );
    }

    await Disciplina.create({
      nome: String(nome).trim(),
      codigo: String(codigo).trim().toUpperCase(),
      semestre: String(semestre).trim(),
      cargaHoraria: Number(cargaHoraria) || 60,
      coordenador: coordenador || null,
      prerequisitoId: prerequisitoId || null,
      correquisitoId: correquisitoId || null,
    });

    res.redirect(redirectWithMsg("/admin/disciplinas-turmas", "sucesso", "Disciplina cadastrada."));
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    res.redirect(redirectWithMsg("/admin/disciplinas-turmas", "erro", "Erro ao cadastrar disciplina. Verifique se o código já existe."));
  }
};

exports.criarTurma = async (req, res) => {
  const { disciplina, professor, cor, dias, sala, vagas, horarioInicio, horarioFim } = req.body;
  if (!disciplina || !professor || !dias || !horarioInicio || !horarioFim) {
    return res.redirect(
      redirectWithMsg(
        "/admin/disciplinas-turmas",
        "erro",
        "Preencha disciplina, professor, dias e horários."
      )
    );
  }
  await Turma.create({
    nome: disciplina,
    disciplina,
    professor,
    cor,
    dias: Array.isArray(dias) ? dias.join(", ") : dias,
    sala,
    vagas: vagas || 0,
    vagasOcupadas: 0,
    horario: `${horarioInicio} - ${horarioFim}`,
    ativa: true,
  });
  res.redirect(redirectWithMsg("/admin/disciplinas-turmas", "sucesso", "Turma cadastrada."));
};

exports.listarTurmas = async (req, res) => {
  const turmas = await Turma.findAll({ order: [["id", "DESC"]] });
  res.render("admin/relatorios-turmas", {
    turmas,
    sucesso: req.query.sucesso,
    erro: req.query.erro,
  });
};

exports.formEditarTurma = async (req, res) => {
  const turma = await Turma.findByPk(req.params.id);
  if (!turma) {
    return res.redirect(
      redirectWithMsg("/admin/disciplinas-turmas", "erro", "Turma não encontrada.")
    );
  }

  res.render("admin/editar-turma", {
    turma,
    origem: req.query.origem || "disciplinas-turmas",
    erro: req.query.erro,
  });
};

exports.editarTurma = async (req, res) => {
  try {
    const { nome, disciplina, professor, sala, dias, horario, vagas, vagasOcupadas, ativa, origem } = req.body;
    const destino = origem === "relatorios" ? "/admin/relatorios/turmas" : "/admin/disciplinas-turmas";

    if (!nome || !disciplina || !professor || !dias || !horario) {
      return res.redirect(
        redirectWithMsg(`/admin/turmas/${req.params.id}/editar`, "erro", "Preencha nome, disciplina, professor, dias e horário.")
      );
    }

    await Turma.update(
      {
        nome: String(nome).trim(),
        disciplina: String(disciplina).trim(),
        professor: String(professor).trim(),
        sala: sala || null,
        dias,
        horario,
        vagas: Number(vagas) || 0,
        vagasOcupadas: Number(vagasOcupadas) || 0,
        ativa: ativa === "on",
      },
      { where: { id: req.params.id } }
    );

    res.redirect(redirectWithMsg(destino, "sucesso", "Turma atualizada."));
  } catch (error) {
    console.error("Erro ao editar turma:", error);
    res.redirect(redirectWithMsg(`/admin/turmas/${req.params.id}/editar`, "erro", "Erro ao atualizar turma."));
  }
};

exports.relatorioCargaDocente = async (req, res) => {
  const professores = await Professor.findAll({ order: [["nome", "ASC"]] });
  const turmas = await Turma.findAll({ where: { ativa: true }, order: [["professor", "ASC"]] });
  const linhas = professores.map((professor) => {
    const turmasProfessor = turmas.filter((turma) => turma.professor === professor.nome);
    return {
      nome: professor.nome,
      disciplinas: turmasProfessor.map((t) => t.disciplina || t.nome).join(", ") || "-",
      cargaSemanal: turmasProfessor.reduce((soma, turma) => soma + horasDaTurma(turma), 0),
    };
  });
  res.render("admin/carga-docente", { professores: linhas });
};

exports.configuracoes = (req, res) => {
  res.render("admin/configuracoes");
};

exports.formEditarDisciplina = async (req, res) => {
  const disciplina = await Disciplina.findByPk(req.params.id, {
    include: ["prerequisito", "correquisito"],
  });

  if (!disciplina) {
    return res.redirect(
      redirectWithMsg("/admin/disciplinas-turmas", "erro", "Disciplina não encontrada.")
    );
  }

  const disciplinas = await Disciplina.findAll({
    where: {
      id: { [Op.ne]: req.params.id },
    },
    order: [["nome", "ASC"]],
  });

  res.render("admin/editar-disciplina", {
    disciplina,
    disciplinas,
    erro: req.query.erro,
  });
};

exports.editarDisciplina = async (req, res) => {
  try {
    const { nome, codigo, semestre, cargaHoraria, coordenador, prerequisitoId, correquisitoId } = req.body;

    if (!nome || !codigo || !semestre) {
      return res.redirect(
        redirectWithMsg(`/admin/disciplinas/${req.params.id}/editar`, "erro", "Preencha nome, código e semestre.")
      );
    }

    await Disciplina.update(
      {
        nome: String(nome).trim(),
        codigo: String(codigo).trim().toUpperCase(),
        semestre: String(semestre).trim(),
        cargaHoraria: Number(cargaHoraria) || 60,
        coordenador: coordenador || null,
        prerequisitoId: prerequisitoId || null,
        correquisitoId: correquisitoId || null,
      },
      { where: { id: req.params.id } }
    );

    res.redirect(
      redirectWithMsg("/admin/disciplinas-turmas", "sucesso", "Disciplina atualizada.")
    );
  } catch (error) {
    console.error("Erro ao editar disciplina:", error);
    res.redirect(
      redirectWithMsg(`/admin/disciplinas/${req.params.id}/editar`, "erro", "Erro ao atualizar disciplina. Verifique se o código já existe.")
    );
  }
};


exports.excluirDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findByPk(req.params.id);
    if (!disciplina) {
      return res.redirect(
        redirectWithMsg("/admin/disciplinas-turmas", "erro", "Disciplina não encontrada.")
      );
    }

    await Disciplina.update(
      { prerequisitoId: null },
      { where: { prerequisitoId: req.params.id } }
    );
    await Disciplina.update(
      { correquisitoId: null },
      { where: { correquisitoId: req.params.id } }
    );
    await Turma.destroy({ where: { disciplina: disciplina.nome } });
    await Disciplina.destroy({ where: { id: req.params.id } });

    res.redirect(
      redirectWithMsg("/admin/disciplinas-turmas", "sucesso", "Disciplina excluída.")
    );
  } catch (error) {
    console.error("Erro ao excluir disciplina:", error);
    res.redirect(
      redirectWithMsg("/admin/disciplinas-turmas", "erro", "Erro ao excluir disciplina.")
    );
  }
};

exports.excluirTurma = async (req, res) => {
  const destino = req.originalUrl.includes("/relatorios/")
    ? "/admin/relatorios/turmas"
    : "/admin/disciplinas-turmas";

  try {
    await Turma.destroy({
      where: { id: req.params.id },
    });

    res.redirect(
      redirectWithMsg(destino, "sucesso", "Turma excluída.")
    );
  } catch (error) {
    console.error("Erro ao excluir turma:", error);
    res.redirect(
      redirectWithMsg(destino, "erro", "Erro ao excluir turma.")
    );
  }
};