'use strict';
(function () {

  class BettableComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
      this.betRow = [];
    }

    $onInit() {
      var self = this;

      this.querySvc.getBets()
        .then(function (bets) {
          self.bets = bets;
          self.groups = self.querySvc.getGroups();
          if(self.groups.length < 1) {
            self.querySvc.buildGroupsAndTeams()
              .then(function (groups) {
                self.groups = groups;
              });
          } else {
            
          }
        });
    }
  }

  angular.module('copaamericaApp')
    .component('bettable', {
      templateUrl: 'app/bettable/bettable.html',
      controller: BettableComponent
    });

})();
