'use strict';

angular.module('copaamericaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('tournament', {
        url: '/tournament',
        template: '<tournament></tournament>'
      });
  });
