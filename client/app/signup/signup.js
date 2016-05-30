'use strict';

angular.module('copaamericaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        template: '<signup></signup>'
      });
  });
