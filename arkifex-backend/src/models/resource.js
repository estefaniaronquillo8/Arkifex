const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define(
  'Resource',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Material', 'Personal'),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM('kg', 'm²', 'hours'),
      allowNull: false,
    },
    costPerUnit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'resources',
  }
);

module.exports = Resource;
