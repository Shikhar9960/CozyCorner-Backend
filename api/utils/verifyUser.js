import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // Check if the token exists in cookies
  const token = req.cookies.access_token;

  if (!token) {
    return next(errorHandler(401, 'Unauthorized, No token provided.'));
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If token is expired or invalid, send a Forbidden error
      return next(errorHandler(403, 'Forbidden, Invalid or expired token.'));
    }

    // If token is valid, add the user data to the request object
    req.user = user;
    next();
  });
};
