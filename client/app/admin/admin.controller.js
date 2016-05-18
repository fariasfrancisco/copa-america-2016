'use strict';

(function () {

  class AdminController {
    constructor(User, AdminService) {
      // Use the User $resource to fetch all users
      this.users = User.query();
      this.adminSvc = AdminService;
      this.homeScorers = [];
      this.awayScorers = [];
    }

    removeInvalidCharacters(side, prop) {
      if (this.match[side][prop] !== '') {
        if (isNaN(parseInt(this.match[side][prop])) || !isFinite(this.match[side][prop])) this.match[side][prop] = 0;
        if (Number(this.match[side][prop]) < 0) this.match[side][prop] = 0;

        if (prop === '_team') {
          if (Number(this.match[side][prop]) > 31) this.match[side][prop] = 0;
        }
      }
    }

    delete(user) {
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    }

    search() {
      let self = this,
        id = Number(this.matchId);

      if (this.match && this.match._id === id) return;

      if (this.group) {
        let found = false;

        this.group.matches.forEach(match => {
          if (match._id === id) {
            found = true;
            self.match = match;
          }
        });

        if (found) return;
      }

      try {
        this.adminSvc.searchMatch(id)
          .then(group => {
            self.group = group;

            group.matches.forEach(match => {
              if (match._id === id) self.match = match;

              self.adminSvc.getTeam(match.home._team)
                .then(team => {
                  match.home.team = team;
                });

              self.adminSvc.getTeam(match.away._team)
                .then(team => {
                  match.away.team = team;
                });

              delete self.idError;
            });
          });
      } catch (err) {
        this.idError = true;
      }
    }

    addHomeScorers() {
      this.homeScorers.push({});
    }

    addAwayScorers() {
      this.awayScorers.push({});
    }

    save() {
      let self = this;

      this.match.home.team.players.forEach(player => {
        self.homeScorers.forEach(scorer => {
          if (player._id === scorer.player._id) player.goals += Number(scorer.goals);
        });
      });

      this.match.away.team.players.forEach(player => {
        self.awayScorers.forEach(scorer => {
          if (player._id === scorer.player._id) player.goals += Number(scorer.goals);
        });
      });

      this.match.home._team = Number(this.match.home._team);
      this.match.away._team = Number(this.match.away._team);
      this.match.home.goals = Number(this.match.home.goals);
      this.match.away.goals = Number(this.match.away.goals);
      this.match.home.penalties = Number(this.match.home.penalties);
      this.match.away.penalties = Number(this.match.away.penalties);

      this.adminSvc.saveTeam(this.match.home.team)
        .then(() => {
          delete self.match.home.team;

          self.adminSvc.saveTeam(self.match.away.team)
            .then(() => {
              self.saveTeamSuccess = true;
              delete self.saveTeamError;
              delete self.match.away.team;

              self.adminSvc.saveGroup(self.group)
                .then(() => {
                  self.saveGroupSuccess = true;
                  delete self.saveGroupError;
                })
                .catch(() => {
                  self.saveGroupError = true;
                  delete self.saveGroupSuccess;
                });
            })
            .catch(() => {
                self.saveTeamError = true;
                delete self.saveTeamSuccess;
              }
            );
        })
        .catch(() => {
            self.saveTeamError = true;
            delete self.saveTeamSuccess;
          }
        );
    }
    
    //TODO UNTESTED!
  }

  angular.module('copaamericaApp.admin')
    .controller('AdminController', AdminController);
})();
