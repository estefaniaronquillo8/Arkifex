const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userController = require('./controllers/userController');
const { User, Role } = require('./models/index')
const app = express();

// Implementar repositorio
const addRoles = async () => {
  await Role.findOrCreate({ where: { name: 'admin' } });
  await Role.findOrCreate({ where: { name: 'client' } });
};

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.get('/users', userController.getUsers);

User.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(User, { foreignKey: 'roleId' });

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await Role.sync();
  await User.sync();
  await addRoles(); // Agrega roles al iniciar la aplicación
});

