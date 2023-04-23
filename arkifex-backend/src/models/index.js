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
User.belongsTo(Role, { foreignKey: 'roleId', onDelete: 'CASCADE' });
Role.hasMany(User, { foreignKey: 'roleId' });

Project.hasMany(Project, { foreignKey: 'parentId', as: 'subprojects', onDelete: 'CASCADE' });
Project.belongsTo(Project, { foreignKey: 'parentId', as: 'parent' });

Project.hasOne(InitialPlanning, { foreignKey: 'projectId', onDelete: 'CASCADE' });
InitialPlanning.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(ResourceAssignment, { foreignKey: 'projectId', onDelete: 'NO ACTION' });
ResourceAssignment.belongsTo(Project, { foreignKey: 'projectId' });

Resource.hasMany(ResourceAssignment, { foreignKey: 'resourceId', onDelete: 'NO ACTION' });
ResourceAssignment.belongsTo(Resource, { foreignKey: 'resourceId' });

Project.hasMany(Report, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Report.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasOne(Location, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Location.belongsTo(Project, { foreignKey: 'projectId' });

Resource.hasMany(Cost, { foreignKey: 'resourceId', onDelete: 'CASCADE' });
Cost.belongsTo(Resource, { foreignKey: 'resourceId' });

// Función para añadir roles por defecto
const addRoles = async () => {
  await Role.findOrCreate({ where: { name: 'admin' } });
  await Role.findOrCreate({ where: { name: 'client' } });
};

// Función para sincronizar la base de datos
const syncDatabase = async () => {
  // Si se hace algún cambio en los modelos, para que se sincronice
  // con la bd poner aquí await sequelize.sync({force: true});
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
