'use strict';

angular.module('thingyApp')
  .controller('BuildInfoCtrl', function ($scope, $http, $log, $modal, BuildInfoService) {

		var buildInfo = BuildInfoService.get(function() {
			$scope.buildInfo = buildInfo;
		});
    
    $scope.about = function() {
      $modal.open({
        scope: $scope,
        templateUrl: 'components/buildinfo/about.html'
      });
    };
    
	});