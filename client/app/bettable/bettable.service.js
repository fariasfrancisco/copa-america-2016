'use strict';

angular.module('copaamericaApp')
  .service('BetTableService', ['QueryService', 'GoldenBootCalculator', function (QueryService, GoldenBootCalculator) {
    return {
      processGroups(groups, bets, betRows) {
        let now = new Date(),
          matchDate;

        groups.forEach(group => {
          QueryService.buildTable(group).then(table => {
            bets.forEach((bet, index) => {
              let groupIndex = 0,
                size = bet.groups.length,
                allPlayed = true;

              betRows[index].points[group.name] = 0;

              group.matches.forEach(match => {
                matchDate = new Date(match.date);

                if (matchDate < now) {
                  let matchGoals = match.home.goals - match.away.goals,
                    betGoals = bet.matches[match._id].home.goals - bet.matches[match._id].away.goals;

                  if (Math.sign(matchGoals) === Math.sign(betGoals)) {
                    betRows[index].points[group.name] += 2;
                    if (match.home.goals === bet.matches[match._id].home.goals &&
                      match.away.goals === bet.matches[match._id].away.goals) {
                      betRows[index].points[group.name] += 3;
                    }
                  }
                } else {
                  allPlayed = false;
                }
              });

              if (allPlayed) {
                while (group.name !== bet.groups[groupIndex].name && groupIndex < size) {
                  groupIndex++;
                }

                if (table[0].team === bet.groups[groupIndex].first &&
                  table[0].team === bet.groups[groupIndex].second) {
                  betRows[index].points[group.name] += 5;
                }
              }
            });
          });
        });
      },

      processStage(stageObj, bets, betRows) {
        QueryService.getStage(stageObj.fullName).then(stage => {
          let now, matchDate, matchHome, matchAway, betHome, betAway;

          stage.forEach(function (current) {
            matchHome = current.matches[0].home;
            matchAway = current.matches[0].away;
            now = new Date();
            matchDate = new Date(current.matches[0].date);

            if (matchDate > now) {
              bets.forEach((bet, index) => {
                betHome = bet.matches[current.matches[0]._id].home;
                betAway = bet.matches[current.matches[0]._id].away;

                betRows[index].points[stageObj.shortName] = 0;

                let matchGoals = matchHome.goals - matchAway.goals,
                  betGoals = betHome.goals - betAway.goals,
                  matchPenalties = matchGoals === 0 ? matchHome.penalties - matchAway.penalties : 0,
                  betPenalties = betGoals === 0 ? betHome.penalties - betAway.penalties : 0;

                if (Math.sign(matchGoals) === Math.sign(betGoals)) {
                  if (matchGoals === 0) {
                    if (Math.sign(matchPenalties) === Math.sign(betPenalties)) {
                      betRows[index].points[stageObj.shortName] += 2;

                      if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals &&
                        matchHome.penalties === betHome.penalties && matchAway.penalties === betAway.penalties) {
                        betRows[index].points[stageObj.shortName] += 3;
                      }
                    }
                  } else {
                    betRows[index].points[stageObj.shortName] += 2;

                    if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals) {
                      betRows[index].points[stageObj.shortName] += 3;
                    }
                  }
                }
              });
            }
          });
        });
      },

      processThirdPlaceAndFinals(bets, podium, betRows) {
        QueryService.getStage('third-place').then(stage => {
            let now = new Date(),
              matchDate = new Date(stage[0].matches[0].date),
              matchHome = stage[0].matches[0].home,
              matchAway = stage[0].matches[0].away;

            if (matchDate > now) {
              bets.forEach(function (bet, index) {
                betRows[index].points.TP = 0;

                let betHome = bet.matches[stage[0].matches[0]._id].home,
                  betAway = bet.matches[stage[0].matches[0]._id].away,
                  matchGoals = matchHome.goals - matchAway.goals,
                  betGoals = betHome.goals - betAway.goals,
                  matchPenalties = matchGoals === 0 ? matchHome.penalties - matchAway.penalties : 0,
                  betPenalties = betGoals === 0 ? betHome.penalties - betAway.penalties : 0;

                if (Math.sign(matchGoals) === Math.sign(betGoals)) {
                  if (matchGoals === 0) {
                    if (Math.sign(matchPenalties) === Math.sign(betPenalties)) {
                      betRows[index].points.TP += 2;
                      if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals &&
                        matchHome.penalties === betHome.penalties && matchAway.penalties === betAway.penalties) {
                        betRows[index].points.TP += 3;
                      }
                    }
                  } else {
                    betRows[index].points.TP += 2;
                    if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals) {
                      betRows[index].points.TP += 3;
                    }
                  }
                }
              });

              if (matchHome.goals > matchAway.goals) podium.third = matchHome._team;
              else if (matchHome.goals < matchAway.goals) podium.third = matchAway._team;
              else if (matchHome.penalties > matchAway.penalties) podium.third = matchHome._team;
              else if (matchHome.penalties < matchAway.penalties) podium.third = matchAway._team;

              QueryService.getStage('final').then(stage => {
                matchDate = new Date(stage[0].matches[0].date);
                matchHome = stage[0].matches[0].home;
                matchAway = stage[0].matches[0].away;

                if (matchDate > now) {
                  bets.forEach((bet, index) => {
                    betRows[index].points.F = 0;

                    let betHome = bet.matches[stage[0].matches[0]._id].home,
                      betAway = bet.matches[stage[0].matches[0]._id].away,
                      matchGoals = matchHome.goals - matchAway.goals,
                      betGoals = betHome.goals - betAway.goals,
                      matchPenalties = matchGoals === 0 ? matchHome.penalties - matchAway.penalties : 0,
                      betPenalties = betGoals === 0 ? betHome.penalties - betAway.penalties : 0;

                    if (Math.sign(matchGoals) === Math.sign(betGoals)) {
                      if (matchGoals === 0) {
                        if (Math.sign(matchPenalties) === Math.sign(betPenalties)) {
                          betRows[index].points.F += 2;
                          if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals &&
                            matchHome.penalties === betHome.penalties && matchAway.penalties === betAway.penalties) {
                            betRows[index].points.F += 3;
                          }
                        }
                      } else {
                        betRows[index].points.F += 2;
                        if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals) {
                          betRows[index].points.F += 3;
                        }
                      }
                    }
                  });

                  if (matchHome.goals > matchAway.goals) {
                    podium.first = matchHome._team;
                    podium.second = matchAway._team;
                  } else {
                    if (matchHome.goals < matchAway.goals) {
                      podium.first = matchAway._team;
                      podium.second = matchHome._team;
                    } else {
                      if (matchHome.penalties > matchAway.penalties) {
                        podium.first = matchHome._team;
                        podium.second = matchAway._team;
                      } else {
                        if (matchHome.penalties < matchAway.penalties) {
                          podium.first = matchAway._team;
                          podium.second = matchHome._team;
                        }
                      }
                    }
                  }

                  bets.forEach((bet, index) => {
                    let inPodium = false,
                      rightOrder = false;

                    betRows[index].points.POD = 0;

                    if (bet.podium.first === podium.first &&
                      bet.podium.second === podium.second &&
                      bet.podium.third === podium.third) {
                      inPodium = true;
                      rightOrder = true;
                    } else {
                      if ((bet.podium.first === podium.second || bet.podium.first === podium.third) &&
                        (bet.podium.second === podium.first || bet.podium.second === podium.third) &&
                        (bet.podium.third === podium.first || bet.podium.third === podium.second)) {
                        inPodium = true;
                      }
                    }

                    if (inPodium) betRows[index].points.POD += 25;
                    if (rightOrder) betRows[index].points.POD += 35;
                  });
                }
              });
            }
          }
        );
      },

      processGoldenBoot(bets, betRows) {
        let goldenBootPlayers = GoldenBootCalculator.getTopScorers();

        bets.forEach((bet, index) => {
          if (goldenBootPlayers.length > 0) {
            goldenBootPlayers.forEach(player => {
              if (bet.goldenBoot._team === player._team && bet.goldenBoot._player === player._id) {
                betRows[index].points.STR = 50;
              }
            });
          } else {
            betRows[index].points.STR = 0;
          }
        });
      }
    };
  }]);