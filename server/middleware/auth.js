const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../utils/generateToken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError('Not authorized. Please log in.', 401));
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return next(new AppError('User not found.', 401));

      const newAccessToken = generateAccessToken(user._id);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      req.user = user;
      return next();
    } catch (err) {
      return next(new AppError('Not authorized. Please log in.', 401));
    }
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new AppError('User not found.', 401));

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Not authorized. Please log in.', 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role ${req.user.role} is not authorized.`, 403));
    }
    next();
  };
};

module.exports = { protect, authorize };
