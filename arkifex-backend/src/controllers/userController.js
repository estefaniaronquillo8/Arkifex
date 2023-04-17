const { getAllUsers, findById, updateUser, createUser, deleteUser } = require("../repositories/userRepository");

exports.getUsers = async (req, res) => {
  try {
    const response = await getAllUsers();

    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Ha ocurrido un error inesperado." });
  }
};

exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await findById(id);

    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: "Ha ocurrido un error inesperado." });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const response = await updateUser(id, userData);

    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.create = async (req, res) => {
  const userData = req.body;

  try {
    const response = await createUser(userData);

    return res.status(response.status).json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    await deleteUser(id);
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

