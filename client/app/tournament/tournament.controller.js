'use strict';

(function () {

  class TournamentComponent {
    constructor(QueryService, TeamLogoService, TournamentService) {
      this.querySvc = QueryService;
      this.logoPaths = TeamLogoService;
      this.tournamentSvc = TournamentService;
      this.groups = {};
      this.brackets = {};
    }

    $onInit() {
      let self = this,
        now = new Date(),
        matchDate;

      this.querySvc.buildGroupsAndTeams()
        .then(() => {
          let groups = self.querySvc.getGroups();

          groups.forEach(group => {
            let allPlayed = true;

            group.matches.forEach(match => {
              matchDate = new Date(match.date);
              if (matchDate > now) allPlayed = false;
            });

            if (allPlayed) {
              self.querySvc.buildTable(group)
                .then(table => {
                  self.groups[group.name] = {
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
        });
    }

  }

  angular.module('copaamericaApp')
    .component('tournament', {
      templateUrl: 'app/tournament/tournament.html',
      controller: TournamentComponent
    });
})();
