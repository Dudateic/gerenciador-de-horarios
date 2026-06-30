const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Matricula = sequelize.define('Matricula', {
  alunoId: DataTypes.INTEGER,
  turmaId: DataTypes.INTEGER,
  disciplinaId: DataTypes.INTEGER
});

module.exports = Matricula;
