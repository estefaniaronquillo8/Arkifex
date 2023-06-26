const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Project } = require("./project");

const Location = sequelize.define("Location", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: "id",
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  area: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  polygon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Location;