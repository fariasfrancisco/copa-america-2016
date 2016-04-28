'use strict';
(function () {

  //TODO fix when user inputs invalid numbers

  class BetComponent {
    constructor(Auth, QueryService, TableCalculator, $scope) {
      this.$scope = $scope;
      this.isLoggedIn = Auth.isLoggedIn;
      this.auth = Auth;
      this.querySvc = QueryService;
      this.tableCalc = TableCalculator;
      this.groups = {};
      this.bet = {
        matches: {},
        groups: {}
      };
    }

    $onInit() {
      var self = this;

      this.bet.user = this.auth.getCurrentUser()._id;

      self.querySvc.cloneGroups().then(function (result) {
        self.groups = result;
        self.groups.forEach(function (group) {
          self.bet.groups[group.name] = {first: '', second: ''};
        })
      });

      for (var i = 0; i < 32; i++) {
        this.bet.matches[i] = {
          home: {goals: 0, penalties: 0},
          away: {goals: 0, penalties: 0}
        };
      }
    }

    changePenalties(home, away) {
      if (home.goals != away.goals) {
        home.penalties = 0;
        away.penalties = 0
      }
    }

    removeGroupInvalidCharacters(groups) {
      var self = this;

      groups.forEach(function (group) {
        self.removeInvalidCharacters(group.matches)
      });
    }

    removeInvalidCharacters(matches) {
      var self = this;

      matches.forEach(function (match) {
        self.removeFinalsInvalidCharacters(match)
      });
    }

    removeFinalsInvalidCharacters(match) {
      var undef = false;

      if (typeof match.home.goals === 'undefined') undef = true;
      if (typeof match.away.goals === 'undefined') undef = true;
      if (typeof match.home.penalties === 'undefined') undef = true;
      if (typeof match.away.penalties === 'undefined') undef = true;

      this.disableButton = undef;
    }

    buildQuarterFinals() {
      var teams = {},
        self = this;

      this.groups.forEach(function (group) {
        group.matches.forEach(function (match) {
          if (match.home.goals === '') match.home.goals = 0;
          if (match.away.goals === '') match.away.goals = 0;
          self.bet.matches[match._id].home.goals = match.home.goals;
          self.bet.matches[match._id].away.goals = match.away.goals;
        });

        var groupTable = self.tableCalc.generate(group);

        groupTable.forEach(function (current) {
          teams[current.groupPosition] = {
            team: current.team,
            teamName: self.querySvc.getTeams()[current.team].name
          };
        });

        self.bet.groups[group.name].first = teams[group.name + '0'].team;
        self.bet.groups[group.name].second = teams[group.name + '1'].team;
      });

      this.quarterFinals = {
        fullName: 'Quarter Finals',
        matches: [
          {
            _id: 24, shortName: 'Q1',
            home: {
              _team: teams['GA0'].team,
              teamName: teams['GA0'].teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams['GB1'].team,
              teamName: teams['GB1'].teamName,
              goals: 0, penalties: 0
            }
          },
          {
            _id: 25, shortName: 'Q2',
            home: {
              _team: teams['GB0'].team,
              teamName: teams['GB0'].teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams['GA1'].team,
              teamName: teams['GA1'].teamName,
              goals: 0, penalties: 0
            }
          },
          {
            _id: 26, shortName: 'Q3',
            home: {
              _team: teams['GC0'].team,
              teamName: teams['GC0'].teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams['GD1'].team,
              teamName: teams['GD1'].teamName,
              goals: 0, penalties: 0
            }
          },
          {
            _id: 27, shortName: 'Q4',
            home: {
              _team: teams['GD0'].team,
              teamName: teams['GD0'].teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams['GC1'].team,
              teamName: teams['GC1'].teamName,
              goals: 0, penalties: 0
            }
          }
        ]
      }
    }

    buildSemiFinals() {
      var teams = {},
        self = this,
        err = false;

      this.quarterFinals.matches.forEach(function (match) {
        self.bet.matches[match._id].home.goals = match.home.goals;
        self.bet.matches[match._id].away.goals = match.away.goals;
        self.bet.matches[match._id].home.penalties = match.home.penalties;
        self.bet.matches[match._id].away.penalties = match.away.penalties;

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
                err = true;
              }
            }
          }
        }
      });

      if (err) {
        self.quarterFinalsError = "Oops! There's an error in this group of matches.";
      } else {
        delete self.quarterFinalsError;
      }

      if (!self.quarterFinalsError) {
        this.semiFinals = {
          fullName: 'Semi Finals',
          matches: [
            {
              _id: 28, shortName: 'S1',
              home: {
                _team: teams['Q1'].team,
                teamName: teams['Q1'].teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams['Q3'].team,
                teamName: teams['Q3'].teamName,
                goals: 0, penalties: 0
              }
            },
            {
              _id: 29, shortName: 'S2',
              home: {
                _team: teams['Q2'].team,
                teamName: teams['Q2'].teamName,
                goals: 0, penalties: 0
              },
              away: {
                _team: teams['Q4'].team,
                teamName: teams['Q4'].teamName,
                goals: 0, penalties: 0
              }
            }
          ]
        }
      }
    }

    buildFinals() {
      var teams = {},
        self = this,
        err = false;

      this.semiFinals.matches.forEach(function (match) {
        self.bet.matches[match._id].home.goals = match.home.goals;
        self.bet.matches[match._id].away.goals = match.away.goals;
        self.bet.matches[match._id].home.penalties = match.home.penalties;
        self.bet.matches[match._id].away.penalties = match.away.penalties;

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
                err = true;
              }
            }
          }
        }
      });

      if (err) {
        self.semiFinalsError = "Oops! There's an error in this group of matches.";
      } else {
        delete self.semiFinalsError;
      }

      if (!self.semiFinalsError) {
        this.thirdPlace = {
          fullName: 'Third Place',
          match: {
            _id: 30, shortName: 'TP',
            home: {
              _team: teams['S1L'].team,
              teamName: teams['S1L'].teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams['S2L'].team,
              teamName: teams['S2L'].teamName,
              goals: 0, penalties: 0
            }
          }
        };

        this.finals = {
          fullName: 'Finals',
          match: {
            _id: 31, shortName: 'F',
            home: {
              _team: teams['S1W'].team,
              teamName: teams['S1W'].teamName,
              goals: 0, penalties: 0
            },
            away: {
              _team: teams['S2W'].team,
              teamName: teams['S2W'].teamName,
              goals: 0, penalties: 0
            }
          }
        };
      }
    }

    buildPodium() {
      var thirdPlace, secondPlace, firstPlace,
        self = this,
        err = false;

      this.bet.matches[this.thirdPlace.match._id].home.goals = this.thirdPlace.match.home.goals;
      this.bet.matches[this.thirdPlace.match._id].away.goals = this.thirdPlace.match.away.goals;
      this.bet.matches[this.thirdPlace.match._id].home.penalties = this.thirdPlace.match.home.penalties;
      this.bet.matches[this.thirdPlace.match._id].away.penalties = this.thirdPlace.match.away.penalties;

      this.bet.matches[this.finals.match._id].home.goals = this.finals.match.home.goals;
      this.bet.matches[this.finals.match._id].away.goals = this.finals.match.away.goals;
      this.bet.matches[this.finals.match._id].home.penalties = this.finals.match.home.penalties;
      this.bet.matches[this.finals.match._id].away.penalties = this.finals.match.away.penalties;

      if (this.thirdPlace.match.home.goals > this.thirdPlace.match.away.goals) {
        thirdPlace = {
          _id: this.thirdPlace.match.home._team,
          name: this.thirdPlace.match.home.teamName
        };
      } else {
        if (this.thirdPlace.match.home.goals < this.thirdPlace.match.away.goals) {
          thirdPlace = {
            _id: this.thirdPlace.match.away._team,
            name: this.thirdPlace.match.away.teamName
          };
        } else {
          if (this.thirdPlace.match.home.penalties > this.thirdPlace.match.away.penalties) {
            thirdPlace = {
              _id: this.thirdPlace.match.home._team,
              name: this.thirdPlace.match.home.teamName
            };
          } else {
            if (this.thirdPlace.match.home.penalties < this.thirdPlace.match.away.penalties) {
              thirdPlace = {
                _id: this.thirdPlace.match.away._team,
                name: this.thirdPlace.match.away.teamName
              };
            } else {
              err = true;
            }
          }
        }
      }

      if (this.finals.match.home.goals > this.finals.match.away.goals) {
        firstPlace = {
          _id: this.finals.match.home._team,
          name: this.finals.match.home.teamName
        };

        secondPlace = {
          _id: this.finals.match.away._team,
          name: this.finals.match.away.teamName
        };
      } else {
        if (this.finals.match.home.goals < this.finals.match.away.goals) {
          firstPlace = {
            _id: this.finals.match.away._team,
            name: this.finals.match.away.teamName
          };

          secondPlace = {
            _id: this.finals.match.home._team,
            name: this.finals.match.home.teamName
          };
        } else {
          if (this.finals.match.home.penalties > this.finals.match.away.penalties) {
            firstPlace = {
              _id: this.finals.match.home._team,
              name: this.finals.match.home.teamName
            };

            secondPlace = {
              _id: this.finals.match.away._team,
              name: this.finals.match.away.teamName
            };
          } else {
            if (this.thirdPlace.match.home.penalties < this.thirdPlace.match.away.penalties) {
              firstPlace = {
                _id: this.finals.match.away._team,
                name: this.finals.match.away.teamName
              };

              secondPlace = {
                _id: this.finals.match.home._team,
                name: this.finals.match.home.teamName
              };
            } else {
              err = true;
            }
          }
        }
      }

      if (err) {
        self.finalsError = "Oops! There's an error in this group of matches.";
      } else {
        delete self.finalsError;
      }

      if (self.finalsError) {
        this.podium = {
          firstPlace: firstPlace,
          secondPlace: secondPlace,
          thirdPlace: thirdPlace
        };

        this.bet.podium = this.podium;
      }
    }
  }

  angular.module('copaamericaApp')
    .component('bet', {
      templateUrl: 'app/bet/bet.html',
      controller: BetComponent
    });
})();
