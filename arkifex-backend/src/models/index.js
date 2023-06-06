const sequelize = require('../config/database');

// Import Models
const User = require('./user');
const Role = require('./role');
const Project = require('./project');
const Resource = require('./resource');
const ResourceAssignment = require('./resourceAssignment');
const Version = require('./version');
const Report = require('./report');
const Location = require('./location');

// Associations
User.belongsTo(Role, { foreignKey: 'roleId', onDelete: 'CASCADE' });
Role.hasMany(User, { foreignKey: 'roleId' });

Project.hasMany(Project, { foreignKey: 'parentId', as: 'subprojects', onDelete: 'CASCADE' });
Project.belongsTo(Project, { foreignKey: 'parentId', as: 'parent' });

Project.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });
User.hasMany(Project, { foreignKey: 'userId' });

ResourceAssignment.belongsTo(Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Project.hasMany(ResourceAssignment, { foreignKey: 'projectId' });

ResourceAssignment.belongsTo(Resource, { foreignKey: 'resourceId', onDelete: 'CASCADE' });
Resource.hasMany(ResourceAssignment, { foreignKey: 'resourceId' });

Version.belongsTo(Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Project.hasMany(Version, { foreignKey: 'projectId' });

Version.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });
User.hasMany(Version, { foreignKey: 'userId' });

Report.belongsTo(Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Project.hasMany(Report, { foreignKey: 'projectId' });

Report.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });
User.hasMany(Report, { foreignKey: 'userId' });

Location.belongsTo(Project, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Project.hasMany(Location, { foreignKey: 'projectId' });

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

// Export Models, Sequelize, and Sync Database Function
module.exports = {
  User,
  Role,
  Project,
  Resource,
  ResourceAssignment,
  Version,
  Report,
  Location,
  sequelize,
  syncDatabase,
};
