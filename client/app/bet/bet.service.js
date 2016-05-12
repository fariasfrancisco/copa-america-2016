'use strict';

angular.module('copaamericaApp')
  .service('BetService', ['QueryService', 'TableCalculator', function (QueryService, TableCalculator) {

    /**
     * The following constant help me distribute teams in the quarter finals bracket,
     * the number in each array references a group (i.e 0 => A, 1 => B, etc.) and the
     * position in the array itself indicates the position in the group: 0 => first, 1 => second.
     */
    const QUARTER_FINALS_DIST = {
      '24': [0, 1],
      '25': [3, 2],
      '26': [1, 0],
      '27': [2, 3]
    };

    /**
     * This constant helps me distribute teams into the finals and third place match, knowing that
     * the teams that participate in game 28 will go into the home side and the teams that play
     * game 29 will land on the away side.
     */
    const FINALS_DIST = {'28': 'home', '29': 'away'};

    return {
      betInitialize(bet) {
        return QueryService.cloneGroups()
          .then(groups => {
            groups.forEach(group => {
              group.matches.forEach(match => {
                bet.matches[match._id].home._team = match.home._team;
                bet.matches[match._id].away._team = match.away._team;
              });
            });

            let winner, side, matchId, qfHome, qfAway,
              desc = 4;

            for (let qfIndex = 24; qfIndex < 28; qfIndex++) {
              qfHome = bet.matches[qfIndex].home;
              qfAway = bet.matches[qfIndex].away;

              qfHome._team = bet.groups[QUARTER_FINALS_DIST[qfIndex][0]].first;
              qfAway._team = bet.groups[QUARTER_FINALS_DIST[qfIndex][1]].second;

              if (qfHome.goals > qfAway.goals) winner = qfHome._team;
              else if (qfHome.goals < qfAway.goals) winner = qfAway._team;
              else if (qfHome.penalties > qfAway.penalties) winner = qfHome._team;
              else if (qfHome.penalties < qfAway.penalties) winner = qfAway._team;

              //the following logic distributes the teams in the semi finals brackets.

              matchId = qfIndex + desc;

              if (qfIndex % 2 === 0) {
                side = 'home';
                desc--;
              }
              else {
                side = 'away';
              }

              bet.matches[matchId][side]._team = winner;
            }

            for (let i = 28; i < 30; i++) {
              if (bet.matches[i].home.goals > bet.matches[i].away.goals) {
                bet.matches[31][FINALS_DIST[i]]._team = bet.matches[i].home._team;
                bet.matches[30][FINALS_DIST[i]]._team = bet.matches[i].away._team;
              } else {
                if (bet.matches[i].home.goals < bet.matches[i].away.goals) {
                  bet.matches[31][FINALS_DIST[i]]._team = bet.matches[i].home._team;
                  bet.matches[30][FINALS_DIST[i]]._team = bet.matches[i].away._team;
                } else {
                  if (bet.matches[i].home.penalties > bet.matches[i].away.penalties) {
                    bet.matches[31][FINALS_DIST[i]]._team = bet.matches[i].home._team;
                    bet.matches[30][FINALS_DIST[i]]._team = bet.matches[i].away._team;
                  } else {
                    if (bet.matches[i].home.penalties < bet.matches[i].away.penalties) {
                      bet.matches[31][FINALS_DIST[i]]._team = bet.matches[i].home._team;
                      bet.matches[30][FINALS_DIST[i]]._team = bet.matches[i].away._team;
                    }
                  }
                }
              }
            }

            bet.matches.forEach(match => {
              match.home.teamName = QueryService.getTeams()[match.home._team].name;
              match.away.teamName = QueryService.getTeams()[match.away._team].name;
            });
          });
      },

      noBetInitialize(user) {
        return QueryService.cloneGroups()
          .then(groups => {
            let bet = {
              user: user,
              groups: {},
              matches: {}
            };

            for (let i = 0; i < 32; i++) {
              bet.matches[i] = {
                home: {goals: 0, penalties: 0},
                away: {goals: 0, penalties: 0}
              };
            }

            groups.forEach(group => {
              bet.groups[group.name] = {first: '', second: ''};
            });

            return {bet: bet, groups: groups};
          });
      },

      buildQuarterFinals(groups, bet) {
        let teams = {};

        groups.forEach(group => {
          group.matches.forEach(match => {
            if (match.home.goals === '') match.home.goals = 0;
            if (match.away.goals === '') match.away.goals = 0;

            bet.matches[match._id].home.goals = match.home.goals;
            bet.matches[match._id].away.goals = match.away.goals;
          });

          let groupTable = TableCalculator.generate(group);

          groupTable.forEach(current => {
            teams[current.groupPosition] = {
              team: current.team,
              teamName: QueryService.getTeams()[current.team].name
            };
          });

          bet.groups[group.name].first = teams[group.name + '0'].team;
          bet.groups[group.name].second = teams[group.name + '1'].team;
        });

        //noinspection JSUnresolvedVariable
        return {
          fullName: 'QUARTER_FINALS',
          matches: [
            {
              _id: 24, shortName: 'Q1',
              home: {
                _team: teams.GA0.team,
                teamName: teams.GA0.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams.GB1.team,
                teamName: teams.GB1.teamName,
                goals: 0, penalties: 0
              }
            },
            {
              _id: 25, shortName: 'Q2',
              home: {
                _team: teams.GB0.team,
                teamName: teams.GB0.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams.GA1.team,
                teamName: teams.GA1.teamName,
                goals: 0, penalties: 0
              }
            },
            {
              _id: 26, shortName: 'Q3',
              home: {
                _team: teams.GC0.team,
                teamName: teams.GC0.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams.GD1.team,
                teamName: teams.GD1.teamName,
                goals: 0, penalties: 0
              }
            },
            {
              _id: 27, shortName: 'Q4',
              home: {
                _team: teams.GD0.team,
                teamName: teams.GD0.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams.GC1.team,
                teamName: teams.GC1.teamName,
                goals: 0, penalties: 0
              }
            }
          ]
        };
      },

      buildSemiFinals(quarterFinals, bet) {
        let teams = {};

        quarterFinals.matches.forEach(match => {
          bet.matches[match._id].home.goals = match.home.goals;
          bet.matches[match._id].away.goals = match.away.goals;
          bet.matches[match._id].home.penalties = match.home.penalties;
          bet.matches[match._id].away.penalties = match.away.penalties;

          if (match.home.goals > match.away.goals) {
            teams[match.shortName] = {
              team: match.home._team,
              teamName: match.home.teamName
            };
          } else {
            if (match.home.goals < match.away.goals) {
              teams[match.shortName] = {
                team: match.away._team,
                teamName: match.away.teamName
              };
            } else {
              if (match.home.penalties > match.away.penalties) {
                teams[match.shortName] = {
                  team: match.home._team,
                  teamName: match.home.teamName
                };
              } else {
                if (match.home.penalties < match.away.penalties) {
                  teams[match.shortName] = {
                    team: match.away._team,
                    teamName: match.away.teamName
                  };
                } else {
                  throw 'tieException';
                }
              }
            }
          }
        });

        //noinspection JSUnresolvedVariable
        return {
          fullName: 'SEMI_FINALS',
          matches: [
            {
              _id: 28, shortName: 'S1',
              home: {
                _team: teams.Q1.team,
                teamName: teams.Q1.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams.Q3.team,
                teamName: teams.Q3.teamName,
                goals: 0, penalties: 0
              }
            },
            {
              _id: 29, shortName: 'S2',
              home: {
                _team: teams.Q2.team,
                teamName: teams.Q2.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams.Q4.team,
                teamName: teams.Q4.teamName,
                goals: 0, penalties: 0
              }
            }
          ]
        };
      },

      buildFinals(semiFinals, bet) {
        let teams = {};

        semiFinals.matches.forEach(match => {
          bet.matches[match._id].home.goals = match.home.goals;
          bet.matches[match._id].away.goals = match.away.goals;
          bet.matches[match._id].home.penalties = match.home.penalties;
          bet.matches[match._id].away.penalties = match.away.penalties;

          if (match.home.goals > match.away.goals) {
            teams[match.shortName + 'W'] = {
              team: match.home._team,
              teamName: match.home.teamName
            };

            teams[match.shortName + 'L'] = {
              team: match.away._team,
              teamName: match.away.teamName
            };
          } else {
            if (match.home.goals < match.away.goals) {
              teams[match.shortName + 'W'] = {
                team: match.away._team,
                teamName: match.away.teamName
              };

              teams[match.shortName + 'L'] = {
                team: match.home._team,
                teamName: match.home.teamName
              };
            } else {
              if (match.home.penalties > match.away.penalties) {
                teams[match.shortName + 'W'] = {
                  team: match.home._team,
                  teamName: match.home.teamName
                };

                teams[match.shortName + 'L'] = {
                  team: match.away._team,
                  teamName: match.away.teamName
                };
              } else {
                if (match.home.penalties < match.away.penalties) {
                  teams[match.shortName + 'W'] = {
                    team: match.away._team,
                    teamName: match.away.teamName
                  };

                  teams[match.shortName + 'L'] = {
                    team: match.home._team,
                    teamName: match.home.teamName
                  };
                } else {
                  throw 'tieException';
                }
              }
            }
          }
        });

        let response = {};

        //noinspection JSUnresolvedVariable
        response.thirdPlace = {
          fullName: 'THIRD_PLACE',
          match: {
            _id: 30, shortName: 'TP',
            home: {
              _team: teams.S1L.team,
              teamName: teams.S1L.teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams.S2L.team,
              teamName: teams.S2L.teamName,
              goals: 0, penalties: 0
            }
          }
        };

        //noinspection JSUnresolvedVariable
        response.finals = {
          fullName: 'FINALS',
          match: {
            _id: 31, shortName: 'F',
            home: {
              _team: teams.S1W.team,
              teamName: teams.S1W.teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams.S2W.team,
              teamName: teams.S2W.teamName,
              goals: 0, penalties: 0
            }
          }
        };

        return response;
      },

      buildPodium(thirdPlace, finals, bet) {
        let third, second, first,
          thirdPlaceErr = false,
          finalsErr = false;

        bet.matches[thirdPlace.match._id].home.goals = thirdPlace.match.home.goals;
        bet.matches[thirdPlace.match._id].away.goals = thirdPlace.match.away.goals;
        bet.matches[thirdPlace.match._id].home.penalties = thirdPlace.match.home.penalties;
        bet.matches[thirdPlace.match._id].away.penalties = thirdPlace.match.away.penalties;

        bet.matches[finals.match._id].home.goals = finals.match.home.goals;
        bet.matches[finals.match._id].away.goals = finals.match.away.goals;
        bet.matches[finals.match._id].home.penalties = finals.match.home.penalties;
        bet.matches[finals.match._id].away.penalties = finals.match.away.penalties;

        if (thirdPlace.match.home.goals > thirdPlace.match.away.goals) {
          third = {
            _id: thirdPlace.match.home._team,
            name: thirdPlace.match.home.teamName
          };
        } else {
          if (thirdPlace.match.home.goals < thirdPlace.match.away.goals) {
            third = {
              _id: thirdPlace.match.away._team,
              name: thirdPlace.match.away.teamName
            };
          } else {
            if (thirdPlace.match.home.penalties > thirdPlace.match.away.penalties) {
              third = {
                _id: thirdPlace.match.home._team,
                name: thirdPlace.match.home.teamName
              };
            } else {
              if (thirdPlace.match.home.penalties < thirdPlace.match.away.penalties) {
                third = {
                  _id: thirdPlace.match.away._team,
                  name: thirdPlace.match.away.teamName
                };
              } else {
                thirdPlaceErr = true;
              }
            }
          }
        }

        if (finals.match.home.goals > finals.match.away.goals) {
          first = {
            _id: finals.match.home._team,
            name: finals.match.home.teamName
          };

          second = {
            _id: finals.match.away._team,
            name: finals.match.away.teamName
          };
        } else {
          if (finals.match.home.goals < finals.match.away.goals) {
            first = {
              _id: finals.match.away._team,
              name: finals.match.away.teamName
            };

            second = {
              _id: finals.match.home._team,
              name: finals.match.home.teamName
            };
          } else {
            if (finals.match.home.penalties > finals.match.away.penalties) {
              first = {
                _id: finals.match.home._team,
                name: finals.match.home.teamName
              };

              second = {
                _id: finals.match.away._team,
                name: finals.match.away.teamName
              };
            } else {
              if (finals.match.home.penalties < finals.match.away.penalties) {
                first = {
                  _id: finals.match.away._team,
                  name: finals.match.away.teamName
                };

                second = {
                  _id: finals.match.home._team,
                  name: finals.match.home.teamName
                };
              } else {
                finalsErr = true;
              }
            }
          }
        }

        if (thirdPlaceErr || finalsErr) {
          let ex = {};

          if (thirdPlaceErr) ex.thirdPlaceException = 'tieException';
          if (finalsErr) ex.finalsException = 'tieException';

          throw ex;
        }

        return {
          firstPlace: first,
          secondPlace: second,
          thirdPlace: third
        };
      }
    };
  }]);