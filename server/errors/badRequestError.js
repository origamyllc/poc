/**
 * Created by dev on 12/15/13.
 */
var errFactory = require('./errorFactory'),
    BadRequestError = errFactory('BadRequestError', 'warning', 400);

module.exports = BadRequestError;