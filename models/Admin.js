const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define("Admin", {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  senha: { type: DataTypes.STRING, allowNull: false },
  ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
  resetToken: { type: DataTypes.STRING, allowNull: true },
});

module.exports = Admin;
