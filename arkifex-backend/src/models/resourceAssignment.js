// project.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project, Resource } = require("./index");

const ResourceAssignment = sequelize.define("ResourceAssignment", {
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
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resource,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  estimatedCost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  actualCost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  associatedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = ResourceAssignment;
