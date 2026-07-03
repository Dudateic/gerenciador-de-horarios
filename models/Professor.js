const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Professor = sequelize.define("Professor", {
  nome: { type: DataTypes.TEXT, allowNull: false },
  email: { type: DataTypes.TEXT, allowNull: true },
  area: { type: DataTypes.STRING, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  disciplinas: { type: DataTypes.TEXT, allowNull: true },
  cargaSemanal: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Professor;
