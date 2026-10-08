const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    err.message = `Resource not found with id of ${err.value}`;
    err.statusCode = 404;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.message = `Duplicate value for ${field}. Please use another value.`;
    err.statusCode = 400;
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    err.message = messages.join('. ');
    err.statusCode = 400;
  }

  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token. Please log in again.';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    err.message = 'Token expired. Please log in again.';
    err.statusCode = 401;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
