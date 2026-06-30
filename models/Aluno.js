const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aluno = sequelize.define('Aluno', {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: DataTypes.STRING,
  semestre: DataTypes.STRING,
  matricula: DataTypes.STRING
});

module.exports = Aluno;
