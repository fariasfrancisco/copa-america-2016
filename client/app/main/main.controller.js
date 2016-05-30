'use strict';

(function () {

  class MainComponent {
    constructor(Auth, MainService, QueryService) {
      this.isLoggedIn = Auth.isLoggedIn;
      this.mainSvc = MainService;
      this.querySvc = QueryService;
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
