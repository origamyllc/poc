'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');
var favicon = require('serve-favicon');

var fixtures = require('pow-mongoose-fixtures');


/**
 * Main application file
 */

// Default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./config/config'),
    logger = require('./logger');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate Network, ServicePlatform collections
fixtures.load(__dirname + '/config/fixtures.js', mongoose.connection, function(err) {
  if (err) {
    logger.error(err, 'Trouble loading fixture for mongoose:');
  } else {
    logger.info('Mongoose fixtures loaded successfully!');
  }
});

// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file)(mongoose);
});



// Passport Configuration
require('./config/passport')();

var app = express();

// Express settings
require('./config/express')(app);

// Routing
require('./routes')(app);

// Expose app
exports = module.exports = app;


