const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project, Resource } = require("./index");

const ResourceAssignment = sequelize.define("ResourceAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Resource,
      key: "id",
    },
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: "id",
    },
  },
  quantity: { type: DataTypes.INTEGER, allowNull: false},
});

module.exports = ResourceAssignment;
