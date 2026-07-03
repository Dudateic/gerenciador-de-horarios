const Disciplina = require("../models/Disciplina");
const Turma = require("../models/Turma");
const Matricula = require("../models/Matricula");
const Progresso = require("../models/Progresso");

const CARGA_MAXIMA = 28;

function getAlunoId(req) {
  return req.user?.id || 1;
}

function getAlunoView(req) {
  return { nome: req.user?.nome || "Aluno", email: req.user?.email || "" };
}

function redirectWithMsg(path, tipo, texto) {
  return `${path}?${tipo}=${encodeURIComponent(texto)}`;
}

function normalizarDias(dias) {
  if (!dias) return [];
  return String(dias)
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
}

function horarioParaMinutos(horario) {
  const [h, m] = String(horario || "00:00")
    .split(":")
    .map(Number);
  return (h || 0) * 60 + (m || 0);
}

function intervaloTurma(turma) {
  const partes = String(turma.horario || "").split(" - ");
  if (partes.length !== 2) return null;
  return { inicio: horarioParaMinutos(partes[0]), fim: horarioParaMinutos(partes[1]) };
}

function calcularCargaSemanal(turma) {
  const dias = normalizarDias(turma.dias).length || 1;
  const intervalo = intervaloTurma(turma);
  if (!intervalo) return dias * 2;
  return Math.round(Math.max((intervalo.fim - intervalo.inicio) / 60, 1) * dias);
}

function turmasConflitam(a, b) {
  const diasA = normalizarDias(a.dias);
  const diasB = normalizarDias(b.dias);
  if (!diasA.some((dia) => diasB.includes(dia))) return false;
  const ia = intervaloTurma(a);
  const ib = intervaloTurma(b);
  if (!ia || !ib) return false;
  return ia.inicio < ib.fim && ib.inicio < ia.fim;
}

async function buscarMatriculasAtivas(alunoId) {
  const matriculas = await Matricula.findAll({
    where: { alunoId, status: "ATIVA" },
    order: [["id", "DESC"]],
    raw: true,
  });

  const resultado = [];
  for (const matricula of matriculas) {
    const turma = await Turma.findByPk(matricula.turmaId);
    if (turma) resultado.push({ matricula, turma: turma.toJSON() });
  }
  return resultado;
}

exports.vitrine = async (req, res) => {
  const disciplinas = await Disciplina.findAll({ order: [["nome", "ASC"]] });
  const turmas = await Turma.findAll({ where: { ativa: true }, order: [["id", "DESC"]] });
  res.render("aluno/vitrine", { aluno: getAlunoView(req), disciplinas, turmas });
};

exports.cronograma = async (req, res) => {
  const matriculas = await buscarMatriculasAtivas(getAlunoId(req));
  const turmas = matriculas.map((m) => m.turma);
  const cargaSemanal = turmas.reduce((soma, turma) => soma + calcularCargaSemanal(turma), 0);
  res.render("aluno/cronograma", { aluno: getAlunoView(req), turmas, cargaSemanal });
};

exports.matriculas = async (req, res) => {
  const ofertas = await Turma.findAll({ where: { ativa: true }, order: [["disciplina", "ASC"]] });
  const matriculas = await buscarMatriculasAtivas(getAlunoId(req));
  const turmasMatriculadas = matriculas.map((m) => m.turma);
  const idsMatriculados = turmasMatriculadas.map((t) => t.id);
  const cargaAtual = turmasMatriculadas.reduce(
    (soma, turma) => soma + calcularCargaSemanal(turma),
    0
  );

  const turmas = [];
  for (const oferta of ofertas) {
    const turma = oferta.toJSON();
    const jaMatriculado = idsMatriculados.includes(turma.id);
    const conflito = turmasMatriculadas.some((t) => turmasConflitam(t, turma));
    const cargaTurma = calcularCargaSemanal(turma);
    const ultrapassaCarga = cargaAtual + cargaTurma > CARGA_MAXIMA;

    const disciplina = await Disciplina.findOne({
      where: { nome: turma.disciplina || turma.nome },
      include: ["prerequisito", "correquisito"],
    });

    let prerequisitoOk = true;
    let prerequisitoTexto = "-";
    if (disciplina && disciplina.prerequisitoId) {
      const progressoPre = await Progresso.findOne({
        where: { alunoId: getAlunoId(req), disciplinaId: disciplina.prerequisitoId, status: "CONCLUIDA" },
      });
      prerequisitoOk = Boolean(progressoPre);
      prerequisitoTexto = disciplina.prerequisito
        ? disciplina.prerequisito.nome
        : "Pré-requisito pendente";
    }

    const vagas = Number(turma.vagas || 0);
    const vagasOcupadas = Number(turma.vagasOcupadas || 0);
    const semVaga = vagas > 0 && vagasOcupadas >= vagas;

    let bloqueio = "";
    if (jaMatriculado) bloqueio = "Já adicionada";
    else if (conflito) bloqueio = "Choque de horário";
    else if (ultrapassaCarga) bloqueio = `Carga máxima (${CARGA_MAXIMA}h)`;
    else if (!prerequisitoOk) bloqueio = "Pré-requisito pendente";
    else if (semVaga) bloqueio = "Sem vagas";

    turmas.push({ ...turma, cargaTurma, prerequisitoTexto, podeAdicionar: !bloqueio, bloqueio });
  }

  res.render("aluno/matriculas", {
    aluno: getAlunoView(req),
    turmas,
    matriculas,
    cargaAtual,
    cargaMaxima: CARGA_MAXIMA,
    erro: req.query.erro,
    sucesso: req.query.sucesso,
  });
};

exports.adicionarMatricula = async (req, res) => {
  const { turmaId } = req.body;
  const turma = await Turma.findByPk(turmaId);

  if (!turma || !turma.ativa)
    return res.redirect(redirectWithMsg("/aluno/matriculas", "erro", "Turma indisponível."));

  const jaExiste = await Matricula.findOne({
    where: { alunoId: getAlunoId(req), turmaId, status: "ATIVA" },
  });
  if (jaExiste)
    return res.redirect(
      redirectWithMsg("/aluno/matriculas", "erro", "Você já adicionou essa turma.")
    );

  const matriculas = await buscarMatriculasAtivas(getAlunoId(req));
  const turmasMatriculadas = matriculas.map((m) => m.turma);
  const turmaJson = turma.toJSON();

  if (turmasMatriculadas.some((t) => turmasConflitam(t, turmaJson))) {
    return res.redirect(
      redirectWithMsg("/aluno/matriculas", "erro", "Essa turma possui choque de horário.")
    );
  }

  const cargaAtual = turmasMatriculadas.reduce((soma, t) => soma + calcularCargaSemanal(t), 0);
  if (cargaAtual + calcularCargaSemanal(turmaJson) > CARGA_MAXIMA) {
    return res.redirect(
      redirectWithMsg(
        "/aluno/matriculas",
        "erro",
        `Carga máxima ultrapassada. Limite: ${CARGA_MAXIMA}h semanais.`
      )
    );
  }

  const vagas = Number(turma.vagas || 0);
  const vagasOcupadas = Number(turma.vagasOcupadas || 0);
  if (vagas > 0 && vagasOcupadas >= vagas) {
    return res.redirect(redirectWithMsg("/aluno/matriculas", "erro", "Essa turma está sem vagas."));
  }

  const disciplina = await Disciplina.findOne({
    where: { nome: turma.disciplina || turma.nome },
    include: ["prerequisito", "correquisito"],
  });

  if (disciplina && disciplina.prerequisitoId) {
    const progressoPre = await Progresso.findOne({
      where: { alunoId: getAlunoId(req), disciplinaId: disciplina.prerequisitoId, status: "CONCLUIDA" },
    });
    if (!progressoPre) {
      return res.redirect(
        redirectWithMsg(
          "/aluno/matriculas",
          "erro",
          "Você ainda não concluiu o pré-requisito dessa disciplina."
        )
      );
    }
  }

  await Matricula.create({ alunoId: getAlunoId(req), turmaId, status: "ATIVA" });
  await Turma.update({ vagasOcupadas: vagasOcupadas + 1 }, { where: { id: turmaId } });

  return res.redirect(
    redirectWithMsg("/aluno/matriculas", "sucesso", "Turma adicionada à sua grade.")
  );
};

exports.removerMatricula = async (req, res) => {
  const matricula = await Matricula.findOne({
    where: { id: req.params.id, alunoId: getAlunoId(req), status: "ATIVA" },
  });

  if (!matricula)
    return res.redirect(redirectWithMsg("/aluno/matriculas", "erro", "Matrícula não encontrada."));

  const turma = await Turma.findByPk(matricula.turmaId);
  await matricula.update({ status: "CANCELADA" });

  if (turma) {
    await Turma.update(
      { vagasOcupadas: Math.max(Number(turma.vagasOcupadas || 0) - 1, 0) },
      { where: { id: turma.id } }
    );
  }

  return res.redirect(
    redirectWithMsg("/aluno/matriculas", "sucesso", "Turma removida da sua grade.")
  );
};

exports.fluxograma = async (req, res) => {
  const disciplinas = await Disciplina.findAll({
    include: ["prerequisito", "correquisito"],
    order: [
      ["semestre", "ASC"],
      ["nome", "ASC"],
    ],
  });

  const progressos = await Progresso.findAll({ where: { alunoId: getAlunoId(req) }, raw: true });
  const progressoMap = {};
  progressos.forEach((p) => {
    progressoMap[p.disciplinaId] = p.status;
  });

  const disciplinasFormatadas = disciplinas.map((disciplina) => {
    const d = disciplina.toJSON();
    const status = progressoMap[d.id] || "PENDENTE";
    const preStatus = d.prerequisitoId ? progressoMap[d.prerequisitoId] : "CONCLUIDA";
    const podeCursar = !d.prerequisitoId || preStatus === "CONCLUIDA";
    return { ...d, status, podeCursar };
  });

  res.render("aluno/fluxograma", {
    aluno: getAlunoView(req),
    disciplinas: disciplinasFormatadas,
    resumo: {
      total: disciplinasFormatadas.length,
      concluidas: disciplinasFormatadas.filter((d) => d.status === "CONCLUIDA").length,
      cursando: disciplinasFormatadas.filter((d) => d.status === "CURSANDO").length,
      pendentes: disciplinasFormatadas.filter((d) => d.status === "PENDENTE").length,
    },
  });
};

exports.atualizarStatus = async (req, res) => {
  const { disciplinaId, status } = req.body;
  const registro = await Progresso.findOne({ where: { alunoId: getAlunoId(req), disciplinaId } });

  if (registro) await registro.update({ status });
  else await Progresso.create({ alunoId: getAlunoId(req), disciplinaId, status });

  res.redirect("/aluno/fluxograma");
};


exports.grades = async (req, res) => {
  const matriculas = await buscarMatriculasAtivas(getAlunoId(req));
  const turmas = matriculas.map((m) => m.turma);
  const dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const horarios = ["07:30 - 09:10", "09:20 - 11:00", "13:30 - 15:10", "15:20 - 17:00", "18:30 - 20:10", "20:20 - 22:00"];
  const cargaSemanal = turmas.reduce((soma, turma) => soma + calcularCargaSemanal(turma), 0);
  const horarios = [
    "07:30 - 09:30",
    "09:30 - 11:30",
    "11:30 - 12:30",
    "13:30 - 15:30",
    "15:30 - 17:30",
    "17:30 - 18:30",
    "19:00 - 21:00",
    "21:00 - 23:00",
  ];

  res.render("aluno/grades", {
    aluno: getAlunoView(req),
    turmas,
    dias,
    horarios,
    cargaSemanal,
    totalTurmas: turmas.length,
  });
};

exports.financeiro = async (req, res) => {
  const matriculas = await buscarMatriculasAtivas(getAlunoId(req));
  const qtd = matriculas.length;
  const mensalidadeBase = 0;
  const custos = [
    { item: "Matrícula acadêmica", valor: mensalidadeBase, status: "Isento" },
    { item: "Materiais e impressões", valor: qtd * 18, status: "Previsto" },
    { item: "Transporte estimado", valor: qtd * 40, status: "Previsto" },
    { item: "Alimentação estimada", valor: qtd * 30, status: "Previsto" },
  ];
  const total = custos.reduce((soma, c) => soma + c.valor, 0);

  res.render("aluno/financeiro", {
    aluno: getAlunoView(req),
    custos,
    total,
    qtdTurmas: qtd,
  });
};

