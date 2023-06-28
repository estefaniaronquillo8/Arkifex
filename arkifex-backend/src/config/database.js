const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER_DB, process.env.PASSWORD_DB, {
  server: process.env.HOST_DB,
  dialect: process.env.DIALECT_DB,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    options: {
      requestTimeout: 300000 // timeout = 30 seconds
    }
  },
  //dialectModule: require('tedious')
  // Aun no se descomenta esto por lo que serviría cuando ya se ponga a producción con Azure
});

module.exports = sequelize;