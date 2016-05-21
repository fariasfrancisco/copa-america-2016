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
                bet.matches[match._id].name = group.name;
                bet.matches[match._id].home._team = match.home._team;
                bet.matches[match._id].away._team = match.away._team;
              });
            });

            let winner, side, matchId, qfHome, qfAway,
              desc = 4;

            for (let qfIndex = 24; qfIndex < 28; qfIndex++) {
              qfHome = bet.matches[qfIndex].home;
              qfAway = bet.matches[qfIndex].away;

              bet.matches[qfIndex].name = 'Q' + (qfIndex - 23);

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
              bet.matches[i].name = 'S' + (i - 27);

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

            bet.matches[30].name = 'TP';
            bet.matches[31].name = 'F';

            return QueryService.getTeams();
          })
          .then(teams => {
            bet.matches.forEach(match => {
              match.home.teamName = teams[match.home._team].name;
              match.away.teamName = teams[match.away._team].name;
            });

            bet.goldenBoot.team = teams[bet.goldenBoot._team];

            bet.goldenBoot.team.players.forEach(player => {
              if (player._id === bet.goldenBoot._player) bet.goldenBoot.player = player;
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
        let qfTeams = {GA0: {}, GA1: {}, GB0: {}, GB1: {}, GC0: {}, GC1: {}, GD0: {}, GD1: {}};

        return QueryService.getTeams()
          .then(teams => {
            groups.forEach(group => {
              group.matches.forEach(match => {
                if (match.home.goals === '') match.home.goals = 0;
                if (match.away.goals === '') match.away.goals = 0;

                bet.matches[match._id].home.goals = match.home.goals;
                bet.matches[match._id].away.goals = match.away.goals;
              });

              let groupTable = TableCalculator.generate(group);

              groupTable.forEach(current => {
                qfTeams[current.groupPosition].team = current.team;
                qfTeams[current.groupPosition].teamName = teams[current.team].name;
              });

              bet.groups[group.name].first = qfTeams[group.name + '0'].team;
              bet.groups[group.name].second = qfTeams[group.name + '1'].team;
            });

            return {
              fullName: 'QUARTER_FINALS',
              matches: [
                {
                  _id: 24, shortName: 'Q1',
                  home: {
                    _team: qfTeams.GA0.team,
                    teamName: qfTeams.GA0.teamName,
                    goals: 0, penalties: 0
                  },
                  away: {
                    _team: qfTeams.GB1.team,
                    teamName: qfTeams.GB1.teamName,
                    goals: 0, penalties: 0
                  }
                },
                {
                  _id: 25, shortName: 'Q2',
                  home: {
                    _team: qfTeams.GB0.team,
                    teamName: qfTeams.GB0.teamName,
                    goals: 0, penalties: 0
                  },
                  away: {
                    _team: qfTeams.GA1.team,
                    teamName: qfTeams.GA1.teamName,
                    goals: 0, penalties: 0
                  }
                },
                {
                  _id: 26, shortName: 'Q3',
                  home: {
                    _team: qfTeams.GC0.team,
                    teamName: qfTeams.GC0.teamName,
                    goals: 0, penalties: 0
                  },
                  away: {
                    _team: qfTeams.GD1.team,
                    teamName: qfTeams.GD1.teamName,
                    goals: 0, penalties: 0
                  }
                },
                {
                  _id: 27, shortName: 'Q4',
                  home: {
                    _team: qfTeams.GD0.team,
                    teamName: qfTeams.GD0.teamName,
                    goals: 0, penalties: 0
                  },
                  away: {
                    _team: qfTeams.GC1.team,
                    teamName: qfTeams.GC1.teamName,
                    goals: 0, penalties: 0
                  }
                }
              ]
            };
          });
      },

      buildSemiFinals(quarterFinals, bet) {
        let sfTeams = {Q1: {}, Q2: {}, Q3: {}, Q4: {}};

        quarterFinals.matches.forEach(match => {
          bet.matches[match._id].home.goals = match.home.goals;
          bet.matches[match._id].away.goals = match.away.goals;
          bet.matches[match._id].home.penalties = match.home.penalties;
          bet.matches[match._id].away.penalties = match.away.penalties;

          if (match.home.goals > match.away.goals) {
            sfTeams[match.shortName] = {
              team: match.home._team,
              teamName: match.home.teamName
            };
          } else {
            if (match.home.goals < match.away.goals) {
              sfTeams[match.shortName] = {
                team: match.away._team,
                teamName: match.away.teamName
              };
            } else {
              if (match.home.penalties > match.away.penalties) {
                sfTeams[match.shortName] = {
                  team: match.home._team,
                  teamName: match.home.teamName
                };
              } else {
                if (match.home.penalties < match.away.penalties) {
                  sfTeams[match.shortName] = {
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

        return {
          fullName: 'SEMI_FINALS',
          matches: [
            {
              _id: 28, shortName: 'S1',
              home: {
                _team: sfTeams.Q1.team,
                teamName: sfTeams.Q1.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: sfTeams.Q3.team,
                teamName: sfTeams.Q3.teamName,
                goals: 0, penalties: 0
              }
            },
            {
              _id: 29, shortName: 'S2',
              home: {
                _team: sfTeams.Q2.team,
                teamName: sfTeams.Q2.teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: sfTeams.Q4.team,
                teamName: sfTeams.Q4.teamName,
                goals: 0, penalties: 0
              }
            }
          ]
        };
      },

      buildFinals(semiFinals, bet) {
        let fTeams = {S1W: {}, S1L: {}, S2W: {}, S2L: {}};

        semiFinals.matches.forEach(match => {
          bet.matches[match._id].home.goals = match.home.goals;
          bet.matches[match._id].away.goals = match.away.goals;
          bet.matches[match._id].home.penalties = match.home.penalties;
          bet.matches[match._id].away.penalties = match.away.penalties;

          if (match.home.goals > match.away.goals) {
            fTeams[match.shortName + 'W'] = {
              team: match.home._team,
              teamName: match.home.teamName
            };

            fTeams[match.shortName + 'L'] = {
              team: match.away._team,
              teamName: match.away.teamName
            };
          } else {
            if (match.home.goals < match.away.goals) {
              fTeams[match.shortName + 'W'] = {
                team: match.away._team,
                teamName: match.away.teamName
              };

              fTeams[match.shortName + 'L'] = {
                team: match.home._team,
                teamName: match.home.teamName
              };
            } else {
              if (match.home.penalties > match.away.penalties) {
                fTeams[match.shortName + 'W'] = {
                  team: match.home._team,
                  teamName: match.home.teamName
                };

                fTeams[match.shortName + 'L'] = {
                  team: match.away._team,
                  teamName: match.away.teamName
                };
              } else {
                if (match.home.penalties < match.away.penalties) {
                  fTeams[match.shortName + 'W'] = {
                    team: match.away._team,
                    teamName: match.away.teamName
                  };

                  fTeams[match.shortName + 'L'] = {
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

        response.thirdPlace = {
          fullName: 'THIRD_PLACE',
          match: {
            _id: 30, shortName: 'TP',
            home: {
              _team: fTeams.S1L.team,
              teamName: fTeams.S1L.teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: fTeams.S2L.team,
              teamName: fTeams.S2L.teamName,
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
              _team: fTeams.S1W.team,
              teamName: fTeams.S1W.teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: fTeams.S2W.team,
              teamName: fTeams.S2W.teamName,
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