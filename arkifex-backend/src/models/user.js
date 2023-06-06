// user.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Role } = require("./index");

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: false },
  lastname: { type: DataTypes.STRING, unique: false },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  roleId: { type: DataTypes.INTEGER, references: { model: Role, key: "id" } },
});

module.exports = User;