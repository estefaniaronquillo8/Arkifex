// project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project, User } = require("./index");

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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  /* archivo: {
      type: ,
      allowNull: false,
    }, */
});

module.exports = Report;
