'use strict';

angular.module('thingyApp').factory('Sensor', function ($resource) {

	return $resource('/api/v1/sensors/:id',{ id: '@_id' },
          {
	      getAllSensors: {
	        method: 'GET',
	        url: '/api/v1/sensors/getall',
	        isArray: true
	      },
	       getSensorsByDevice: {
	        method: 'GET',
	        url: '/api/v1/sensors/:deviceId/get',
	        isArray: true
	      },
	       getSensor: {
	        method: 'GET',
	        url: '/api/v1/sensors/:sensorId/get/sensor',
	        isArray: false
	      },
	       deleteSensorById: {
	         method: 'GET',
	         url: '/api/v1/sensors/:sensorId/delete/sensor',
	         isArray: false
	      },
	       deleteSensorsByDevice: {
	        method: 'GET',
	        url: '/api/v1/sensors/:deviceId/delete',
	        isArray: false
	      },
	      getPower: {
	        method: 'GET',
	        url: '/api/v1/current',
	        isArray: false
	      }
	  });


  });

