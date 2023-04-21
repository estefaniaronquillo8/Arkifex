const { findRole } = require("../repositories/roleRepository");
const { getAllUsers, findById, updateUser, createUser, deleteUser, createToken, validatePassword, encryptPassword } = require("../repositories/userRepository");

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
  const response = await createUser(req.body);
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
  return res.status(response.status).json({ token, user, message: "Ingreso exitoso!" });
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const roleName = role || "client";
  const roleResponse = await findRole({ where: { name: roleName } });
  
  if (!roleResponse.role) {
    return res.status(400).json({ message: roleResponse.message });
  }
  
  const response = await createUser({
    username,
    email,
    password: encryptPassword(password),
    roleId: roleResponse.role.id,
  });

  return res.status(response.status).json(response);
};
