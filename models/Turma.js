const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Turma = sequelize.define("Turma", {
  nome: { type: DataTypes.STRING, allowNull: false },
  disciplina: { type: DataTypes.STRING, allowNull: false },
  professor: { type: DataTypes.STRING, allowNull: false },
  cor: { type: DataTypes.STRING, defaultValue: "#2563eb" },
  dias: { type: DataTypes.STRING, allowNull: false },
  horario: { type: DataTypes.STRING, allowNull: false },
  sala: { type: DataTypes.STRING, allowNull: true },
  vagas: { type: DataTypes.INTEGER, defaultValue: 0 },
  vagasOcupadas: { type: DataTypes.INTEGER, defaultValue: 0 },
  ativa: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Turma;
