const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// NO MOVER
const dotenv = require('dotenv');
// NO MOVER
dotenv.config();

const { User, Role } = require('./models/index')
const authRoutes = require('./routes/auth.routes');
const authenticatedRoutes = require('./routes/authenticated.routes');

const app = express();

const addRoles = async () => {
  await Role.findOrCreate({ where: { name: 'admin' } });
  await Role.findOrCreate({ where: { name: 'client' } });
};

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', authenticatedRoutes);

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await Role.sync();
  await User.sync();
  await addRoles(); // Agrega roles al iniciar la aplicación
});