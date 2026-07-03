const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Matricula = sequelize.define("Matricula", {
  alunoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },

  turmaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "ATIVA",
  },
});

module.exports = Matricula;
