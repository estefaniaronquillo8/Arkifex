// project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ReportResources = sequelize.define("Resource", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
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

module.exports = ReportResources;
