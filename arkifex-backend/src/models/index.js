const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const models = {
  User: require('./User'),
  Role: require('./Role'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

sequelize.sync();

module.exports = {
  ...models,
  sequelize,
};
