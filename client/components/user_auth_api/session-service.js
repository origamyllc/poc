'use strict';

angular.module('thingyApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
