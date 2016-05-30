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

  constructor(Auth, $translate) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
    this.$translate = $translate;
  }

  toggleLanguage(langKey) {
    let currentLang = this.$translate.use();

    if (langKey !== currentLang) this.$translate.use(langKey);
  }
}

angular.module('copaamericaApp')
  .controller('NavbarController', NavbarController);
