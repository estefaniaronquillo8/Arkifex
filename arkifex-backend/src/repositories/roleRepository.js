const { Role } = require("../models");

const findRole = async (where) => {
  const role = await Role.findOne(where);
  if (!role) {
    return { status: 404, message: "Rol no encontrado." };
  }

  return { status: 200, role: role };
};

module.exports = {
    findRole,
}