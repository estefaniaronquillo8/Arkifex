const { User, sequelize } = require('../models');
// const { Sequelize, Transaction } = require('sequelize');

const createUser = async (userData) => {
    const transaction = await sequelize.transaction();
    try {
      const existingUser = await findUserByEmail(userData.email);
      if (existingUser) {
        await transaction.rollback();
        return { status: 409, message: 'Email already exists' };
      }
      const user = await User.create(userData, { transaction });
      await transaction.commit();
      return { status: 200, data: user, message: 'User created successfully!' };
    } catch (error) {
      await transaction.rollback();
      return { status: 500, message: 'Internal server error' };
    }
  };
  
  const updateUser = async (id, userData) => {
    const transaction = await sequelize.transaction();
    try {
      if (userData.email) {
        const existingUser = await findUserByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          return { status: 409, message: 'Email already exists' };
        }
      }
      await User.update(userData, { where: { id }, transaction });
      await transaction.commit();
      return { status: 200, message: 'User updated successfully' };
    } catch (error) {
      await transaction.rollback();
      return { status: 500, message: 'Internal server error' };
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
      const [user, created] = await User.findOrCreate({ where, defaults, transaction });
      await transaction.commit();
      return [user, created];
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  
  const findAndUpdateUser = async (where, userData) => {
    const transaction = await sequelize.transaction();
    try {
      const user = await User.findOne({ where });
      if (!user) {
        throw new Error('User not found');
      }
      if (userData.email && userData.email !== user.email) {
        const existingUser = await findUserByEmail(userData.email);
        if (existingUser) {
          throw new Error('Email already exists');
        }
      }
      await updateUser(user.id, userData);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  //agregar la función getAll() para el read del CRUD
  const getAllUsers = async () => {
    return await User.findAll();
  };
  
  const findUserByEmail = async (email) => {
    return await findUser({ email });
  };

  const findUser = async (where) => {
    return await User.findOne({ where });
  };

  module.exports = {
    createUser,
    updateUser,
    deleteUser,
    findOrCreateUser,
    findAndUpdateUser,
    getAllUsers,
    findUserByEmail,
    findUser
  };
  