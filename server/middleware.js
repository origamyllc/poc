'use strict';

var uuid = require('node-uuid');
/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send(401);
  },

  /**
   * Set a cookie for angular so it knows we have an http session
   */
  setUserCookie: function(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
  },

  setLogger: function(logger) {

    if (!logger.constructor || logger.constructor.name !== 'Logger')
        throw new Error('a valid logger must be specified');

    var headerKey = 'X-Request-Id',
        requestKey = 'reqId',
        childLoggerKey = 'req_id';

    return function(req, res, next) {

        var id = req[requestKey] ||
            req.headers[headerKey] ||
            uuid.v1();

        var prefs = {};
        prefs[childLoggerKey] = id;

        req.log = res.log = logger.child(prefs);

        req[requestKey] = res[requestKey] = id;
        res.setHeader(headerKey, id);

        req.log.trace({ req: req }, 'starting request...');

        res.on('finish', function() {
            res.log.trace({ res: res }, 'response finished...');
        });

        next();
    };
  }
};
