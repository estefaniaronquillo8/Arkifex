const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, sequelize } = require("../models");

const createUser = async (userData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findUserByEmail(userData.email);
    if (response?.user) {
      return { status: 409, message: "Email already exists" };
    }
    const user = await User.create(userData, { transaction });
    await transaction.commit();
    return { status: 200, user: user, message: "User created successfully!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const getAllUsers = async () => {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });
  
  if (!users || users.length === 0) {
    return { status: 404, message: "No se ha encontrado ningún registro." };
  }

  /* return { status: 200, users: users, message: "Información de usuarios recuperada con éxito."}; */
  return { status: 200, users: users };
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
    return { status: 200, message: "User deleted successfully!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};


const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { status: 404 };
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
  const user = await User.findByPk(id);

  if (!user) {
    return { status: 404, message: "Registro no encontrado." };
  }

  return { status: 200, user: user, message: "Información de usuario recuperada con éxito."};
};

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_JWT, {
    expiresIn: "1h",
  });
};

const validatePassword = async (email, password) => {
  const response = await findUser({ where: { email } });

  if (!response.user) {
    return { status: 404, message: response.message };
  }

  const user = response.user;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { status: 401, message: "Contraseña incorrecta" };
  }

  return { status: 200, user };
};

const encryptPassword = (password) =>{
  return bcrypt.hashSync(password, 10);
}

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  findUserByEmail,
  findUser,
  findById,
  createToken,
  validatePassword,
  encryptPassword,
};
