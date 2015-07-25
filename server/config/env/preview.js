'use strict';

module.exports = {
  env: 'preview',
  mongo: {
  	uri: ''
  },
  redis: {
  	server: '',
  	secretKey: '',
  	prefix: 'sess-preview',
  	port: 6383,
  	db: 1
  },
  logging: {
    name: 'contracts-preview',
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
