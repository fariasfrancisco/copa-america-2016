'use strict';

(function () {

  class AdminController {
    constructor(User, AdminService, QueryService, $scope) {
      this.users = User.query();
      this.adminSvc = AdminService;
      this.querySvc = QueryService;
      this.$scope = $scope;
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
      this.saveHomeTeamSuccess = undefined;
      this.saveAwayTeamSuccess = undefined;
      this.saveGroupSuccess = undefined;
      this.saveHomeTeamError = undefined;
      this.saveAwayTeamError = undefined;
      this.saveGroupError = undefined;
      this.idError = undefined;

      if (isNaN(parseInt(this.matchId)) || !isFinite(this.matchId)) {
        this.idError = true;
        return;
      }

      if (parseInt(this.matchId) > 31 || parseInt(this.matchId) < 0) {
        this.idError = true;
        return;
      }

      if (this.match && Number(this.matchId) === this.match._id) return;

      this.adminSvc.search(this.matchId, this.group, this.match)
        .then(result => {
          this.match = result.match;
          this.group = result.group;
        });
    }

    addHomeScorers() {
      this.homeScorers.push({});
    }

    addAwayScorers() {
      this.awayScorers.push({});
    }

    save() {
      return this.adminSvc.save(this.match, this.group, this.homeScorers, this.awayScorers)
        .then(out => {
          this.$scope.$applyAsync(() => {
            this.saveHomeTeamSuccess = out.successFlags.saveHomeTeamSuccess;
            this.saveAwayTeamSuccess = out.successFlags.saveAwayTeamSuccess;
            this.saveGroupSuccess = out.successFlags.saveGroupSuccess;
            this.saveHomeTeamError = out.errorFlags.saveHomeTeamError;
            this.saveAwayTeamError = out.errorFlags.saveAwayTeamError;
            this.saveGroupError = out.errorFlags.saveGroupError;
          });
        });
    }

    initialize() {
      this.querySvc.initialize()
        .then(successFlag => {
          this.initializedSuccess = successFlag;
          this.initializedError = !successFlag;
        });
    }
  }

  angular.module('copaamericaApp.admin')
    .controller('AdminController', AdminController);
})();
