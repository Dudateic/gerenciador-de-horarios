const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Aluno = sequelize.define("Aluno", {
  nome: { type: DataTypes.STRING, allowNull: false },
  matricula: { type: DataTypes.STRING, allowNull: true, unique: true },
  email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
  curso: { type: DataTypes.STRING, defaultValue: "Engenharia de Computação" },
  semestre: { type: DataTypes.STRING, allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Aluno;
