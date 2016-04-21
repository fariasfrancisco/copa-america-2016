module.exports = {};

var initializeTable = function (group) {
  var list = []
    , table = [];

  group.matches.forEach(function (current) {
    if (!current.home._team in list) list.push(current.home._team);
    if (!current.away._team in list) list.push(current.away._team);
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
      , homeTeamIndex = 0
      , awayTeamIndex = 0
      , result;

    table.forEach(function (current, index) {
      if (current === homeTeam) homeTeamIndex = index;
      if (current === awayTeam) awayTeamIndex = index;
    });

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
        table[homeTeamIndex].points += 3;
        table[awayTeamIndex].points += 3;
      }
    }
  });

  return table;
};

var swapPositions = function (table, a, b) {
  var aux = table[a].position;
  table[a].position = table[b].position;
  table[b].position = aux;

  return table;
};

var calculatePositions = function (table) {
  var size = table.length;

  for (var i = 0; i < size - 1; i++) {
    for (var j = i + 1; j < size; j++) {
      if (table[i].points < table[j].points) {
        table = swapPositions(table);
      } else {
        if (table[i].points === table[j].points) {
          var iGoalDifference = table[i].goalsFor - table[i].goalsAgainst
            , jGoalDifference = table[j].goalsFor - table[j].goalsAgainst;
          if (iGoalDifference < jGoalDifference) {
            table = swapPositions(table);
          } else {
            if (iGoalDifference === jGoalDifference) {
              if (table[i].goalsFor < table[j].goalsFor) {
                table = swapPositions(table);
              }
            }
          }
        }
      }
    }
  }

  return table;
};

module.exports.generate = function (group) {
  var table;
  table = initializeTable(group);
  table = calculatePointsAndGoals(table, group.matches);
  table = calculatePositions(table);
  return table;
};
