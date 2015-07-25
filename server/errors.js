var AbstractError = require('./errors/abstractError'),
    NotFoundError = require('./errors/notFoundError'),
    ValidationError = require('./errors/validationError'),
    BadRequestError = require('./errors/badRequestError'),
    ServerError = require('./errors/serverError'),
    ServerNotFoundError = require('./errors/serverNotFoundError'),
    DatabaseError = require('./errors/databaseError'),
    TimeoutError = require('./errors/timeoutError'),
    UnauthorizedError = require('./errors/unauthorizedError'),
    NotImplementedError = require('./errors/notImplementedError'),
    utils = require('./errors/errorUtils');

module.exports = {
    AbstractError: AbstractError,
    NotFoundError : NotFoundError,
    ValidationError: ValidationError,
    BadRequestError: BadRequestError,
    ServerError: ServerError,
    ServerNotFoundError: ServerNotFoundError,
    DatabaseError: DatabaseError,
    TimeoutError: TimeoutError,
    UnauthorizedError : UnauthorizedError,
    NotImplementedError: NotImplementedError,
    utils : utils
};