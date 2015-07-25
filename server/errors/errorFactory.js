/**
 * Created by dev on 12/15/13.
 */
var util = require('util'),
    _ = require('lodash'),
    AbstractError = require('./abstractError');

// log levels shd correspond to Log Levels listed here https://github.com/visionmedia/log.js
var errorFactory = function (baseClass, name, logLevel, resCode) {

    if (_.isString(baseClass)) {
        baseClass = AbstractError;
        name = baseClass;
    }
    baseClass = baseClass || AbstractError;

    var CustomError = function (msg, resCodeOverride) {
        this.name      = name;
        this.logLevel  = logLevel || 'warning';
        this.statusCode   = resCodeOverride || resCode || 400; // default to 400
        CustomError.super_.call(this, msg, this.constructor);
    };

    util.inherits(CustomError, baseClass);
    CustomError.super_ = baseClass;

    // add name info
    CustomError.prototype.name = name;

    return CustomError;
};

module.exports = errorFactory;