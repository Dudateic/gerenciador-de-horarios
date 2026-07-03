const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Progresso = sequelize.define("Progresso", {
  alunoId: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  disciplinaId: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM("PENDENTE", "CURSANDO", "CONCLUIDA"),
    defaultValue: "PENDENTE",
  },
});

module.exports = Progresso;
