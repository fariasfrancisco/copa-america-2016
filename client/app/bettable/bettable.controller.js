'use strict';
(function () {

  class BettableComponent {
    constructor(QueryService, GoldenBootCalculator) {
      this.querySvc = QueryService;
      this.goldenBootCalc = GoldenBootCalculator;
      this.betRows = [];
      this.podium = {};
    }

    $onInit() {
      let self = this;

      this.querySvc.getBets().then(bets => {
        self.bets = bets;
        bets.forEach(function (bet) {
          self.betRows.push({
            user: bet.name,
            points: {}
          });
        });

        self.groups = self.querySvc.getGroups();
        if (self.groups.length < 1) {
          self.querySvc.buildGroupsAndTeams().then(groups => {
            self.groups = groups;
            self.processGroups();
          });
        } else {
          self.processGroups();
        }
      });
    }

    processGroups() {
      let self = this;

      this.groups.forEach(group => {
        self.querySvc.buildTable(group)
          .then(function (table) {
            self.bets.forEach((bet, index) => {
              self.betRows[index].points[group.name] = 0;

              let groupIndex = 0,
                size = bet.groups.length,
                allPlayed = true;

              group.matches.forEach(match => {
                let now = new Date(),
                  matchDate = new Date(match.date);

                if (matchDate < now) {
                  let mGoals = match.home.goals - match.away.goals
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

    processStage(st) {
      let self = this;

      this.querySvc.getStage(st.fullName).then(stage => {
        let now, matchDate, matchHome, matchAway, betHome, betAway;

        stage.forEach(function (current) {
          matchHome = current.matches[0].home;
          matchAway = current.matches[0].away;
          now = new Date();
          matchDate = new Date(current.matches[0].date);

          if (matchDate > now) {
            self.bets.forEach((bet, index) => {
              betHome = bet.matches[current.matches[0]._id].home;
              betAway = bet.matches[current.matches[0]._id].away;

              self.betRows[index].points[st.shortName] = 0;

              let matchGoals = matchHome.goals - matchAway.goals,
                betGoals = betHome.goals - betAway.goals,
                matchPenalties = matchGoals === 0 ? matchHome.penalties - matchAway.penalties : 0,
                betPenalties = betGoals === 0 ? betHome.penalties - betAway.penalties : 0;

              if (Math.sign(matchGoals) === Math.sign(betGoals)) {
                if (matchGoals === 0) {
                  if (Math.sign(matchPenalties) === Math.sign(betPenalties)) {
                    self.betRows[index].points[st.shortName] += 2;
                    if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals
                      && matchHome.penalties === betHome.penalties && matchAway.penalties === betAway.penalties) {
                      self.betRows[index].points[st.shortName] += 3;
                    }
                  }
                } else {
                  self.betRows[index].points[st.shortName] += 2;
                  if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals) {
                    self.betRows[index].points[st.shortName] += 3;
                  }
                }
              }
            });
          }
        });
      });
    }

    processThirdPlaceAndFinals() {
      let self = this;

      this.querySvc.getStage('third-place').then(stage => {
        let now = new Date(),
          matchDate = new Date(stage[0].matches[0].date),
          matchHome = stage[0].matches[0].home,
          matchAway = stage[0].matches[0].away;

        if (matchDate > now) {
          self.bets.forEach(function (bet, index) {
            self.betRows[index].points['TP'] = 0;

            let betHome = bet.matches[stage[0].matches[0]._id].home,
              betAway = bet.matches[stage[0].matches[0]._id].away,
              matchGoals = matchHome.goals - matchAway.goals,
              betGoals = betHome.goals - betAway.goals,
              matchPenalties = matchGoals === 0 ? matchHome.penalties - matchAway.penalties : 0,
              betPenalties = betGoals === 0 ? betHome.penalties - betAway.penalties : 0;

            if (Math.sign(matchGoals) === Math.sign(betGoals)) {
              if (matchGoals === 0) {
                if (Math.sign(matchPenalties) === Math.sign(betPenalties)) {
                  self.betRows[index].points['TP'] += 2;
                  if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals
                    && matchHome.penalties === betHome.penalties && matchAway.penalties === betAway.penalties) {
                    self.betRows[index].points['TP'] += 3;
                  }
                }
              } else {
                self.betRows[index].points['TP'] += 2;
                if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals) {
                  self.betRows[index].points['TP'] += 3;
                }
              }
            }
          });

          if (matchHome.goals > matchAway.goals) {
            self.podium.third = matchHome._team;
          } else {
            if (matchHome.goals < matchAway.goals) {
              self.podium.third = matchAway._team;
            } else {
              if (matchHome.penalties > matchAway.penalties) {
                self.podium.third = matchHome._team;
              } else {
                if (matchHome.penalties < matchAway.penalties) {
                  self.podium.third = matchAway._team;
                }
              }
            }
          }

          self.querySvc.getStage('final').then(stage => {
            let now = new Date(),
              matchDate = new Date(stage[0].matches[0].date),
              matchHome = stage[0].matches[0].home,
              matchAway = stage[0].matches[0].away;

            if (matchDate > now) {
              self.bets.forEach((bet, index) => {
                self.betRows[index].points['F'] = 0;

                let betHome = bet.matches[stage[0].matches[0]._id].home,
                  betAway = bet.matches[stage[0].matches[0]._id].away,
                  matchGoals = matchHome.goals - matchAway.goals,
                  betGoals = betHome.goals - betAway.goals,
                  matchPenalties = matchGoals === 0 ? matchHome.penalties - matchAway.penalties : 0,
                  betPenalties = betGoals === 0 ? betHome.penalties - betAway.penalties : 0;

                if (Math.sign(matchGoals) === Math.sign(betGoals)) {
                  if (matchGoals === 0) {
                    if (Math.sign(matchPenalties) === Math.sign(betPenalties)) {
                      self.betRows[index].points['F'] += 2;
                      if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals
                        && matchHome.penalties === betHome.penalties && matchAway.penalties === betAway.penalties) {
                        self.betRows[index].points['F'] += 3;
                      }
                    }
                  } else {
                    self.betRows[index].points['F'] += 2;
                    if (matchHome.goals === betHome.goals && matchAway.goals === betAway.goals) {
                      self.betRows[index].points['F'] += 3;
                    }
                  }
                }
              });

              if (matchHome.goals > matchAway.goals) {
                self.podium.first = matchHome._team;
                self.podium.second = matchAway._team;
              } else {
                if (matchHome.goals < matchAway.goals) {
                  self.podium.first = matchAway._team;
                  self.podium.second = matchHome._team;
                } else {
                  if (matchHome.penalties > matchAway.penalties) {
                    self.podium.first = matchHome._team;
                    self.podium.second = matchAway._team;
                  } else {
                    if (matchHome.penalties < matchAway.penalties) {
                      self.podium.first = matchAway._team;
                      self.podium.second = matchHome._team;
                    }
                  }
                }
              }

              self.bets.forEach((bet, index) => {
                self.betRows[index].points['POD'] = 0;

                let inPodium = false,
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

                if (inPodium) self.betRows[index].points['POD'] += 25;
                if (rightOrder) self.betRows[index].points['POD'] += 35;
              });
            }
          });
        }
      });
    }

    processGoldenBoot() {
      let self = this,
        goldenBootPlayer = this.goldenBootCalc.getTopScorers();

      this.bets.forEach((bet, index) => {
        if (goldenBootPlayer.length > 0) {
          goldenBootPlayer.forEach(player => {
            if (bet.goldenBoot._team === player._team && bet.goldenBoot._player === player._id) {
              self.betRows[index].points['STR'] = 50;
            }
          });
        } else {
          self.betRows[index].points['STR'] = 0;
        }
      });
    }
  }

  angular.module('copaamericaApp')
    .component('bettable', {
      templateUrl: 'app/bettable/bettable.html',
      controller: BettableComponent
    });
})();
