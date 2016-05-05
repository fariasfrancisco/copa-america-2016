'use strict';
(function () {

  class BettableComponent {
    constructor(QueryService, BetTableService) {
      this.querySvc = QueryService;
      this.betTableSvc = BetTableService;
      this.betRows = [];
      this.podium = {};
    }

    $onInit() {
      let self = this;

      this.querySvc.getBets().then(bets => {
        self.bets = bets;

        bets.forEach(bet => {
          self.betRows.push({
            user: bet.name,
            points: {}
          });
        });

        self.groups = self.querySvc.getGroups();
        if (self.groups.length < 1) {
          self.querySvc.buildGroupsAndTeams().then(() => {
            self.groups = self.querySvc.getGroups();
            self.process();
          });
        } else {
          self.process();
        }
      });
    }

    process() {
      this.betTableSvc.processGroups(this.groups, this.bets, this.betRows);
      this.betTableSvc.processStage({fullName: 'quarter-final', shortName: 'QF'}, this.bets, this.betRows);
      this.betTableSvc.processStage({fullName: 'semi-final', shortName: 'SF'}, this.bets, this.betRows);
      this.betTableSvc.processThirdPlaceAndFinals(this.bets, this.podium, this.betRows);
      this.betTableSvc.processGoldenBoot(this.bets, this.betRows);
    }
  }

  angular.module('copaamericaApp')
    .component('bettable', {
      templateUrl: 'app/bettable/bettable.html',
      controller: BettableComponent
    });
})();
