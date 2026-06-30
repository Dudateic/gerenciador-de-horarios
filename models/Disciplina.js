const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Disciplina = sequelize.define('Disciplina', {
  nome: { type: DataTypes.STRING, allowNull: false },
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  semestre: { type: DataTypes.STRING, allowNull: false },
  coordenador: DataTypes.STRING,
  prerequisito: DataTypes.STRING
});

module.exports = Disciplina;
