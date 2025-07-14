 import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥷' : err.stack,
  });
};
