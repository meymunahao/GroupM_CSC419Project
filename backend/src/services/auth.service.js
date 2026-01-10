const bcrypt = require('bcrypt');
const User = require('../models/User');
const tokenService = require('./token.service');

exports.register = async ({ email, password, fullName }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash, fullName });
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error('Invalid credentials');

  return tokenService.generateTokens(user);
};

exports.refresh = async (refreshToken) => {
  return tokenService.refreshAccessToken(refreshToken);
};

exports.logout = async (refreshToken) => {
  return tokenService.revokeRefreshToken(refreshToken);
};
