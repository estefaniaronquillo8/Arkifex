const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No se ha proveido un token' });
  }

  jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Ruta protegida, primero inicie sesión.' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = { isAuthenticated };
