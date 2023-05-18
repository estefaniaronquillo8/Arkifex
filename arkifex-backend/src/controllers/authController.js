const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User, Role} = require("../models");
const {
  createUser,
} = require('../repositories/userRepository');


exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign({ id: user.id }, "arkifex-secret-key", {
    expiresIn: "1h",
  });

  res.json({ token, user });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const roleName = role || "client"; // Si no se proporciona un rol, utiliza 'client' como predeterminado
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
    //TODO: HACER REDIRECT A LOGIN
    //FIXME: ASDADASA
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
