const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Turma = sequelize.define("Turma", {
  nome: { type: DataTypes.TEXT, allowNull: false },
  disciplina: { type: DataTypes.TEXT, allowNull: false },
  professor: { type: DataTypes.TEXT, allowNull: false },
  cor: { type: DataTypes.STRING, defaultValue: "#2563eb" },
  dias: { type: DataTypes.TEXT, allowNull: false },
  horario: { type: DataTypes.TEXT, allowNull: false },
  sala: { type: DataTypes.TEXT, allowNull: true },
  vagas: { type: DataTypes.INTEGER, defaultValue: 0 },
  vagasOcupadas: { type: DataTypes.INTEGER, defaultValue: 0 },
  ativa: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Turma;
