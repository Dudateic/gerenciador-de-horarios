const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Horario = sequelize.define('Horario', {
  disciplina: { type: DataTypes.STRING, allowNull: false },
  periodo: { type: DataTypes.ENUM('Manhã', 'Tarde', 'Noite'), allowNull: false },
  diaSemana: DataTypes.STRING,
  horarioInicio: DataTypes.TIME,
  horarioFim: DataTypes.TIME
});

module.exports = Horario;
