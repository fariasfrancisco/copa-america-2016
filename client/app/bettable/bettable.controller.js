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
                  points: {
                    MAT: 0, GA: 0, GB: 0, GC: 0, GD: 0, POD: 0, STR: 0
                  }
                });
              });

              if (this.betRows.length > 0) {
                this.betTableSvc.calculatePoints(this.bets, this.betRows);
              } else {
                this.$scope.$applyAsync(() => {
                  this.noBets = true;
                });
              }

              this.$scope.$applyAsync(() => {
                this.loaded = true;
              });
            });
        });
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
