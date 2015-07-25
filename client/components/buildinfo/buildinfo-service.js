'use strict';

angular.module('thingyApp')
  .factory('BuildInfoService', function ($resource) {
    return $resource('/api/v1/buildinfo');
  });
