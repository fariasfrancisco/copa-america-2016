'use strict';

angular.module('copaamericaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bet', {
        url: '/bet',
        template: '<bet></bet>'
      });
  });
