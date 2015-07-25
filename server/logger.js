'use strict';

var bunyan = require('bunyan'),
    config = require('./config/config'),
    logger = bunyan.createLogger(config.logging);

module.exports = logger;
