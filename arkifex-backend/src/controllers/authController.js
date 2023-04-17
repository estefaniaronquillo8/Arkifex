const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Role } = require("../models/index");
const { createUser, findUser } = require("../repositories/userRepository");

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_JWT, {
    expiresIn: "1h",
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await findUser({ where: { email } });

    if (!response.user) {
      return res.status(response.status).json({ message: response.message });
    }

    const user = response.user;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = createToken(user.id);

    return res
      .status(response.status)
      .json({ token, user, message: "Ingreso exitoso!" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const roleName = role || "client";
    const userRole = await Role.findOne({ where: { name: roleName } });

    if (!userRole) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const response = await createUser({
      username,
      email,
      password: hashedPassword,
      roleId: userRole.id,
    });

    res.status(response.status).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
