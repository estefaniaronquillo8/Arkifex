// project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Resource = sequelize.define("Resource", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  marketPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Resource;
