'use strict';
//.controller('ContractDetailsCtrl', function($scope, $state, $http,alertService, $timeout, Contract, Network, PlatformService, $stateParams, contractData) {

angular.module('thingyApp')
    .controller('addDeviceCtrl', function($scope,$state,$stateParams,$http,$timeout,$rootScope, deviceData ,Device,alertService) {

           $scope.deviceData = deviceData ;
           $scope.errors = {};

             $scope.selectedItem= {};

              $scope.deviceTypes =[{
                  _id: '512b5247bc028409c4793e80',
                  name: 'Thingy-basic'
                }, {
                  _id: '512b5247bc028409c4793e81',
                  name: 'Thingy-mobile'
                }, 
                 {
                  _id: '512b5247bc028409c4793e82',
                  name: 'Thingy-Blue'
                 },{
                  _id: '512b5247bc028409c4793e83',
                  name: 'Thingy-Extreme'
                },
                 {
                  _id: '512b5247bc028409c4793e84',
                  name: 'Thingy-Nano'
                 },
                 {
                  _id: '512b5247bc028409c4793e85',
                  name: 'Thingy-Micro'
                 }
                ];   

      

      
             

  			     $scope.cancel = function(override) {
        
                  $state.go('main');
  			      }

              $scope.selectAction = function() {
                  deviceData.device.deviceType=$scope.selectedItem.name;
              };


		         $scope.createDevice = function(form) {
                 $scope.submitted = true;
                  if (form.$valid) {
                     alertService.clear();
                    var newDevice = new Device({
                      device: deviceData.device
                    });


        
                  return newDevice.$save(function(newDevice) {
                     $scope.$emit('handleEmit', {message: deviceData.device.name + 'Added' });
                      $state.go('main');
                    }, function(err) {
                      console.log(err);
                     $scope.errors.other = err.data;
                    }).$promise;
                  };
                 
                    
                }
		     

    });
