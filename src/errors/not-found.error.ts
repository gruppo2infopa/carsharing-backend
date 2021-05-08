import { CustomError } from './custom.error';

export class NotFoundError extends CustomError {
  statusCode = 404;
  message: string;

  constructor(message: string) {
    super(message);
    this.message = message;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
