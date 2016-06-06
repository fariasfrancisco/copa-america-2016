'use strict';

(function () {

  class TournamentComponent {
    constructor(QueryService, TeamLogoService, TournamentService, GoldenBootCalculator, $scope) {
      this.querySvc = QueryService;
      this.logoPaths = TeamLogoService;
      this.tournamentSvc = TournamentService;
      this.goldenBootSvc = GoldenBootCalculator;
      this.$scope = $scope;
      this.groups = [];
      this.brackets = {};
      this.loaded = false;
    }

    $onInit() {
      let now = new Date(),
        matchDate;

      this.querySvc.buildGroupsAndTeams()
        .then(() => {
          this.querySvc.getGroups()
            .then(groups => {
              this.groupsArr = groups;

              groups.forEach(group => {
                let allPlayed = true;

                group.matches.forEach(match => {
                  matchDate = new Date(match.date);

                  if (matchDate > now) allPlayed = false;
                });

                if (allPlayed) {
                  this.querySvc.buildTable(group)
                    .then(table => {
                      this.groups[group.name] = {
                        first: table[0],
                        second: table[1]
                      };
                    });
                }
              });

              this.tournamentSvc.processBracket('quarter-final', this.brackets);
              this.tournamentSvc.processBracket('semi-final', this.brackets);
              this.tournamentSvc.processBracket('third-place', this.brackets);
              this.tournamentSvc.processBracket('final', this.brackets);

              this.goldenBootSvc.getTopScorers()
                .then(topScorers => {
                  this.topScorers = topScorers;
                });

              this.$scope.$applyAsync(() => {
                this.loaded = true;
              });
            });
        });
    }
  }

  angular.module('copaamericaApp')
    .component('tournament', {
      templateUrl: 'app/tournament/tournament.html',
      controller: TournamentComponent
    });
})();
