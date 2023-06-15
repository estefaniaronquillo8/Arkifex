const { Role } = require("../models");

const getAllRoles = async () => {
  const roles = await Role.findAll();

  if (roles?.length === 0) {
    return {
      status: 404,
      message: "No se ha encontrado ningún registro.",
      notificationType: "info",
    };
  }

  /* return { status: 200, users: users, message: "Información de usuarios recuperada con éxito."}; */
  return { status: 200, roles: roles };
};

const findRole = async (where) => {
  const role = await Role.findOne(where);
  if (!role) {
    return { status: 404, message: "Rol no encontrado." };
  }

  return { status: 200, role: role };
};

module.exports = {
    findRole,
    getAllRoles,
}