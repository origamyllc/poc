'use strict';

angular.module('thingyApp').factory('deviceData', function(Device, $q) {
  var objects = {
    device: null,
    selectedSensorIds: [],
    selectedSensor: false,
    loading:true,
    error: false,
    reset: function() {
      
      this.device = {
            status:'Added',
            state:'off'
      };

      this.selectedSensorIds = [];
      this.selectedSensor = false;
      this.selectedSensors = [];

    },
    init: function(deviceId){
      this.loading = true;
      
      if (deviceId === 'new') {
        this.loading = false;
        this.error = false;
        this.reset();
        var defer =  $q.defer();
        defer.resolve({
               status:'Added',
               state:'off'
        });
        return defer.promise;
      }

      if (this.device === null || this.device._id !== deviceId) {
        this.reset();
        var self = this;
        return Device.get({id: deviceId},
          function(device){
            self.loading = false;
            self.error = false;
            self.device = device;
          }, function() {
            self.loading = false;
            self.error = true;
          }).$promise;
      } else {
        this.loading = false;
        this.error = false;
        var defer = $q.defer();
        defer.resolve(this.device);
        return defer.promise;
      }
    }
  }; 

  return objects;
});