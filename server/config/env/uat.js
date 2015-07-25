'use strict';

module.exports = {
  env: 'uat',
  mongo: {
  	uri: ''
  },
  redis: {
  	server: '',
  	secretKey: '',
  	prefix: 'sess-uat',
  	port: 6383,
  	db: 3
  },
  logging: {
    name: 'spool-uat',
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
