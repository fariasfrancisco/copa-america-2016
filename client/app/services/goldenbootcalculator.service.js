'use strict';

angular.module('copaamericaApp')
  .service('GoldenBootCalculator', ['QueryService', function (QueryService) {
    let players = [];

    const comparePlayers = function (a, b) {
      if (a.goals > b.goals) return 1;
      else if (a.goals < b.goals) return -1;
      else return 0;
    };

    const buildPlayersList = function () {
      QueryService.getTeams()
        .then(teams => {
          teams.forEach(team => {
            team.players.forEach(player => {
              player._team = team._id;
              if (player.goals > 0) players.push(player);
            });
          });

          players.sort(comparePlayers);
        });
    };

    const trimPlayersList = function () {
      if (players.length > 0) {
        let i = 1,
          size = players.length;

        while (i < size) {
          if (players[i].goals < players[i - 1]) break;
        }

        if (i !== size) players.splice(i, size);
      }
    };

    return {
      getTopScorers() {
        buildPlayersList();
        trimPlayersList();

        return players;
      }
    };
  }]);
