'use strict';

module.exports = {
  env: 'test',
  mongo: {
    uri: ''
  },
  solr: {
    host: '',
    port: 80,
    path: '/'
  },
  redis: {
  	server: '',
  	secretKey: '',
  	prefix: 'sess-test',
  	port: 6383,
  	db: 2
  },
  logging: {
    name: 'spool-test',
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
