'use strict';

var app = require('./server/app'),
    config = require('./server/config/config'),
    logger = require('./server/logger');

// Start server
var server = app.listen(config.port, function () {
  logger.info('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

exports = module.exports = server;
