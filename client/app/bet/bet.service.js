'use strict';

angular.module('copaamericaApp')
  .service('BetService', ['QueryService', 'TableCalculator', (QueryService, TableCalculator) => {
    return {
      betInitialize(bet) {
        const GA = [0, 1, 8, 9, 16, 17],
          GB = [2, 3, 10, 11, 18, 19],
          GC = [4, 5, 12, 13, 20, 21],
          GD = [6, 7, 14, 15, 22, 23],
          QF = [24, 25, 26, 27],
          SF = [28, 29],
          TP = 30,
          F = 31;

        const populate = (groupArray) => {
          let matches = [];

          for (let i = 0; i < 6; i++) {
            matches.push(bet.matches[groupArray[i]]);
          }

          return matches;
        };

        const getWinner = (id) => {
          const home = bet.matches[id].home,
            away = bet.matches[id].away;

          if (home.goals > away.goals) return home._team;
          else if (home.goals < away.goals) return away._team;
          else if (home.penalties > away.penalties) return home._team;
          else if (home.penalties < away.penalties) return away._team;
          else throw 'WTF';
        };

        const getLoser = (id) => {
          const home = bet.matches[id].home,
            away = bet.matches[id].away;

          if (home.goals < away.goals) return home._team;
          else if (home.goals > away.goals) return away._team;
          else if (home.penalties < away.penalties) return home._team;
          else if (home.penalties > away.penalties) return away._team;
          else throw 'WTF';
        };

        return QueryService.cloneGroups()
          .then(groups => {
            groups.forEach(group => {
              group.matches.forEach(match => {
                bet.matches[match._id].name = group.name;
                bet.matches[match._id].home._team = match.home._team;
                bet.matches[match._id].away._team = match.away._team;
              });
            });

            const GROUP_A = {matches: populate(GA)},
              GROUP_B = {matches: populate(GB)},
              GROUP_C = {matches: populate(GC)},
              GROUP_D = {matches: populate(GD)},
              GROUP_A_TABLE = TableCalculator.generate(GROUP_A),
              GROUP_B_TABLE = TableCalculator.generate(GROUP_B),
              GROUP_C_TABLE = TableCalculator.generate(GROUP_C),
              GROUP_D_TABLE = TableCalculator.generate(GROUP_D);

            bet.matches[QF[0]].name = 'Q1';
            bet.matches[QF[0]].home._team = GROUP_A_TABLE[0].team;
            bet.matches[QF[0]].away._team = GROUP_B_TABLE[1].team;
            bet.matches[QF[1]].name = 'Q2';
            bet.matches[QF[1]].home._team = GROUP_B_TABLE[0].team;
            bet.matches[QF[1]].away._team = GROUP_A_TABLE[1].team;
            bet.matches[QF[2]].name = 'Q3';
            bet.matches[QF[2]].home._team = GROUP_D_TABLE[0].team;
            bet.matches[QF[2]].away._team = GROUP_C_TABLE[1].team;
            bet.matches[QF[3]].name = 'Q4';
            bet.matches[QF[3]].home._team = GROUP_C_TABLE[0].team;
            bet.matches[QF[3]].away._team = GROUP_D_TABLE[1].team;

            bet.matches[SF[0]].name = 'S1';
            bet.matches[SF[0]].home._team = getWinner(QF[0]);
            bet.matches[SF[0]].away._team = getWinner(QF[2]);
            bet.matches[SF[1]].name = 'S2';
            bet.matches[SF[1]].home._team = getWinner(QF[1]);
            bet.matches[SF[1]].away._team = getWinner(QF[3]);

            bet.matches[TP].name = 'TP';
            bet.matches[TP].home._team = getLoser(SF[0]);
            bet.matches[TP].away._team = getLoser(SF[1]);

            bet.matches[F].name = 'F';
            bet.matches[F].home._team = getWinner(SF[0]);
            bet.matches[F].away._team = getWinner(SF[1]);

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
                    _team: qfTeams.GD0.team,
                    teamName: qfTeams.GD0.teamName,
                    goals: 0, penalties: 0
                  },
                  away: {
                    _team: qfTeams.GC1.team,
                    teamName: qfTeams.GC1.teamName,
                    goals: 0, penalties: 0
                  }
                },
                {
                  _id: 27, shortName: 'Q4',
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
