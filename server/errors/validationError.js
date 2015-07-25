/**
 * Created by dev on 12/15/13.
 */
var errFactory = require('./errorFactory');
var ValidationError = errFactory('ValidationError', 'warning');

module.exports = ValidationError;