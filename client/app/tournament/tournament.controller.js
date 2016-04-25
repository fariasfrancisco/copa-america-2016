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
            var allPlayed = true
              , now = new Date()
              , matchDate;

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
    }

    //TODO missing rest of the tournament logic.
  }

  angular.module('copaamericaApp')
    .component('tournament', {
      templateUrl: 'app/tournament/tournament.html',
      controller: TournamentComponent
    });

})();
