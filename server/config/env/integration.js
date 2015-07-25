'use strict';

module.exports = {
  env: 'integration',
  mongo: {
    uri: ''
  },
  redis: {
  	server: '',
  	secretKey: '',
  	prefix: '',
  	port: 6383,
  	db: 2
  },
  logging: {
    name: '',
    streams: [
      {
         type: 'raw',
         stream: require('../../logger-prettystream'),
         level: 'info'
      },
      {
         type: "raw",
         level: "info",
         stream: require('bunyan-logstash').createStream({
           host: "",
           port: 5545
         })
      }
    ]
  }
};