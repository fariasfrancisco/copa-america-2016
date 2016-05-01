'use strict';

class SignupController {
  //start-non-standard
  user = {};
  errors = {};
  submitted = false;
  //end-non-standard

  constructor(Auth, $state, MainService) {
    this.Auth = Auth;
    this.$state = $state;
    this.mainSvc = MainService;

  }

  toggleLoginForm() {
    this.mainSvc.setShowLoginForm(true);
    this.mainSvc.setShowSignUpForm(false);
  }

  register(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        })
        .then(() => {
          // Account created, redirect to home
          this.mainSvc.setShowLoginForm(false);
          this.mainSvc.setShowSignUpForm(false);
          this.$state.go('bet');
        })
        .catch(err => {
          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        });
    }
  }
}

angular.module('copaamericaApp')
  .directive('signup', function () {
    return {
      templateUrl: 'app/signup/signup.html',
      restrict: 'EA',
      controller: SignupController,
      controllerAs: 'signupCtrl'
    };
  });
