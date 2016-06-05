'use strict';

angular.module('copaamericaApp')
  .service('BetTableService', ['QueryService', 'GoldenBootCalculator', (QueryService, GoldenBootCalculator) => {
    let groups, matches, tables, podium;

    const compareMatches = (a, b) => {
      if (a._id < b._id) return -1;
      else if (a._id > b._id) return 1;
      else return 0;
    };

    const compareBets = (a, b) => {
      if (a.points.TOT < b.points.TOT) return 1;
      else if (a.points.TOT > b.points.TOT) return -1;
      else return 0;
    };

    const buildMatchesArray = () => {
      let arr = [];

      groups.forEach(group => {
        arr = arr.concat(group.matches);
      });

      return arr.sort(compareMatches);
    };

    const buildPodium = () => {
      podium = {};

      const thirdPlaceMatch = matches[30],
        thirdPlaceGoals = thirdPlaceMatch.home.goals - thirdPlaceMatch.away.goals,
        thirdPlacePenalties = thirdPlaceMatch.home.penalties - thirdPlaceMatch.away.penalties,
        finalMatch = matches[31],
        finalGoals = finalMatch.home.goals - finalMatch.away.goals,
        finalPenalties = finalMatch.home.penalties - finalMatch.away.penalties;

      if (thirdPlaceGoals > 0) podium.third = thirdPlaceMatch.home._team;
      else if (thirdPlaceGoals < 0) podium.third = thirdPlaceMatch.away._team;
      else if (thirdPlacePenalties > 0) podium.third = thirdPlaceMatch.home._team;
      else if (thirdPlacePenalties < 0) podium.third = thirdPlaceMatch.away._team;
      else throw new Error('failed to calculate podium');

      if (finalGoals > 0) {
        podium.first = finalMatch.home._team;
        podium.second = finalMatch.away._team;
      } else {
        if (finalGoals < 0) {
          podium.first = finalMatch.away._team;
          podium.second = finalMatch.home._team;
        } else {
          if (finalPenalties > 0) {
            podium.first = finalMatch.home._team;
            podium.second = finalMatch.away._team;
          } else {
            if (finalPenalties < 0) {
              podium.first = finalMatch.away._team;
              podium.second = finalMatch.home._team;
            } else {
              throw new Error('failed to calculate podium');
            }
          }
        }
      }

      return podium;
    };

    const getPodium = () => {
      if (podium) return podium;
      else return buildPodium();
    };

    return {
      cleanInvalidBets(bets){
        let validBets = [],
          length = bets.length,
          count = 0;

        let clean = () => {
          if (count < length) {
            return QueryService.isValid(bets[count]._user)
              .then(valid => {
                if (valid) validBets.push(bets[count]);
                count++;
                return clean();
              });
          } else {
            return Promise.resolve(validBets);
          }
        };

        return clean();
      },

      calculatePoints(bets, betRows){
        const now = new Date();
        tables = [];

        let matchDate, matchGoals, matchPenalties, betGoals, betPenalties, betHome, betAway,
          lastMatchDateGroupA, lastMatchDateGroupB, lastMatchDateGroupC, lastMatchDateGroupD, lastMatchDate;

        QueryService.getAllGroups()
          .then(allGroups => {
            groups = allGroups;
            matches = buildMatchesArray();

            lastMatchDateGroupA = new Date(matches[17].date);
            lastMatchDateGroupA.setHours(lastMatchDateGroupA.getHours() + 2);

            if (lastMatchDateGroupA < now) {
              return QueryService.buildTable(groups[0]);
            } else {
              return Promise.resolve({});
            }
          })
          .then(tableA => {
            tables[groups[0].name] = tableA;

            lastMatchDateGroupB = new Date(matches[19].date);
            lastMatchDateGroupB.setHours(lastMatchDateGroupB.getHours() + 2);

            if (lastMatchDateGroupB < now) {
              return QueryService.buildTable(groups[1]);
            } else {
              return Promise.resolve({});
            }
          })
          .then(tableB => {
            tables[groups[1].name] = tableB;

            lastMatchDateGroupC = new Date(matches[21].date);
            lastMatchDateGroupC.setHours(lastMatchDateGroupC.getHours() + 2);

            if (lastMatchDateGroupC < now) {
              return QueryService.buildTable(groups[2]);
            } else {
              return Promise.resolve({});
            }
          })
          .then(tableC => {
            tables[groups[2].name] = tableC;

            lastMatchDateGroupD = new Date(matches[23].date);
            lastMatchDateGroupD.setHours(lastMatchDateGroupD.getHours() + 2);

            if (lastMatchDateGroupD < now) {
              return QueryService.buildTable(groups[3]);
            } else {
              return Promise.resolve({});
            }
          })
          .then(tableD => {
            tables[groups[3].name] = tableD;

            lastMatchDate = new Date(matches[31].date);
            lastMatchDate.setHours(lastMatchDate.getHours() + 3);

            return GoldenBootCalculator.getTopScorers();
          })
          .then(goldenBootPlayers => {
            bets.forEach((bet, index) => {
              matches.forEach(match => {
                matchDate = new Date(match.date);
                matchDate.setHours(matchDate.getHours() + 2);

                if (matchDate < now) {
                  betHome = bet.matches[match._id].home;
                  betAway = bet.matches[match._id].away;

                  betGoals = betHome.goals - betAway.goals;
                  matchGoals = match.home.goals - match.away.goals;

                  if (Math.sign(matchGoals) === Math.sign(betGoals)) {
                    if (match._id > 23 && betGoals === 0) {
                      betPenalties = betHome.penalties - betAway.penalties;
                      matchPenalties = match.home.penalties - match.away.penalties;

                      if (Math.sign(matchPenalties) === Math.sign(betPenalties)) {
                        betRows[index].points.MAT += 2;

                        if (matchGoals === betGoals && matchPenalties === betPenalties) {
                          betRows[index].points.MAT += 3;
                        }
                      }
                    } else {
                      betRows[index].points.MAT += 2;

                      if (match.home.goals === betHome.goals &&
                        match.away.goals === betAway.goals)
                        betRows[index].points.MAT += 3;
                    }
                  }
                }
              });

              if (lastMatchDateGroupA < now) {
                let table = tables[groups[0].name];

                if (table[0].team === bet.groups[0].first &&
                  table[1].team === bet.groups[0].second) {
                  betRows[index].points[groups[0].name] += 5;
                }
              }

              if (lastMatchDateGroupB < now) {
                let table = tables[groups[1].name];

                if (table[0].team === bet.groups[1].first &&
                  table[1].team === bet.groups[1].second) {
                  betRows[index].points[groups[1].name] += 5;
                }
              }

              if (lastMatchDateGroupC < now) {
                let table = tables[groups[2].name];

                if (table[0].team === bet.groups[2].first &&
                  table[1].team === bet.groups[2].second) {
                  betRows[index].points[groups[2].name] += 5;
                }
              }

              if (lastMatchDateGroupD < now) {
                let table = tables[groups[3].name];

                if (table[0].team === bet.groups[3].first &&
                  table[1].team === bet.groups[3].second) {
                  betRows[index].points[groups[3].name] += 5;
                }
              }

              if (lastMatchDate < now) {
                const podium = getPodium();
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
              }

              if (goldenBootPlayers.length > 0) {
                goldenBootPlayers.forEach(player => {
                  if (bet.goldenBoot._team === player._team &&
                    bet.goldenBoot._player === player._id) {
                    betRows[index].points.STR += 50;
                  }
                });
              }

              betRows[index].points.TOT += betRows[index].points.MAT;
              betRows[index].points.TOT += betRows[index].points.GA;
              betRows[index].points.TOT += betRows[index].points.GB;
              betRows[index].points.TOT += betRows[index].points.GC;
              betRows[index].points.TOT += betRows[index].points.GD;
              betRows[index].points.TOT += betRows[index].points.POD;
              betRows[index].points.TOT += betRows[index].points.STR;

              betRows.sort(compareBets);
            });
          });
      }
    };
  }]);
