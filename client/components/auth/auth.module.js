'use strict';

angular.module('copaamericaApp.auth', [
  'copaamericaApp.constants',
  'copaamericaApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
