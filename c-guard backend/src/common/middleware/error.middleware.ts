import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { env } from '../../config/env';
import { logger } from '../../config/logger';

export const errorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  _next,
) => {
  if (res.headersSent) {
    return;
  }

  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, method: req.method, url: req.originalUrl }, 'Non-operational error');
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  logger.error(
    { err, method: req.method, url: req.originalUrl },
    'Unhandled error',
  );

  const message =
    env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err instanceof Error
        ? err.message
        : 'Internal server error';

  res.status(500).json({
    success: false,
    message,
    errors: [],
  });
};
