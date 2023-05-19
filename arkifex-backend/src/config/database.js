const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('arquifex', 'luisviteri', 'luisviteri', {
  server: 'localhost',
  dialect: 'mysql',
  // dialectModule: require('tedious')
  // Aun no se descomenta esto por lo que serviría cuando ya se ponga a producción con Azure
});

module.exports = sequelize;