'use strict';

(function () {

  class TournamentComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
      this.groups = {};
    }

    $onInit() {
      let self = this,
        now = new Date(),
        matchDate;

      this.querySvc.buildGroupsAndTeams().then(() => {
        let groups = self.querySvc.getGroups();

        groups.forEach(group => {
          let allPlayed = true;

          group.matches.forEach(match => {
           matchDate = new Date(match.date);
           if (matchDate > now) allPlayed = false;
           });

          if (allPlayed) {
            self.querySvc.buildTable(group).then(table => {
              self.groups[group.name] = {
                first: table[0],
                second: table[1]
              };
            });
          }
        });

        this.processBracket('quarter-final');
        this.processBracket('semi-final');
        this.processBracket('third-place');
        this.processBracket('final');
      });


    }

    processBracket(stageName) {
      let self = this,
        now = new Date(),
        matchDate;

      this.querySvc.getStage(stageName).then(stage => {
        let winner, loser;

        stage.forEach(current => {
          matchDate = new Date(current.matches[0].date);

          if (matchDate < now) {
            if (current.matches[0].home.goals > current.matches[0].away.goals) {
              winner = {team: current.matches[0].home._team};
              loser = {team: current.matches[0].away._team};
            } else {
              if (current.matches[0].home.goals < current.matches[0].away.goals) {
                winner = {team: current.matches[0].away._team};
                loser = {team: current.matches[0].home._team};
              } else {
                if (current.matches[0].home.penalties > current.matches[0].away.penalties) {
                  winner = {team: current.matches[0].home._team};
                  loser = {team: current.matches[0].away._team};
                } else {
                  if (current.matches[0].home.penalties < current.matches[0].away.penalties) {
                    winner = {team: current.matches[0].away._team};
                    loser = {team: current.matches[0].home._team};
                  }
                }
              }
            }

            winner.teamName = self.querySvc.getTeams()[winner.team].name;
            loser.teamName = self.querySvc.getTeams()[loser.team].name;

            self[current.name] = {
              winner: winner,
              loser: loser
            };
          }
        })
      });
    }
  }

  angular.module('copaamericaApp')
    .component('tournament', {
      templateUrl: 'app/tournament/tournament.html',
      controller: TournamentComponent
    });
})();
