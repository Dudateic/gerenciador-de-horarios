const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Horario = sequelize.define("Horario", {
  disciplina: { type: DataTypes.TEXT, allowNull: false },
  periodo: { type: DataTypes.ENUM("Manhã", "Tarde", "Noite"), allowNull: false },
  diaSemana: { type: DataTypes.STRING, allowNull: true },
  horarioInicio: { type: DataTypes.TIME, allowNull: true },
  horarioFim: { type: DataTypes.TIME, allowNull: true },
});

module.exports = Horario;
