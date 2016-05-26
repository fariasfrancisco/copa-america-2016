'use strict';

angular.module('copaamericaApp')
  .service('AdminService', ['QueryService', function (QueryService) {
    let clone = function (obj) {
      return angular.copy(obj);
    };

    return {
      search(matchId, group, match) {
        let id = Number(matchId);

        if (match && match._id === id) return;

        if (group) {
          let found = false;

          group.matches.forEach(current => {
            if (current._id === id) {
              found = true;
              match = current;
            }
          });

          if (found) {
            return QueryService.searchTeam(match.home._team)
              .then(team => {
                match.home.team = team;

                return QueryService.searchTeam(match.away._team);
              })
              .then(team => {
                match.away.team = team;

                return {
                  match: match,
                  group: group
                };
              });
          }
        }

        return QueryService.searchMatch(id)
          .then(result => {
            group = result;

            result.matches.forEach(current => {
              if (current._id === id) match = current;
            });

            return QueryService.searchTeam(match.home._team);
          })
          .then(team => {
            match.home.team = team;

            return QueryService.searchTeam(match.away._team);
          })
          .then(team => {
            match.away.team = team;

            return {
              match: match,
              group: group
            };
          })
          .catch(() => {
            throw 'error';
          });
      },

      save(match, group, homeScorers, awayScorers) {
        let emptyHomeScorers = false,
          emptyAwayScorers = false,
          out = {
            successFlags: {
              saveHomeTeamSuccess: true,
              saveAwayTeamSuccess: true,
              saveGroupSuccess: true
            },
            errorFlags: {
              saveHomeTeamError: false,
              saveAwayTeamError: false,
              saveGroupError: false
            }
          };


        if (homeScorers.length < 1) emptyHomeScorers = true;
        if (awayScorers.length < 1) emptyAwayScorers = true;

        match.home.team.players.forEach(player => {
          homeScorers.forEach(scorer => {
            if (player._id === scorer.player._id) player.goals += Number(scorer.goals);
          });
        });

        match.away.team.players.forEach(player => {
          awayScorers.forEach(scorer => {
            if (player._id === scorer.player._id) player.goals += Number(scorer.goals);
          });
        });

        let homeTeam = clone(match.home.team),
          awayTeam = clone(match.away.team);

        delete match.home.team;
        delete match.away.team;

        match.home._team = Number(match.home._team);
        match.away._team = Number(match.away._team);
        match.home.goals = Number(match.home.goals);
        match.away.goals = Number(match.away.goals);
        match.home.penalties = Number(match.home.penalties);
        match.away.penalties = Number(match.away.penalties);

        return QueryService.saveTeam(homeTeam, emptyHomeScorers)
          .catch(() => {
            out.errorFlags.saveHomeTeamError = true;
            out.successFlags.saveHomeTeamSuccess = false;
          })
          .then(() => {
            return QueryService.saveTeam(awayTeam, emptyAwayScorers);
          })
          .catch(() => {
            out.errorFlags.saveAwayTeamError = true;
            out.successFlags.saveAwayTeamSuccess = false;
          })
          .then(() => {
            return QueryService.saveGroup(group);
          })
          .catch(() => {
            out.errorFlags.saveGroupError = true;
            out.successFlags.saveGroupSuccess = false;
          })
          .then(() => {
            return out;
          });
      }
    };
  }]);
