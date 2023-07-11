// project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project, Report } = require("./index");

const DetailReport = sequelize.define("DetailReport", {
  detailReportId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  projectPlanningId:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  isProjectPlanning:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  projectPlanningName:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  resourceName:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  resourceType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  actualUnitaryCost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  estimatedUnitaryCost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  actualTotalCost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  estimatedTotalCost: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  countOfResources: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  totalCostVariance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  unitaryCostVariance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timeVariance: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },  
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = DetailReport;
