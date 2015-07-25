'use strict';

angular.module('thingyApp')
    .controller('addSensorCtrl', function($scope,$state,$stateParams,$http,$rootScope,deviceData,Device,Sensor) {

     $scope.deviceData = deviceData ;

        $scope.getDatetime = new Date;
        var sensor= {};
    $scope.pins = [
        { id: 1, label: '1' },
        { id: 2, label: '2' },
        { id: 3, label: '3' },
        { id: 4, label: '4' },
        { id: 5, label: '5' },
        { id: 6, label: '6' },
        { id: 7, label: '7' },
        { id: 8, label: '8' },
        { id: 9, label: '9' },
        { id: 10, label: '10' }

    ];


         $scope.addSensor= function(form){
          $scope.submitted = true;

                  if (form.$valid) {
                    sensor.name=$scope.name;
                    sensor.type=$scope.type;
                    
                    sensor.details={};
                    sensor.details.model=$scope.model;
                    
                    sensor.inputPin=$scope.pin_no;
                    sensor.addedDate=$scope.getDatetime;

                    sensor.deviceId=$stateParams.deviceId;
                    sensor.notes=$scope.notes
                    
        
                  
                    $scope.submitted = true;
                  if (form.$valid) {
                     //alertService.clear();
                    var newSensor = new Sensor({
                      sensor: sensor
                    });


        
                  return newSensor.$save(function(newSensor) {
                    // $scope.$emit('handleEmit', {message: deviceData.device.name + 'Added' });
                      $state.go('main');
                    }, function(err) {
                      console.log(err);
                     $scope.errors.other = err.data;
                    }).$promise;
                  };
                 
                 //update device 

                  };
                 
         };


     });