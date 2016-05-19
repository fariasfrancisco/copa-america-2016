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
      this.querySvc.getBets()
        .then(bets => {
          this.betTableSvc.cleanInvalidBets(bets)
            .then(validBets => {
              this.bets = validBets;

              this.bets.forEach(bet => {
                this.betRows.push({
                  user: bet.name,
                  points: {}
                });
              });

              this.querySvc.getGroups()
                .then(groups => {
                  this.groups = groups;
                  this.process();
                });
            });
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
