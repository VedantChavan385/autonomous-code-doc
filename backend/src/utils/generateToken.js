import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const generateToken = (userId) => {
  // This creates a signed token containing the user's ID
  // It uses the secret and expiry time we set in our config/environment
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiry,
  });
};

export default generateToken;
