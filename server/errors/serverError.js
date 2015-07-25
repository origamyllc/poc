/**
 * Created by dev on 12/16/13.
 */
var errFactory = require('./errorFactory');
var ServerError = errFactory('ServerError', 'error', 500);

module.exports = ServerError;
