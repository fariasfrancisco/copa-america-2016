'use strict';
(function () {

  class BettableComponent {
    constructor(QueryService, BetTableService, $scope) {
      this.querySvc = QueryService;
      this.betTableSvc = BetTableService;
      this.betRows = [];
      this.podium = {};
      this.$scope = $scope;
    }

    $onInit() {
      this.loaded = false;
      this.noBets = false;
      
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

                  if (this.betRows.length > 0) {
                    this.process();
                  }
                  else {
                    this.$scope.$applyAsync(() => {
                      this.noBets = true;
                    });
                  }

                  this.$scope.$applyAsync(() => {
                    this.loaded = true;
                  });
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

    refresh() {
      this.loaded = false;
      this.betRows = [];
      this.podium = {};
      this.$onInit();
    }
  }

  angular.module('copaamericaApp')
    .component('bettable', {
      templateUrl: 'app/bettable/bettable.html',
      controller: BettableComponent
    });
})();
