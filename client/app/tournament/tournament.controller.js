'use strict';
(function () {

  class TournamentComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
    }

    $onInit() {
      this.querySvc.buildGroupsAndTeams();
    }
  }

  angular.module('copaamericaApp')
    .component('tournament', {
      templateUrl: 'app/tournament/tournament.html',
      controller: TournamentComponent
    });

})();
