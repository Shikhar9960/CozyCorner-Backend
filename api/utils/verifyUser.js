// import jwt from 'jsonwebtoken';
// import { errorHandler } from './error.js';

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.access_token;

//     if (!token) return next(errorHandler(401, 'Unauthorized'));

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return next(errorHandler(403, 'Forbidden'));

//         req.user = user;
//         next();
//     });
// };

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header
    if (!token) return res.status(401).json({ success: false, message: 'Token missing' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
      req.user = user;
      next();
    });
  };
  