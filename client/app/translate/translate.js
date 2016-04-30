angular.module('copaamericaApp')
  .config(function ($translateProvider) {
    $translateProvider.preferredLanguage('es');
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  });
