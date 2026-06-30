const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Professor = sequelize.define('Professor', {
  nome: { type: DataTypes.STRING, allowNull: false },
  departamento: DataTypes.STRING,
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Professor;
