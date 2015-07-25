/**
 * Created by cclark on 5/7/14.
 */
'use strict';
var http = require('http');
var amqp = require('amqp');
var URL = require('url'),
config = require('./../config/config');

var defaultPorts = { 'amqp': 5672, 'amqps': 5671 };


exports.connect = function (req, res) {
// Creates connection to an AMQP broker,
// like Apache QPid or RabbitMQ
var connection = amqp.createConnection(

{
  host: '104.154.55.36',
  port: 5672,
  login: 'guest',
  password: 'Yde7xEBsBXrxd4s0Yf8gKCvX5VE=',
  vhost: '/'
} ,
{ defaultExchangeName : 'demo_exchange'}
    );

connection.on('ready', function(err){
    console.log('err');
     return res.json(200, {});
});
connection.on('error', function(err){
    console.log(err);
});



};





