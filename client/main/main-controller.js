'use strict';

angular.module('thingyApp')
    .controller('mainCtrl', function($scope, $filter, Device, $state,$rootScope, ngTableParams) {
            
 $scope.devices=Device.getAllDevices();
   var interval,values=[],data={},count=0;

$scope.selection = [];


                  
               $scope.addDevice = function() {
           
                   // Notification.primary('Primary notification');
                  $state.go("adddevice");
               }


               $scope.configureDevice=function(deviceId) {
                     $state.go("configuredevice", {
                  deviceId: deviceId
                });
               }
    
               $scope.deleteDevice = function(deviceId) {
                  Device.deleteDevices({deviceId:deviceId});
                  window.location.reload();
                  
               }


             function getPower() {
                 Device.getPower(function(result) {
                 ++count;
                   values.push([count,result.power.value]);
                   console.log(values);

                    data=  {
                          "key": "Series 1",
                          "values":values
                      };
                               $scope.exampleData = [ data ] ;
               });
            };

               $scope.handleCheckboxSelection = function handleCheckboxSelection (id) {
                  var idx = $scope.selection.indexOf(id);

                     // is currently selected
              if (idx > -1) {
                $scope.selection.splice(idx, 1);

                 Device.getDevice({deviceId:id},function(result) {
                               console.log(result.state);
                                Device.toggle({action:'off'});
                                Device.state='off';
                            clearInterval(interval);

                   });

              }
              else {
                $scope.selection.push(id);

                  Device.getDevice({deviceId:id},function(result) {
                               console.log(result.state);
                                Device.toggle({action:'on'});
                                Device.state='on';
                            interval=setInterval(function() { getPower() }, 1000);

                   });

              }
          };
          
                      $rootScope.$on('handleEmit', function(event, args) {
                // do something useful here;
                console.log("DEVICE ADDED");
                  // With Title
                         //  Notification({message: args.message, title: 'Primary notification'});
              });

         
        });
