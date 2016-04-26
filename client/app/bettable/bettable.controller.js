'use strict';
(function () {

  class BettableComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
      this.betRows = [];
      this.podium = {};
    }

    $onInit() {
      var self = this;

      this.querySvc.getBets()
        .then(function (bets) {
          self.bets = bets;
          bets.forEach(function (bet) {
            self.betRows.push({
              user: bet._user,
              points: {}
            });
          });

          self.groups = self.querySvc.getGroups();
          if (self.groups.length < 1) {
            self.querySvc.buildGroupsAndTeams()
              .then(function (groups) {
                self.groups = groups;
                self.processGroups();
              });
          } else {
            self.processGroups();
          }
        });
    }

    processGroups() {
      var self = this;

      this.groups.forEach(function (group) {
        self.querySvc.buildTable(group)
          .then(function (table) {
            self.bets.forEach(function (bet, index) {
              self.betRows[index].points[group.name] = 0;

              var groupIndex = 0,
                size = bet.groups.length,
                allPlayed = true;

              group.matches.forEach(function (match) {
                var now = new Date()
                  , matchDate = new Date(match.date);

                if (matchDate < now) {
                  var mGoals = match.home.goals - match.away.goals
                    , bGoals = bet.matches[match._id].home.goals - bet.matches[match._id].away.goals;

                  if (Math.sign(mGoals) === Math.sign(bGoals)) {
                    self.betRows[index].points[group.name] += 2;
                    if (match.home.goals === bet.matches[match._id].home.goals
                      && match.away.goals === bet.matches[match._id].away.goals) {
                      self.betRows[index].points[group.name] += 3;
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

                if (table[0].team === bet.groups[groupIndex].first
                  && table[0].team === bet.groups[groupIndex].second) {
                  self.betRows[index].points[group.name] += 5;
                }
              }
            });
          });
      });

      this.processStage({fullName: 'quarter-final', shortName: 'QF'});
      this.processStage({fullName: 'semi-final', shortName: 'SF'});
      this.processThirdPlaceAndFinals();
      this.processGoldenBoot();
    }

    processStage(stage) {
      var self = this;

      this.querySvc.getStage(stage.fullName)
        .then(function (stage) {
          var now, matchDate;
          stage.forEach(function (current) {
            now = new Date();
            matchDate = new Date(current.matches[0].date);

            if (matchDate > now) {
              self.bets.forEach(function (bet, index) {
                self.betRows[index].points[stage.shortName] = 0;

                var mGoals = current.matches[0].home.goals - current.matches[0].away.goals,
                  bGoals = bet.matches[current.matches[0]._id].home.goals - bet.matches[current.matches[0]._id].away.goals,
                  mPenalties = mGoals === 0 ? current.matches[0].home.penalties - current.matches[0].away.penalties : 0,
                  bPenalties = bGoals === 0 ? bet.matches[current.matches[0]._id].home.penalties - bet.matches[current.matches[0]._id].away.penalties : 0;

                if (Math.sign(mGoals) === Math.sign(bGoals)) {
                  if (mGoals === 0) {
                    if (Math.sign(mPenalties) === Math.sign(bPenalties)) {
                      self.betRows[index].points[stage.shortName] += 2;
                      if (current.matches[0].home.goals === bet.matches[current.matches[0]._id].home.goals
                        && current.matches[0].away.goals === bet.matches[current.matches[0]._id].away.goals
                        && current.matches[0].home.penalties === bet.matches[current.matches[0]._id].home.penalties
                        && current.matches[0].away.penalties === bet.matches[current.matches[0]._id].away.penalties) {
                        self.betRows[index].points[stage.shortName] += 3;
                      }
                    }
                  } else {
                    self.betRows[index].points[stage.shortName] += 2;
                    if (current.matches[0].home.goals === bet.matches[current.matches[0]._id].home.goals
                      && current.matches[0].away.goals === bet.matches[current.matches[0]._id].away.goals) {
                      self.betRows[index].points[stage.shortName] += 3;
                    }
                  }
                }
              });
            }
          });
        });
    }

    processThirdPlaceAndFinals() {
      var self = this;

      this.querySvc.getStage('third-place')
        .then(function (stage) {
          var now = new Date(),
            matchDate = new Date(stage.matches[0].date);

          if (matchDate > now) {
            self.bets.forEach(function (bet, index) {
              self.betRows[index].points['TP'] = 0;

              var mGoals = stage.matches[0].home.goals - stage.matches[0].away.goals,
                bGoals = bet.matches[stage.matches[0]._id].home.goals - bet.matches[stage.matches[0]._id].away.goals,
                mPenalties = mGoals === 0 ? stage.matches[0].home.penalties - stage.matches[0].away.penalties : 0,
                bPenalties = bGoals === 0 ? bet.matches[stage.matches[0]._id].home.penalties - bet.matches[stage.matches[0]._id].away.penalties : 0;

              if (Math.sign(mGoals) === Math.sign(bGoals)) {
                if (mGoals === 0) {
                  if (Math.sign(mPenalties) === Math.sign(bPenalties)) {
                    self.betRows[index].points['TP'] += 2;
                    if (stage.matches[0].home.goals === bet.matches[stage.matches[0]._id].home.goals
                      && stage.matches[0].away.goals === bet.matches[stage.matches[0]._id].away.goals
                      && stage.matches[0].home.penalties === bet.matches[stage.matches[0]._id].home.penalties
                      && stage.matches[0].away.penalties === bet.matches[stage.matches[0]._id].away.penalties) {
                      self.betRows[index].points['TP'] += 3;
                    }
                  }
                } else {
                  self.betRows[index].points['TP'] += 2;
                  if (stage.matches[0].home.goals === bet.matches[stage.matches[0]._id].home.goals
                    && stage.matches[0].away.goals === bet.matches[stage.matches[0]._id].away.goals) {
                    self.betRows[index].points['TP'] += 3;
                  }
                }
              }
            });

            if (stage.matches[0].home.goals > stage.matches[0].away.goals) {
              self.podium.third = stage.matches[0].home._team;
            } else {
              if (stage.matches[0].home.goals < stage.matches[0].away.goals) {
                self.podium.third = stage.matches[0].away._team;
              } else {
                if (stage.matches[0].home.penalties > stage.matches[0].away.penalties) {
                  self.podium.third = stage.matches[0].home._team;
                } else {
                  if (stage.matches[0].home.penalties < stage.matches[0].away.penalties) {
                    self.podium.third = stage.matches[0].away._team;
                  }
                }
              }
            }

            this.querySvc.getStage('final')
              .then(function (stage) {
                var now = new Date(),
                  matchDate = new Date(stage.matches[0].date);

                if (matchDate > now) {
                  self.bets.forEach(function (bet, index) {
                    self.betRows[index].points['F'] = 0;

                    var mGoals = stage.matches[0].home.goals - stage.matches[0].away.goals,
                      bGoals = bet.matches[stage.matches[0]._id].home.goals - bet.matches[stage.matches[0]._id].away.goals,
                      mPenalties = mGoals === 0 ? stage.matches[0].home.penalties - stage.matches[0].away.penalties : 0,
                      bPenalties = bGoals === 0 ? bet.matches[stage.matches[0]._id].home.penalties - bet.matches[stage.matches[0]._id].away.penalties : 0;

                    if (Math.sign(mGoals) === Math.sign(bGoals)) {
                      if (mGoals === 0) {
                        if (Math.sign(mPenalties) === Math.sign(bPenalties)) {
                          self.betRows[index].points['F'] += 2;
                          if (stage.matches[0].home.goals === bet.matches[stage.matches[0]._id].home.goals
                            && stage.matches[0].away.goals === bet.matches[stage.matches[0]._id].away.goals
                            && stage.matches[0].home.penalties === bet.matches[stage.matches[0]._id].home.penalties
                            && stage.matches[0].away.penalties === bet.matches[stage.matches[0]._id].away.penalties) {
                            self.betRows[index].points['F'] += 3;
                          }
                        }
                      } else {
                        self.betRows[index].points['F'] += 2;
                        if (stage.matches[0].home.goals === bet.matches[stage.matches[0]._id].home.goals
                          && stage.matches[0].away.goals === bet.matches[stage.matches[0]._id].away.goals) {
                          self.betRows[index].points['F'] += 3;
                        }
                      }
                    }
                  });

                  if (stage.matches[0].home.goals > stage.matches[0].away.goals) {
                    self.podium.first = stage.matches[0].home._team;
                    self.podium.second = stage.matches[0].away._team;
                  } else {
                    if (stage.matches[0].home.goals < stage.matches[0].away.goals) {
                      self.podium.first = stage.matches[0].away._team;
                      self.podium.second = stage.matches[0].home._team;
                    } else {
                      if (stage.matches[0].home.penalties > stage.matches[0].away.penalties) {
                        self.podium.first = stage.matches[0].home._team;
                        self.podium.second = stage.matches[0].away._team;
                      } else {
                        if (stage.matches[0].home.penalties < stage.matches[0].away.penalties) {
                          self.podium.first = stage.matches[0].away._team;
                          self.podium.second = stage.matches[0].home._team;
                        }
                      }
                    }
                  }

                  self.bets.forEach(function (bet, index) {
                    var inPodium = false,
                      rightOrder = false;

                    if (bet.podium.first === self.podium.first
                      && bet.podium.second === self.podium.second
                      && bet.podium.third === self.podium.third) {
                      inPodium = true;
                      rightOrder = true;
                    } else {
                      if ((bet.podium.first === self.podium.second || bet.podium.first === self.podium.third)
                        && (bet.podium.second === self.podium.first || bet.podium.second === self.podium.third)
                        && (bet.podium.third === self.podium.first || bet.podium.third === self.podium.second)) {
                        inPodium = true;
                      }
                    }

                    if (inPodium) self.betRows[index].points['POD'] += 30;
                    if (rightOrder) self.betRows[index].points['POD'] += 60;
                  });
                }
              });
          }
        });
    }

    processGoldenBoot() {
//TODO logic here!
    }
  }

  angular.module('copaamericaApp')
    .component('bettable', {
      templateUrl: 'app/bettable/bettable.html',
      controller: BettableComponent
    });

})();
