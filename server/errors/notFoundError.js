
var errFactory = require('./errorFactory');
var NotFoundError = errFactory('NotFoundError', 'warning', 404);

module.exports = NotFoundError;