const { User, sequelize } = require("../models");
// const { Sequelize, Transaction } = require('sequelize');

const createUser = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findUserByEmail(userData.email);
    if (response.user) {
      return { status: 409, message: "Email already exists" };
    }
    const user = await User.create(userData, { transaction });
    await transaction.commit();
    return { status: 200, data: user, message: "User created successfully!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const updateUser = async (id, userData) => {
  const transaction = await sequelize.transaction();
  try {
    if (userData.email) {
      const response = await findUserByEmail(userData.email);
      if (response.status === 200 && response.user.id !== parseInt(id)) {
        return { status: 409, message: "Email already exists" };
      }
    }
    await User.update(userData, { where: { id }, transaction });
    await transaction.commit();
    const updatedUser = await findById(id);
    return {
      status: 200,
      message: "User updated successfully",
      user: updatedUser.user,
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const deleteUser = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await User.destroy({ where: { id }, transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findOrCreateUser = async (where, defaults) => {
  const transaction = await sequelize.transaction();
  try {
    const [user, created] = await User.findOrCreate({
      where,
      defaults,
      transaction,
    });
    await transaction.commit();
    return [user, created];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//agregar la función getAll() para el read del CRUD
const getAllUsers = async () => {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });

  if (!users) {
    return { status: 404, message: "No existen registros." };
  }

  return { status: 200, users: users };
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { status: 404, message: 'User not found' };
  }
  return { status: 200, user };
};

const findUser = async (where) => {
  const user = await User.findOne(where);
  if (!user) {
    return { status: 404, message: "Usuario no encontrado." };
  }

  return { status: 200, user: user };
};

const findById = async (id) => {
  console.log(id);
  const user = await User.findByPk(id);

  if (!user) {
    return { status: 404, message: "Usuario no encontrado." };
  }

  return { status: 200, user: user };
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  findOrCreateUser,
  getAllUsers,
  findUserByEmail,
  findUser,
  findById,
};
