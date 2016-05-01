angular.module('copaamericaApp')
  .config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'app/translate/languages/',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('es');
    
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
  });
