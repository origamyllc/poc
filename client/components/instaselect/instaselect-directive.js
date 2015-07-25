'use strict';
angular.module('thingyApp')
.directive('instaselect', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $timeout(function() {
        element[0].select();
      });

      element.on('click', function () {
        this.select();
      });
    }
  };
});