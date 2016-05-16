'use strict';

angular.module('copaamericaApp', [
  'copaamericaApp.auth',
  'copaamericaApp.admin',
  'copaamericaApp.constants',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'pascalprecht.translate'
])
  .config(function ($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
