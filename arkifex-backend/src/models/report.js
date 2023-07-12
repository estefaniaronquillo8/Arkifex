// project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project } = require("./project");
const { User } = require("./user");

const Report = sequelize.define("Report", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
  },
  actualBudget: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  estimatedBudget: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  numberOfTasks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  taskCompleted:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  budgetVariance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timeVariance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },  
  latePlanningRatio: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Report;
