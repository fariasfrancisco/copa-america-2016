'use strict';

angular.module('copaamericaApp')
  .config(function ($translateProvider) {
    /*$translateProvider.useStaticFilesLoader({
      prefix: '../../assets/languages/',
      suffix: '.json'
    });*/

    $translateProvider.preferredLanguage('es');
    
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  });
