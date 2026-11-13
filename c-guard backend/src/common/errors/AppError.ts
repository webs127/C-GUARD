export class AppError extends Error {
  readonly statusCode: number;
  readonly errors: unknown[];
  readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errors: unknown[] = [],
    isOperational = true,
  ) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace?.(this, new.target);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', errors: unknown[] = []) {
    super(400, message, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required', errors: unknown[] = []) {
    super(401, message, errors);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You are not allowed to perform this action', errors: unknown[] = []) {
    super(403, message, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', errors: unknown[] = []) {
    super(404, message, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict', errors: unknown[] = []) {
    super(409, message, errors);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = 'Validation failed', errors: unknown[] = []) {
    super(422, message, errors);
  }
}
