const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('arkifex', 'sa', 'admin', {
  host: 'localhost',
  dialect: 'mssql'
});

module.exports = sequelize;
