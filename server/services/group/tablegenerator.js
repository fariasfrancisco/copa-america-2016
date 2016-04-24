var moment = require('moment');

module.exports = {};

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
    var matchEndTime = moment(current.date).add(2, 'h');

    if (moment().isBefore(matchEndTime)) return;

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

module.exports.generate = function (group) {
  var table = initializeTable(group);
  calculatePointsAndGoals(table, group.matches);
  calculatePositions(table);
  return table;
};
