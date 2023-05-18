// userController.js
const User = require('../models/user');

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};
