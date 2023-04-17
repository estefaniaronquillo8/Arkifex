const { Sequelize } = require('sequelize');

console.log(
  process.env.DATABASE, process.env.USER_DB, process.env.PASSWORD_DB, process.env.HOST_DB
)

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER_DB, process.env.PASSWORD_DB, {
  server: process.env.HOST_DB,
  dialect: 'mssql'
});

module.exports = sequelize;