'use strict';

angular.module('copaamericaApp')
  .service('TournamentService', ['QueryService', (QueryService) => {
    return {
      processBracket(stageName, brackets) {
        let now = new Date(),
          matchDate, winner, loser;

        QueryService.getStage(stageName)
          .then(stage => {
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

                QueryService.getTeams()
                  .then(teams => {
                    winner.teamName = teams[winner.team].name;
                    loser.teamName = teams[loser.team].name;
                  });
                
                brackets[current.name] = {
                  winner: winner,
                  loser: loser
                };
              }
            });
          });
      }
    };
  }]);
