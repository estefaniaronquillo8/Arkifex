const { findRole } = require("../repositories/roleRepository");
const { User, sequelize } = require("../models");
const {
  getAllUsers,
  findById,
  updateUser,
  createUser,
  deleteUser,
  createToken,
  validatePassword,
  encryptPassword,
} = require("../repositories/userRepository");

exports.getUsers = async (req, res) => {
  const response = await getAllUsers();
  return res.status(response.status).json(response);
};

exports.edit = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.update = async (req, res) => {
  const response = await updateUser(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.create = async (req, res) => {
  const { password, ...otherFields } = req.body;
  const response = await createUser({
    ...otherFields,
    password: encryptPassword(password),
  });
  return res.status(response.status).json(response);
};


exports.delete = async (req, res) => {
  const response = await deleteUser(req.params.id);
  return res.status(response.status).json(response);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const response = await validatePassword(email, password);

  if (response.status !== 200) {
    return res.status(response.status).json({ message: response.message });
  }

  const { user } = response;
  const token = createToken(user.id);
  return res
    .status(response.status)
    .json({ token, user, message: "Ingreso exitoso!" });
};

exports.register = async (req, res) => {
  const { name, lastname, email, password } = req.body;

  // Check if there are any users in the database
  const users = await User.findAll();
  
  let roleName;
  if (users.length === 0) {
    // If there are no users in the database, assign the 'superAdmin' role
    roleName = "superAdmin";
  } else {
    // If there are users in the database, assign the 'client' role
    roleName = "client";
  }
  
  const roleResponse = await findRole({ where: { name: roleName } });

  if (!roleResponse.role) {
    return res.status(400).json({ message: roleResponse.message });
  }

  const response = await createUser({
    name,
    lastname,
    email,
    password: encryptPassword(password),
    roleId: roleResponse.role.id,
  });

  return res.status(response.status).json(response);
};

