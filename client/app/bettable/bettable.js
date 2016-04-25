'use strict';

angular.module('copaamericaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bettable', {
        url: '/bettable',
        template: '<bettable></bettable>'
      });
  });
