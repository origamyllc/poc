/**
 * Created by dev on 12/24/13.
 */
'use strict';
var _ = require('lodash'),
    util = require('util');

var defaultMessageMap = [
    {type: "ValidatorError", message: "Invalid parameter in request", statusCode: 400},
    {type: "BadParameterError", message: "Invalid parameter in request", statusCode: 400},
    {type: "UnauthorizedError", message: "Missing or Invalid credentials", statusCode: 401},
    {type: "NotFoundError", message: "Resource not found", statusCode: 404},
    {type: "InvalidMethod", message: "Invalid method requested", statusCode: 405},
    {type: "TimeoutError", message: "Request Timeout", statusCode: 408},
    {type: "Error", message: "Unexpected Error Occurred", statusCode: 500},
    {type: "ServerError", message: "Unexpected Error Occurred", statusCode: 500},
    {type: "DatabaseError", message: "Unexpected Error Occurred", statusCode: 500},
    {type: "RequestError", message: "Unexpected Error Occurred", statusCode: 500},
    {type: "NotImplementedError", message: "Feature Not Currently Implemented", statusCode: 500}
];

// https://github.com/syntagma/mongoose-error-helper
function extractMongooseValidationErrors(err) {
    //If it isn't a mongoose-validation error, just throw it.
    if (err.name !== 'ValidationError' && err.name !== 'CastError') return err;
    var messages = {
        'required': "%s is required.",
        'min': "%s below minimum.",
        'max': "%s above maximum.",
        'enum': "%s not an allowed value."
    };


    //A ValidationError can contain more than one error.
    var errors = [];

    // But CastError has no errors object (stops on the first error)
    if (!err.errors) {
        errors.push(err.message);
        return errors;
    }
    //Loop over the errors object of the Validation Error
    Object.keys(err.errors).forEach(function (field) {
        var eObj = err.errors[field];

        //If we don't have a message for `type`, just push the error through
        if (!messages.hasOwnProperty(eObj.type)) errors.push(eObj.type);

        //Otherwise, use util.format to format the message, and passing the path
        else errors.push(util.format(messages[eObj.type], eObj.path));
    });

    return errors;
}


function extractValidationErrorInfo(err) {
    var res = extractMongooseValidationErrors(err);
    if (_.isArray(res) && res.length) {

        var msg = res.join('\n');
        return {
            statusCode : 400,
            message: msg
        };
    }
    return null;
}

function extractErrorInfo(err) {
    var errInfo = null,
        res = {
            statusCode: err.statusCode,
            message: err.message
        };
    var name = err.name || 'Error';
    if (!err.message || !err.statusCode) {
        errInfo = extractValidationErrorInfo(err);
        if (!errInfo) {
            errInfo = _.find(defaultMessageMap, function(item){
                return name === item.type;
            });
        }
        if (errInfo) {
            res.message = err.message || errInfo.message;
            res.statusCode = err.statusCode || errInfo.statusCode;
        } else {
            res.message = 'An unexpected error occurred';
            res.statusCode = 500;
        }
    }
    return res;
}


module.exports = {
    extractErrorInfo: extractErrorInfo,
    extractMongooseValidationErrors: extractMongooseValidationErrors
};