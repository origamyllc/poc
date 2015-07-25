'use strict';

module.exports = {
  env: 'development',
  mongo: {
    uri: 'mongodb://chuggh:mongo@ds049219.mongolab.com:49219/chuggh'
  },
  solr: {
    host: '',
    port: 80,
    path: '/'
  },
  redis: {
    server: '',
    secretKey: '',
    prefix: 'sess-dev',
    port: 6383,
    db: 0
  },
  logging: {
    name: 'thingy-dev',
    streams: [
      {
         type: 'raw',
         stream: require('../../logger-prettystream'),
         level: 'info'
      }
    ]
  }
};


