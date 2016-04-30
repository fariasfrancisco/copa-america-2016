'use strict';

class SettingsController {
  constructor(Auth) {
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'NEW_PASSWORD_SUCCESS';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'INCORRECT_PASSWORD';
          this.message = 'EMPTY';
        });
    }
  }
}

angular.module('copaamericaApp')
  .controller('SettingsController', SettingsController);
