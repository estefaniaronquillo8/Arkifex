const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER_DB, process.env.PASSWORD_DB, {
  server: process.env.HOST_DB,
  dialect: 'mssql'
  // dialectModule: require('tedious')
  // Aun no se descomenta esto por lo que serviría cuando ya se ponga a producción con Azure
});

module.exports = sequelize;