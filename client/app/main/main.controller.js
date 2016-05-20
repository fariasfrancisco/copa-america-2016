'use strict';

(function () {

  class MainComponent {
    constructor(Auth, MainService, QueryService, $translate) {
      this.isLoggedIn = Auth.isLoggedIn;
      this.mainSvc = MainService;
      this.querySvc = QueryService;
      this.$translate = $translate;
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
      
      this.querySvc.getValidUsersCount()
        .then(validUsersCount => {
          this.validUsersCount = validUsersCount;
        });
    }
  }

  angular.module('copaamericaApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainComponent
    });
})();
