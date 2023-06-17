const { findRole, getAllRoles } = require("../repositories/roleRepository");

exports.getRoles = async (req, res) => {
  const response = await getAllRoles();
  return res.status(response.status).json(response);
};
