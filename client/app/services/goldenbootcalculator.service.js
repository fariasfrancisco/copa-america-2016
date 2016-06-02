'use strict';

angular.module('copaamericaApp')
  .service('GoldenBootCalculator', ['QueryService', (QueryService) => {
    let players;

    const comparePlayers = (a, b) => {
      if (a.goals > b.goals) return 1;
      else if (a.goals < b.goals) return -1;
      else return 0;
    };

    const buildPlayersList = () => {
      return QueryService.getTeams()
        .then(teams => {
          let arr = [];

          teams.forEach(team => {
            team.players.forEach(player => {
              player._team = team._id;
              if (player.goals > 0) arr.push(player);
            });
          });

          return arr.sort(comparePlayers);
        });
    };

    const trimPlayersList = () => {
      if (players.length > 0) {
        let i = 1;
        const size = players.length;

        while (i < size) {
          if (players[i].goals < players[i - 1]) break;
        }

        if (i !== size) players.splice(i, size);
      }
    };

    return {
      getTopScorers() {
        if (players) {
          return Promise.resolve(players);
        } else {
          return buildPlayersList()
            .then(playersArr => {
              players = playersArr;

              trimPlayersList();

              return players;
            });
        }
      }
    };
  }]);
