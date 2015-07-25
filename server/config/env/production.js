'use strict';

module.exports = {
  env: 'production',
  useErrorHandler: true,
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         ''
  },
  solr: {
    host: '',
    port: 80,
    path: '/'
  }
};