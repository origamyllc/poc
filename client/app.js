'use strict';

angular.module('thingyApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.datepicker',
  'ui.bootstrap.pagination',
  'ui.select2',
  'ngGrid',
  'ngTable',
  'infinite-scroll'
])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
           .state('main', {
        url: '/',
        templateUrl: 'main/main.html',
        controller: 'mainCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .state('adddevice', {
        url: '/adddevice',
        templateUrl: 'device/add-device.html',
        controller: 'addDeviceCtrl'
      })
      .state('addSensor', {
        url: '/{deviceId}/addsensor',
        templateUrl: 'components/sensors/add-sensors-modal.html',
        controller: 'addSensorCtrl'
      })
      .state('configuredevice', {
        url: '/{deviceId}/configuredevice',
        templateUrl: 'device/configure-device.html',
        controller: 'configureDeviceCtrl'
      });


    $urlRouterProvider.otherwise('/');

    // Intercept 401s and 403s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401 || response.status === 403) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth, $modal) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });

    // $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
    //   // console.log(event, toState, toParams, fromState, fromParams);
    //   // console.log($rootScope.modal);
    //   console.log('in');
    //   if ($rootScope.modal) {
    //     console.log('blocking');
    //     event.preventDefault();
    //   }
    //   // transitionTo() promise will be rejected with 
    //   // a 'transition prevented' error
    // });

    $rootScope.$on('$locationChangeStart', function(event, next, current){ 
      // console.log(event, toState, toParams, fromState, fromParams);
      // console.log($rootScope.modal);
      if ($rootScope.modal) {
        console.log('blocking location change due to modal.');
        event.preventDefault();
      }
      // transitionTo() promise will be rejected with 
      // a 'transition prevented' error
    });
  });


