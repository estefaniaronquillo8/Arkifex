// ProjectPlanning.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project } = require("./index");

const ProjectPlanning = sequelize.define("ProjectPlanning", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: "id",
    },
  },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  estimatedBudget: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = ProjectPlanning;