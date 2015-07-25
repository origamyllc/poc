/**
 * Created by dev on 12/26/13.
 */
var errFactory = require('./errorFactory');
var NotImplementedError = errFactory('NotImplementedError', 'warning', 500);

module.exports = NotImplementedError;