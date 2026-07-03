const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Disciplina = sequelize.define("Disciplina", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  semestre: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  coordenador: {
    type: DataTypes.STRING,
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
});

Disciplina.belongsTo(Disciplina, {
  as: "correquisito",
  foreignKey: "correquisitoId",
});

module.exports = Disciplina;
