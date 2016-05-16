'use strict';

class LoginController {
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
          this.errors.other = err.message;
        });
    }
  }
}

angular.module('copaamericaApp')
  .directive('login', function () {
    return {
      templateUrl: 'app/main/login/login.html',
      restrict: 'EA',
      controller: LoginController,
      controllerAs: 'loginCtrl'
    };
  });

