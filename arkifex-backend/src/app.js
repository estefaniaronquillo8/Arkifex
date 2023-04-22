const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const { syncDatabase } = require('./models/index');
const routes = require('./routes/index.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await syncDatabase(); // Inicializa la base de datos y agrega roles al iniciar la aplicación
});