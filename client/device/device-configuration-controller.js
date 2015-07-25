'use strict';

angular.module('thingyApp')
    .controller('configureDeviceCtrl', function($scope,$state,$stateParams,$http,$modal,$rootScope, deviceData ,Device,Sensor) {

        $scope.deviceData = deviceData ;
         
         $scope.device= {};
     

         $scope.Sensors=Sensor.getSensorsByDevice({deviceId:$stateParams.deviceId },function(result) {
                               //console.log(result);   
            });


           Device.getDevice({deviceId:$stateParams.deviceId},function(device) {
             $scope.device=device;
          });


$scope.addSensor = function() {
                  $state.go('addSensor',{deviceId:$stateParams.deviceId});
};


         $scope.deleteSensor=function(sensor) {
           console.log(sensor);
             Sensor.deleteSensorById({'sensorId':sensor._id});
             window.location.reload();
         };
         
     });