'use strict';
(function () {

  class MainComponent {
    constructor(Auth, MainService, QueryService, $translate) {
      this.$translate = $translate;
      this.isLoggedIn = Auth.isLoggedIn;
      this.mainSvc = MainService;
      this.querySvc = QueryService;
    }

    toggleLanguage(langKey) {
      let currentLang = this.$translate.use();

      if (langKey !== currentLang) this.$translate.use(langKey);
    }

    toggleLoginForm() {
      this.mainSvc.setShowLoginForm(true);
      this.mainSvc.setShowSignUpForm(false);
    }

    $onInit() {
      this.mainSvc.setShowLoginForm(true);
      this.mainSvc.setShowSignUpForm(false);
    }
  }

  angular.module('copaamericaApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainComponent
    });
})();
