const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Turma = sequelize.define('Turma', {
  nome: { type: DataTypes.STRING, allowNull: false },
  disciplina: DataTypes.STRING,
  professor: DataTypes.STRING,
  sala: DataTypes.STRING,
  dias: DataTypes.STRING,
  horario: DataTypes.STRING,
  vagas: { type: DataTypes.INTEGER, defaultValue: 40 },
  vagasOcupadas: { type: DataTypes.INTEGER, defaultValue: 0 },
  ativa: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Turma;
