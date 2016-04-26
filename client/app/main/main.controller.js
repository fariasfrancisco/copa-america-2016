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
      this.mainSvc.setShowButton(false);
    }

    $onInit() {
      this.mainSvc.setShowButton(true);
      this.mainSvc.setShowLoginForm(false);
      this.mainSvc.setShowSignUpForm(false);

      if (this.isLoggedIn()) {
        this.mainSvc.setShowButton(false);
      }
    }
  }

  angular.module('copaamericaApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainComponent
    });
})();
