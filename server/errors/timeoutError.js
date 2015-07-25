/**
 * Created by dev on 12/16/13.
 */
var errFactory = require('./errorFactory');
var TimeoutError = errFactory('TimeoutError', 'warning', 408);

module.exports = TimeoutError;