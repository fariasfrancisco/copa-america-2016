'use strict';
(function () {

  class TournamentComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
      this.groups = {};
    }

    $onInit() {
      var self = this;

      this.querySvc.buildGroupsAndTeams()
        .then(function (groups) {
          groups.forEach(function (group) {
            var allPlayed = true,
              now = new Date(),
              matchDate;

            group.matches.forEach(function (match) {
              matchDate = new Date(match.date);
              if (matchDate > now) allPlayed = false;
            });

            if (allPlayed) {
              self.querySvc.buildTable(group).then(function () {
                self.groups[group.name] = {
                  first: group.table[0],
                  second: group.table[1]
                };
              });
            }
          });
        });

      this.querySvc.getStage('quarter-final')
        .then(function (quarterFinals) {
          quarterFinals.forEach(function (current) {
            var now = new Date(),
              matchDate = new Date(current.matches[0].date);

            if (matchDate < now) {
              self[current.name] = {
                home: current.matches[0].home,
                away: current.matches[0].away
              };

              if (current.matches[0].home.goals > current.matches[0].away.goals) {
                self[current.name].winner = {team: current.matches[0].home._team};
              } else {
                if (current.matches[0].home.goals < current.matches[0].away.goals) {
                  self[current.name].winner = {team: current.matches[0].away._team};
                } else {
                  if (current.matches[0].home.penalties > current.matches[0].away.penalties) {
                    self[current.name].winner = {team: current.matches[0].home._team};
                  } else {
                    if (current.matches[0].home.penalties < current.matches[0].away.penalties) {
                      self[current.name].winner = {team: current.matches[0].away._team};
                    } else {
                      // TODO same.
                    }
                  }
                }
              }

              self[current.name].winner.teamName = self.querySvc.getTeams()[self[current.name].winner.team].name;
            }
          })
        });

    }

    //TODO missing rest of the tournament logic.
  }

  angular.module('copaamericaApp')
    .component('tournament', {
      templateUrl: 'app/tournament/tournament.html',
      controller: TournamentComponent
    });

})();
