'use strict';
(function () {

  class BetComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
      this.groups = {};
      this.bet = {
        _user: '',
        matches: []
      };
    }

    $onInit() {
      var self = this;

      self.querySvc.cloneGroups().then(function (result) {
        self.groups = result;
      });

      for (var i = 0; i < 31; i++) {
        this.bet.matches.push({
          _id: i,
          home: {
            goals: 0,
            penalties: 0
          },
          away: {
            goals: 0,
            penalties: 0
          }
        });
      }
    }
  }

  angular.module('copaamericaApp')
    .component('bet', {
      templateUrl: 'app/bet/bet.html',
      controller: BetComponent
    });
})();
