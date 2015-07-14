'use strict';

var angular = require('shimp-js').angular();
require('angular-ui-router');

angular.module('app', [
  'ui.router',
  'app.templates',
])

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.when('/', '/main');
  $urlRouterProvider.when('', '/main');

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'app/templates/main.jade',
    });
})

.run(function($rootScope) {

});
