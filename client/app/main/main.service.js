'use strict';

angular.module('copaamericaApp')
  .service('MainService', () => {
    let showLoginForm = false,
      showSignUpForm = false;

    return {
      setShowLoginForm(value) {
        showLoginForm = value;
      },
      
      getShowLoginForm() {
        return showLoginForm;
      },

      setShowSignUpForm(value) {
        showSignUpForm = value;
      },

      getShowSignUpForm() {
        return showSignUpForm;
      }
    };
  });
