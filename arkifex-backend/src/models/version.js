// project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project } = require("./project");
const { User } = require("./user");

const Version = sequelize.define("Version", {
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
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  workload: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timeInDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  versionDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = Version;
