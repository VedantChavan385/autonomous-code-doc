import { logger } from '../utils/logger.js';
import config from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`[${req.method}] ${req.originalUrl} - ${err.message}`);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    stack: config.nodeEnv === 'production' ? null : err.stack,
  });
};
