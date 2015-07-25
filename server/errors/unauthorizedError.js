/**
 * Created by dev on 12/16/13.
 */
var errFactory = require('./errorFactory');
var UnauthorizedError = errFactory('UnauthorizedError', 'warning', 401);

module.exports = UnauthorizedError;