import { ValidationError } from 'express-validator';
import { CustomError } from './custom.error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Error request parameter');
    this.errors = errors;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
