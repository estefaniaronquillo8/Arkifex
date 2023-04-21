// report.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Report = sequelize.define('Report', {
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
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  date: DataTypes.DATE
});

module.exports = Report;
