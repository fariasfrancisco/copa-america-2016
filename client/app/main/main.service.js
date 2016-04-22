'use strict';

angular.module('copaamericaApp')
  .service('MainService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var showButton = true;
    var showLoginForm = false;
    var showSignUpForm = false;
    var showTables = false;
    
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
      },
      
      getShowTables: function() {
        return showTables;
      },
      
      setShowTables: function (value) {
        showTables = value;
      }
    }
  });
