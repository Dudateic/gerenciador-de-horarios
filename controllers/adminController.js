const { fn, col } = require('sequelize');
const Aluno = require('../models/Aluno');
const Professor = require('../models/Professor');
const Turma = require('../models/Turma');
const Disciplina = require('../models/Disciplina');
const Matricula = require('../models/Matricula');
const Horario = require('../models/Horario');

exports.dashboard = async (req, res) => {
  const totalAlunos = await Aluno.count();
  const professoresAtivos = await Professor.count({ where: { ativo: true } });
  const turmasAtivas = await Turma.count({ where: { ativa: true } });
  const disciplinasCadastradas = await Disciplina.count();
  const matriculasRealizadas = await Matricula.count();
  const totalHorarios = await Horario.count();

  const periodosRaw = await Horario.findAll({
    attributes: ['periodo', [fn('COUNT', col('periodo')), 'total']],
    group: ['periodo'],
    raw: true
  });

  const distribuicaoPeriodo = periodosRaw.map((item, index) => ({
    periodo: item.periodo,
    total: Number(item.total),
    porcentagem: totalHorarios > 0 ? Math.round((Number(item.total) / totalHorarios) * 100) : 0,
    cor: ['blue', 'orange', 'purple'][index % 3]
  }));

  res.render('admin/dashboard', {
    dashboard: {
      semestre: '2026.1',
      totalAlunos,
      professoresAtivos,
      turmasAtivas,
      disciplinasCadastradas,
      materiasDisponiveis: disciplinasCadastradas,
      ofertasAtivas: turmasAtivas,
      matriculasRealizadas,
      distribuicaoPeriodo
    }
  });
};

exports.formNovaDisciplina = (req, res) => res.render('admin/nova-disciplina');

exports.criarDisciplina = async (req, res) => {
  const { nome, codigo, semestre, coordenador, prerequisito } = req.body;
  await Disciplina.create({ nome, codigo, semestre, coordenador, prerequisito });
  res.redirect('/admin/dashboard');
};

exports.listarTurmas = async (req, res) => {
  const turmas = await Turma.findAll({ order: [['id', 'DESC']] });
  res.render('admin/relatorios-turmas', { turmas });
};

exports.formEditarTurma = async (req, res) => {
  const turma = await Turma.findByPk(req.params.id);
  if (!turma) return res.redirect('/admin/relatorios/turmas');
  res.render('admin/editar-turma', { turma });
};

exports.editarTurma = async (req, res) => {
  const { nome, disciplina, professor, sala, dias, horario, vagas, vagasOcupadas, ativa } = req.body;
  await Turma.update({ nome, disciplina, professor, sala, dias, horario, vagas, vagasOcupadas, ativa: ativa === 'on' }, { where: { id: req.params.id } });
  res.redirect('/admin/relatorios/turmas');
};

exports.excluirTurma = async (req, res) => {
  await Turma.destroy({ where: { id: req.params.id } });
  res.redirect('/admin/relatorios/turmas');
};
