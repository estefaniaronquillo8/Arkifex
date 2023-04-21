const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ResourceAssignment = sequelize.define("ResourceAssignment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resourceId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Resources",
      key: "id",
    },
  },
  projectId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Projects",
      key: "id",
    },
  },
  quantity: DataTypes.INTEGER,
});

module.exports = ResourceAssignment;
