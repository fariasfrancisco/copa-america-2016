'use strict';

angular.module('copaamericaApp')
  .service('GoldenBootCalculator', ['QueryService', (QueryService) => {
    let players;

    const comparePlayers = (a, b) => {
      if (a.goals > b.goals) return -1;
      else if (a.goals < b.goals) return 1;
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

    const trimPlayersList = (arr) => {
      let out = [];

      if (arr.length > 0) {
        const goalAmount = arr[0].goals;
        const length = arr.size;

        for (let i = 0; i < length; i++) {
          if (Number(player.goals) === goalAmount) out.push(player);
          else break;
        }
      }

      return out;
    };

    return {
      getTopScorers() {
        if (players) {
          return Promise.resolve(players);
        } else {
          return buildPlayersList()
            .then(playersArr => {
              players = trimPlayersList(playersArr);

              return players;
            });
        }
      }
    };
  }]);
