'use strict';

angular.module('thingyApp').factory('Device', function ($resource) {
    return $resource('/api/v1/devices/:deviceId', {
              id: '@deviceId'
      },
      
      {
	      getAllDevices: {
	        method: 'GET',
	        url: '/api/v1/devices/getall',
	        isArray: true
	      },
	       deleteDevices: {
	        method: 'GET',
	        url: '/api/v1/devices/delete/:deviceId',
	        isArray: false
	      },
	        getDevice: {
	        method: 'GET',
	        url: '/api/v1/devices/get/:deviceId',
	        isArray: false
	      },
	      toggle: {
	        method: 'GET',
	        url: '/api/v1/relay/:action',
	        isArray: false,
	        params: {q:'@q'}
	      },
	      getPower: {
	        method: 'GET',
	        url: '/api/v1/current',
	        isArray: false
	      }
      });
  });

