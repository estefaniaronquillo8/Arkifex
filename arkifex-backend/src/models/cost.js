const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Resource } = require("./index");

const Cost = sequelize.define(
  "Cost",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { 
        model: Resource, 
        key: "id" 
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.ENUM("Diario", "Semanal", "Mensual", "Anual"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Activo", "Inactivo"),
      allowNull: false,
      defaultValue: "activo",
    },
  },
  {
    tableName: "Costs",
  }
);

module.exports = Cost;
