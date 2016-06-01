'use strict';

(function () {

  class MainComponent {
    constructor(Auth, MainService, QueryService) {
      this.isLoggedIn = Auth.isLoggedIn;
      this.mainSvc = MainService;
      this.querySvc = QueryService;
      this.validUsersCount = 0;
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
          this.validUsersCount = Number(validUsersCount);
        });
    }
  }

  angular.module('copaamericaApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainComponent
    });
})();
