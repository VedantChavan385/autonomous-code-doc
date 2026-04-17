import jwt from 'jsonwebtoken';
import User from '../modules/user/user.model.js';
import config from '../config/index.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the request has an authorization header and if it starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the token from the header string (e.g., "Bearer eyJhbGciOi...")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret key
      const decoded = jwt.verify(token, config.jwtSecret);

      // 4. Find the user in the database based on the ID inside the token
      // We use .select('-passwordHash') to ensure we don't accidentally attach the password hash to the request
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
         return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 5. The token is valid and user exists! Pass control to the next function (the actual route controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. If there was no token at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
