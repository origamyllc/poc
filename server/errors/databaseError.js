/**
 * Created by dev on 12/16/13.
 */
var errFactory = require('./errorFactory');
var DatabaseError = errFactory('DatabaseError', 'error', 500);

module.exports = DatabaseError;