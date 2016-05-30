'use strict';
(function () {

  class LoginComponent {
    constructor(Auth, MainService, $state) {
      this.user = {};
      this.errors = {};
      this.submitted = false;

      this.mainSvc = MainService;
      this.Auth = Auth;
      this.$state = $state;
    }

    toggleSignUpForm() {
      this.mainSvc.setShowSignUpForm(true);
      this.mainSvc.setShowLoginForm(false);
    }

    login(form) {
      this.submitted = true;
      if (form.$valid) {
        this.Auth.login({
          email: this.user.email,
          password: this.user.password
        })
          .then(() => {
            // Logged in, redirect to home
            this.mainSvc.setShowLoginForm(false);
            this.mainSvc.setShowSignUpForm(false);
            this.$state.go('bet');
          })
          .catch(err => {
            this.$state.go('main');
            this.errors.other = err.message;
          });
      }
    }
  }

  angular.module('copaamericaApp')
    .component('login', {
      templateUrl: 'app/login/login.html',
      controller: LoginComponent,
      controllerAs: 'loginCtrl'
    });
})();
