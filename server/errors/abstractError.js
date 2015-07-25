var util = require('util');

///////////////////////////////////////////////////////
// http://shapeshed.com/uncaught-exceptions-in-node/ //
///////////////////////////////////////////////////////
var AbstractError = function (msg, constr) {

    // If defined, pass the constr property to V8's
    // captureStackTrace to clean up the output
    Error.captureStackTrace(this, constr || this);

    // If defined, store a custom error message
    this.message = msg || 'Error processing request';
};

// Extend our AbstractError from Error
util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'AbstractError';
AbstractError.super_ = Error;

// Give our Abstract error a name property. Helpful for logging the error later.
// AbstractError.prototype.name = 'Abstract Error'
module.exports = AbstractError;