'use strict';
(function () {

  //TODO fix when user inputs invalid numbers

  class BetComponent {
    constructor(Auth, QueryService, TableCalculator) {
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
          group.matches.forEach(function (match) {
            match.home.goals = '';
            match.away.goals = '';
          });

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

      this.quaterFinals = {
        fullName: 'Quarter Finals',
        matches: [
          {
            _id: 24, shortName: 'Q1',
            home: {
              _team: teams['GA0'].team,
              teamName: teams['GA0'].teamName,
              goals: '', penalties: ''
            },
            away: {
              _team: teams['GB1'].team,
              teamName: teams['GB1'].teamName,
              goals: '', penalties: ''
            }
          },
          {
            _id: 25, shortName: 'Q2',
            home: {
              _team: teams['GB0'].team,
              teamName: teams['GB0'].teamName,
              goals: '', penalties: ''
            },
            away: {
              _team: teams['GA1'].team,
              teamName: teams['GA1'].teamName,
              goals: '', penalties: ''
            }
          },
          {
            _id: 26, shortName: 'Q3',
            home: {
              _team: teams['GC0'].team,
              teamName: teams['GC0'].teamName,
              goals: '', penalties: ''
            },
            away: {
              _team: teams['GD1'].team,
              teamName: teams['GD1'].teamName,
              goals: '', penalties: ''
            }
          },
          {
            _id: 27, shortName: 'Q4',
            home: {
              _team: teams['GD0'].team,
              teamName: teams['GD0'].teamName,
              goals: '', penalties: ''
            },
            away: {
              _team: teams['GC1'].team,
              teamName: teams['GC1'].teamName,
              goals: '', penalties: ''
            }
          }
        ]
      }
    }

    buildSemiFinals() {
      var teams = {},
        self = this;

      this.quaterFinals.matches.forEach(function (match) {
        if (match.home.goals === '') match.home.goals = 0;
        if (match.away.goals === '') match.away.goals = 0;
        if (match.home.penalties === '') match.home.penalties = 0;
        if (match.away.penalties === '') match.away.penalties = 0;

        self.bet.matches[match._id].home.goals = match.home.goals;
        self.bet.matches[match._id].away.goals = match.away.goals;
        self.bet.matches[match._id].home.penalties = match.home.penalties;
        self.bet.matches[match._id].away.penalties = match.away.penalties;

        if (match.home.goals > match.away.goals) {
          teams[match.shortName] = {
            team: match.home._team,
            teamName: match.home.teamName
          }
        } else {
          if (match.home.goals < match.away.goals) {
            teams[match.shortName] = {
              team: match.away._team,
              teamName: match.away.teamName
            }
          } else {
            if (match.home.penalties > match.away.penalties) {
              teams[match.shortName] = {
                team: match.home._team,
                teamName: match.home.teamName
              }
            } else {
              if (match.home.penalties < match.away.penalties) {
                teams[match.shortName] = {
                  team: match.away._team,
                  teamName: match.away.teamName
                }
              } else {
                //TODO figure out how to handle this case
                self.quarterFinalsError = "Que pa e";
              }
            }
          }
        }
      });

      this.semiFinals = {
        fullName: 'Semi Finals',
        matches: [
          {
            _id: 28, shortName: 'S1',
            home: {
              _team: teams['Q1'].team,
              teamName: teams['Q1'].teamName,
              goals: '', penalties: ''
            },
            away: {
              _team: teams['Q3'].team,
              teamName: teams['Q3'].teamName,
              goals: '', penalties: ''
            }
          },
          {
            _id: 29, shortName: 'S2',
            home: {
              _team: teams['Q2'].team,
              teamName: teams['Q2'].teamName,
              goals: '', penalties: ''
            },
            away: {
              _team: teams['Q4'].team,
              teamName: teams['Q4'].teamName,
              goals: '', penalties: ''
            }
          }
        ]
      }
    }

    buildFinals() {
      var teams = {},
        self = this;

      this.semiFinals.matches.forEach(function (match) {
        if (match.home.goals === '') match.home.goals = 0;
        if (match.away.goals === '') match.away.goals = 0;
        if (match.home.penalties === '') match.home.penalties = 0;
        if (match.away.penalties === '') match.away.penalties = 0;

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
          }
        } else {
          if (match.home.goals < match.away.goals) {
            teams[match.shortName + 'W'] = {
              team: match.away._team,
              teamName: match.away.teamName
            };

            teams[match.shortName + 'L'] = {
              team: match.home._team,
              teamName: match.home.teamName
            }
          } else {
            if (match.home.penalties > match.away.penalties) {
              teams[match.shortName + 'W'] = {
                team: match.home._team,
                teamName: match.home.teamName
              };

              teams[match.shortName + 'L'] = {
                team: match.away._team,
                teamName: match.away.teamName
              }
            } else {
              if (match.home.penalties < match.away.penalties) {
                teams[match.shortName + 'W'] = {
                  team: match.away._team,
                  teamName: match.away.teamName
                };

                teams[match.shortName + 'L'] = {
                  team: match.home._team,
                  teamName: match.home.teamName
                }
              } else {
                //TODO figure out how to handle this case
                self.semiFinalsError = "Que pa e";
              }
            }
          }
        }
      });

      this.thirdPlace = {
        fullName: 'Third Place',
        match: {
          _id: 30, shortName: 'TP',
          home: {
            _team: teams['S1L'].team,
            teamName: teams['S1L'].teamName,
            goals: '', penalties: ''
          },
          away: {
            _team: teams['S2L'].team,
            teamName: teams['S2L'].teamName,
            goals: '', penalties: ''
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
            goals: '', penalties: ''
          },
          away: {
            _team: teams['S2W'].team,
            teamName: teams['S2W'].teamName,
            goals: '', penalties: ''
          }
        }
      };
    }

    buildPodium() {
      var thirdPlace, secondPlace, firstPlace;

      if (this.thirdPlace.match.home.goals === '') this.thirdPlace.match.home.goals = 0;
      if (this.thirdPlace.match.away.goals === '') this.thirdPlace.match.away.goals = 0;
      if (this.thirdPlace.match.home.penalties === '') this.thirdPlace.match.home.penalties = 0;
      if (this.thirdPlace.match.away.penalties === '') this.thirdPlace.match.away.penalties = 0;

      if (this.finals.match.home.goals === '') this.finals.match.home.goals = 0;
      if (this.finals.match.away.goals === '') this.finals.match.away.goals = 0;
      if (this.finals.match.home.penalties === '') this.finals.match.home.penalties = 0;
      if (this.finals.match.away.penalties === '') this.finals.match.away.penalties = 0;

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
              //TODO figure out how to handle this case
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
              //TODO figure out how to handle this case
              self.finalsError = "Que pa e";
            }
          }
        }
      }

      this.podium = {
        firstPlace: firstPlace,
        secondPlace: secondPlace,
        thirdPlace: thirdPlace
      };

      this.bet.podium = this.podium;
    }
  }

  angular.module('copaamericaApp')
    .component('bet', {
      templateUrl: 'app/bet/bet.html',
      controller: BetComponent
    });
})();
