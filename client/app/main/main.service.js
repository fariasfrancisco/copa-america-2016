'use strict';

angular.module('copaamericaApp')
  .service('MainService', function () {
    let showLoginForm = false,
      showSignUpForm = false;

    return {
      setShowLoginForm: function (value) {
        showLoginForm = value;
      }
      ,
      getShowLoginForm: function () {
        return showLoginForm;
      },

      setShowSignUpForm: function (value) {
        showSignUpForm = value;
      },

      getShowSignUpForm: function () {
        return showSignUpForm;
      }
    }
  });
