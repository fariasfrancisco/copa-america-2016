'use strict';

angular.module('copaamericaApp')
  .service('TableCalculator', function () {
    var isInArray = function (value, array) {
      return array.indexOf(value) > -1;
    };

    var initializeTable = function (group) {
      var list = []
        , table = [];

      group.matches.forEach(function (match) {
        if (!isInArray(match.home._team, list)) list.push(match.home._team);
        if (!isInArray(match.away._team, list)) list.push(match.away._team);
      });

      list.forEach(function (current, index) {
        table.push({
          team: current,
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          position: index
        })
      });

      return table;
    };

    var calculatePointsAndGoals = function (table, matches) {
      matches.forEach(function (current) {
        var homeTeam = current.home._team
          , awayTeam = current.away._team
          , homeTeamIndex = null
          , awayTeamIndex = null
          , result;

        table.forEach(function (current, index) {
          if (current.team === homeTeam) homeTeamIndex = index;
          if (current.team === awayTeam) awayTeamIndex = index;
        });

        if (homeTeamIndex === null || awayTeamIndex === null) {
          throw new Error('could not find team index!');
        }

        table[homeTeamIndex].goalsFor += Number(current.home.goals);
        table[homeTeamIndex].goalsAgainst += Number(current.away.goals);
        table[awayTeamIndex].goalsFor += Number(current.away.goals);
        table[awayTeamIndex].goalsAgainst += Number(current.home.goals);
        result = Number(current.home.goals) - Number(current.away.goals);

        if (result > 0) {
          table[homeTeamIndex].points += 3;
        } else {
          if (result < 0) {
            table[awayTeamIndex].points += 3;
          } else {
            table[homeTeamIndex].points += 1;
            table[awayTeamIndex].points += 1;
          }
        }
      });

      table.forEach(function (current) {
        current.goalDifference = current.goalsFor - current.goalsAgainst;
      })
    };

    var calculatePositions = function (table) {
      var size = table.length
        , aux;

      for (var i = 0; i < size - 1; i++) {
        for (var j = i + 1; j < size; j++) {
          if (table[i].points < table[j].points) {
            if (table[i].position < table[j].position) {
              aux = table[i].position;
              table[i].position = table[j].position;
              table[j].position = aux;
            }
          } else {
            if (table[i].points === table[j].points) {
              if (table[i].goalDifference < table[j].goalDifference) {
                if (table[i].position < table[j].position) {
                  aux = table[i].position;
                  table[i].position = table[j].position;
                  table[j].position = aux;
                }
              } else {
                if (table[i].goalDifference === table[j].goalDifference
                  && table[i].goalsFor < table[j].goalsFor
                  && table[i].position < table[j].position) {
                  aux = table[i].position;
                  table[i].position = table[j].position;
                  table[j].position = aux;
                }
              }
            }
          }
        }
      }
    };

    var cleanTable = function (table, name) {
      while (table.length > 2) {
        table.forEach(function (current, index) {
          if (current.position > 1) {
            table.splice(index, 1)
          }
        })
      }

      table.forEach(function (current) {
        current.groupPosition = name + current.position;
      })
    };

    return {
      generate: function (group) {
        var table = initializeTable(group);
        calculatePointsAndGoals(table, group.matches);
        calculatePositions(table);
        cleanTable(table, group.name);
        return table;
      }
    }
  });
