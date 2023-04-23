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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM('kg', 'm²', 'horas'),
      allowNull: false,
    },
    costPerUnit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'Resources',
  }
);

module.exports = Resource;
