// InitialPlanning.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InitialPlanning = sequelize.define('InitialPlanning', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Projects',
        key: 'id'
      }
    },
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    estimatedBudget: DataTypes.FLOAT
  });

  module.exports = InitialPlanning;