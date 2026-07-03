const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Disciplina = sequelize.define("Disciplina", {
  nome: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  // String para aceitar tanto "1", "2" quanto "2026.2" vindos do seed.
  semestre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  cargaHoraria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 60,
  },

  coordenador: {
    type: DataTypes.TEXT,
    allowNull: true,
  },


  prerequisitoTexto: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  correquisitoTexto: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  prerequisitoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  correquisitoId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Disciplina.belongsTo(Disciplina, {
  as: "prerequisito",
  foreignKey: "prerequisitoId",
  constraints: false,
});

Disciplina.belongsTo(Disciplina, {
  as: "correquisito",
  foreignKey: "correquisitoId",
  constraints: false,
});

module.exports = Disciplina;
