'use strict';

angular.module('copaamericaApp')
  .service('TableCalculator', function () {
    const isInArray = function (value, array) {
      return array.indexOf(value) > -1;
    };

    const initializeTable = function (group) {
      let list = [],
        table = [];

      group.matches.forEach(match => {
        if (!isInArray(match.home._team, list)) list.push(match.home._team);
        if (!isInArray(match.away._team, list)) list.push(match.away._team);
      });

      list.forEach(current => {
        table.push({
          team: current,
          points: 0,
          goalsFor: 0,
          goalsAgainst: 0
        });
      });

      return table;
    };

    const calculatePointsAndGoals = function (table, matches) {
      let homeTeam, awayTeam, homeTeamIndex, awayTeamIndex, result;

      matches.forEach(current => {
        homeTeam = current.home._team;
        awayTeam = current.away._team;
        homeTeamIndex = null;
        awayTeamIndex = null;

        table.forEach((current, index) => {
          if (current.team === homeTeam) homeTeamIndex = index;
          if (current.team === awayTeam) awayTeamIndex = index;
        });

        if (homeTeamIndex === null || awayTeamIndex === null) throw new Error('could not find team index!');

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

      table.forEach(current => {
        current.goalDifference = current.goalsFor - current.goalsAgainst;
      });
    };

    const compareTable = function (a, b) {
      if (a.points < b.points) return 1;
      else if (a.points > b.points) return -1;
      else if (a.goalDifference < b.goalDifference) return 1;
      else if (a.goalDifference > b.goalDifference) return -1;
      else if (a.goalsFor < b.goalsFor) return 1;
      else if (a.goalsFor > b.goalsFor) return -1;
      else return 0;
    };

    const comparePositions = function (a, b) {
      if (a.position > b.position) return 1;
      else if (a.position < b.position) return -1;
      else return 0;
    };

    const calculatePositions = function (table) {
      table.sort(compareTable);

      table.forEach((current, index) => {
        current.position = index;
      });
    };

    const cleanTable = function (table, name) {
      let cleanTable = [{}, {}];

      table.forEach((current) => {
        if (current.position < 2) {
          current.groupPosition = name + current.position;
          cleanTable[current.position] = current;
        }
      });

      return cleanTable.sort(comparePositions);
    };

    return {
      generate(group) {
        let table = initializeTable(group);

        calculatePointsAndGoals(table, group.matches);
        calculatePositions(table);

        return cleanTable(table, group.name);
      }
    };
  });
