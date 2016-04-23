'use strict';

angular.module('copaamericaApp')
  .service('MainService', function () {
    var showButton = true;
    var showLoginForm = false;
    var showSignUpForm = false;

    return {
      setShowButton: function (value) {
        showButton = value;
      },

      getShowButton: function () {
        return showButton;
      },

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
