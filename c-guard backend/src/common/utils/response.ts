import type { Response } from 'express';
import type { ApiSuccess } from '../types/api';

export function ok<T>(
  res: Response,
  data: T,
  message = 'Request successful',
  statusCode = 200,
): Response<ApiSuccess<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } satisfies ApiSuccess<T>);
}

export function created<T>(
  res: Response,
  data: T,
  message = 'Resource created successfully',
): Response<ApiSuccess<T>> {
  return ok(res, data, message, 201);
}
