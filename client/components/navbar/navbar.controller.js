'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'HOME',
    'state': 'main'
  }, {
    'title': 'TOURNAMENT',
    'state': 'tournament'
  }, {
    'title': 'BET_TABLE',
    'state': 'bettable'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('copaamericaApp')
  .controller('NavbarController', NavbarController);
