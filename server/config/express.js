'use strict';

var express = require('express'),
  path = require('path'),
  config = require('./config'),
  passport = require('passport'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  logger = require('../logger'),
  middleware = require('../middleware'),
  serveStatic = require('serve-static'),
  errorHandler = require('errorhandler'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  methodOverride = require('method-override');

/**
 * Express configuration
 */
module.exports = function(app) {

  var env = process.env.NODE_ENV || 'development';

  console.log(env);

  if('development' === env) {

    app.use(require('connect-livereload')({
      port: 35729,
      ignore: ['.js', '.svg']
    }));

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(serveStatic(
      path.join(config.root, '.tmp'), {
        'index': false
    }));
  }


  app.set('views', path.join(config.root, config.clientDir));
  app.use(serveStatic(path.join(config.root, config.clientDir), { 'index': false }));
  app.use(favicon(path.join(config.root, config.clientDir, 'favicon.ico')));

  if(config.useErrorHandler) {
    app.use(errorHandler());
  }

  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(require('express-bunyan-logger')({ logger: logger, excludes: ['*'] }));
  //app.use(express.logger('dev'));
  app.use(middleware.setLogger(logger));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
  app.use(cookieParser());

  // Persist sessions with redisStore
  // app.use(session({
  //   secret: config.redis.secretKey,
  //   store: new redisStore({
  //     host: config.redis.server,
  //     port: config.redis.port,
  //     db: config.redis.db,
  //     prefix: config.redis.prefix
  //   })
  // }));

  // See TG for this. We need a strategy for DB disconnects.
  // app.use(function(req, res, next){
  //   if (mongoose.connection.readyState !== 1)
  //   {
  //     return res.json(500, 'No db conn.');
  //   }
  //   next();
  // });

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());

};
