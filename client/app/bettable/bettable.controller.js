'use strict';
(function () {

  class BettableComponent {
    constructor(QueryService, BetTableService, $scope) {
      this.querySvc = QueryService;
      this.betTableSvc = BetTableService;
      this.betRows = [];
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

              if (this.bets.length < 1) {
                this.$scope.$applyAsync(() => {
                  this.loaded = true;
                  this.noBets = true;
                });

                return;
              }

              this.bets.forEach(bet => {
                this.betRows.push({
                  user: bet.name,
                  points: {
                    MAT: 0, GA: 0, GB: 0, GC: 0, GD: 0, POD: 0, STR: 0, TOT: 0
                  }
                });
              });

              this.$scope.$applyAsync(() => {
                this.loaded = true;
              });

              this.betTableSvc.calculatePoints(this.bets, this.betRows);
            });
        });
    }

    refresh() {
      this.loaded = false;
      this.betRows = [];
      this.$onInit();
    }
  }

  angular.module('copaamericaApp')
    .component('bettable', {
      templateUrl: 'app/bettable/bettable.html',
      controller: BettableComponent
    });
})();
