let moment = require('moment');

module.exports = {};

let isInArray = function (value, array) {
  return array.indexOf(value) > -1;
};

let initializeTable = function (group) {
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
    })
  });

  return table;
};

let calculatePointsAndGoals = function (table, matches) {
  matches.forEach(current => {
    let matchEndTime = moment(current.date).add(2, 'h');

    if (moment().isBefore(matchEndTime)) return;

    let homeTeam = current.home._team,
      awayTeam = current.away._team,
      homeTeamIndex = null,
      awayTeamIndex = null,
      result;

    table.forEach((current, index) => {
      if (current.team === homeTeam) homeTeamIndex = index;
      if (current.team === awayTeam) awayTeamIndex = index;
    });

    if (homeTeamIndex === null || awayTeamIndex === null) {
      throw new Error('could not find team index!');
    }

    table[homeTeamIndex].goalsFor += current.home.goals;
    table[homeTeamIndex].goalsAgainst += current.away.goals;
    table[awayTeamIndex].goalsFor += current.away.goals;
    table[awayTeamIndex].goalsAgainst += current.home.goals;
    result = current.home.goals - current.away.goals;

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
  })
};

let compareTable = function (a, b) {
  if (a.points < b.points) return 1;
  else if (a.points > b.points) return -1;
  else if (a.goalDifference < b.goalDifference) return 1;
  else if (a.goalDifference > b.goalDifference) return -1;
  else if (a.goalsFor < b.goalsFor) return 1;
  else if (a.goalsFor > b.goalsFor) return -1;
  else return 0;
};

let calculatePositions = function (table) {
  table.sort(compareTable);

  table.forEach((current, index) => {
    current.position = index;
  });
};

module.exports.generate = function (group) {
  let table = initializeTable(group);
  calculatePointsAndGoals(table, group.matches);
  calculatePositions(table);
  
  return table;
};
