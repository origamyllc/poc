'use strict';

angular.module('thingyApp').factory('alertService', function($rootScope) {
        var alertService;
        $rootScope.alerts = [];
        return alertService = {
          add: function( msg,from) {
            return $rootScope.alerts.push({
              msg: msg,
              from:from,
              close: function() {
                return alertService.closeAlert(this);
              }
            });
          },
          closeAlert: function(alert) {
            return this.closeAlertIdx($rootScope.alerts.indexOf(alert));
          },
          closeAlertIdx: function(index) {
            return $rootScope.alerts.splice(index, 1);
          },
          getAlert: function() {
            return $rootScope.alerts;
          },
          clear: function(){
            $rootScope.alerts = [];
          }
        };
      }
   )

