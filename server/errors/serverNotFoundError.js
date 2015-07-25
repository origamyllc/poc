/**
 * Created by dev on 12/17/13.
 */
var errFactory = require('./errorFactory');
var ServerNotFoundError = errFactory('ServerNotFoundError', 'error', 500);

module.exports = ServerNotFoundError;