const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Professor = sequelize.define("Professor", {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
  area: { type: DataTypes.STRING, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  disciplinas: { type: DataTypes.STRING, allowNull: true },
  cargaSemanal: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Professor;
