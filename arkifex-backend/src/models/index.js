const sequelize = require('../config/database');

// Importar modelos
const User = require('./user');
const Role = require('./role');
const Project = require('./project');
const InitialPlanning = require('./initialPlanning');
const Resource = require('./resource');
const ResourceAssignment = require('./resourceAssignment');
const Report = require('./report');
const Location = require('./location');
const Cost = require('./cost');

// Establecer las asociaciones entre los modelos
User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

Project.hasMany(Project, { foreignKey: 'parentId', as: 'subprojects' });
Project.belongsTo(Project, { foreignKey: 'parentId', as: 'parent' });

Project.hasOne(InitialPlanning, { foreignKey: 'projectId' });
InitialPlanning.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(ResourceAssignment, { foreignKey: 'projectId' });
ResourceAssignment.belongsTo(Project, { foreignKey: 'projectId' });

Resource.hasMany(ResourceAssignment, { foreignKey: 'resourceId' });
ResourceAssignment.belongsTo(Resource, { foreignKey: 'resourceId' });

Project.hasMany(Report, { foreignKey: 'projectId' });
Report.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasOne(Location, { foreignKey: 'projectId' });
Location.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Resource, { foreignKey: 'projectId' });
Resource.belongsTo(Project, { foreignKey: 'projectId' });

Resource.hasMany(Cost, { foreignKey: 'resourceId' });
Cost.belongsTo(Resource, { foreignKey: 'resourceId' });

// Función para añadir roles por defecto
const addRoles = async () => {
  await Role.findOrCreate({ where: { name: 'admin' } });
  await Role.findOrCreate({ where: { name: 'client' } });
};

// Función para sincronizar la base de datos
const syncDatabase = async () => {
  await sequelize.sync();
  await addRoles();
};

// Exportar modelos, sequelize y la función syncDatabase
module.exports = {
  User,
  Role,
  Project,
  InitialPlanning,
  Resource,
  ResourceAssignment,
  Report,
  Location,
  sequelize,
  syncDatabase,
};
