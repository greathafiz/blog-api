import { StatusCodes } from "http-status-codes";

class CustomHttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends CustomHttpError {
  statusCode = StatusCodes.BAD_REQUEST;
}

class NotFoundError extends CustomHttpError {
  statusCode = StatusCodes.NOT_FOUND;
}

class UnauthorizedError extends CustomHttpError {
  statusCode = StatusCodes.UNAUTHORIZED;
}

export { CustomHttpError, BadRequestError, NotFoundError, UnauthorizedError };
