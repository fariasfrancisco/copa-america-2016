'use strict';
(function () {

  class TournamentComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
    }

    $onInit() {
      this.querySvc.buildGroupsAndTeams();
    }

    //TODO missing rest of the tournament logic.
  }

  angular.module('copaamericaApp')
    .component('tournament', {
      templateUrl: 'app/tournament/tournament.html',
      controller: TournamentComponent
    });

})();
