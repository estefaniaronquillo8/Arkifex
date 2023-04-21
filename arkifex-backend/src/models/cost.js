const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cost = sequelize.define(
  'Cost',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    resourceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      type: DataTypes.ENUM('Daily', 'Weekly', 'Monthly', 'Annually'),
      allowNull: false,
    },
  },
  {
    tableName: 'costs',
  }
);

module.exports = Cost;
