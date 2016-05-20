'use strict';

(function () {
  class BetComponent {
    constructor(Auth, BetService, QueryService, BetBuilderService, ModalService, TeamLogoService, $uibModal, $state, $window) {
      this.teams = [];
      this.auth = Auth;
      this.betSvc = BetService;
      this.querySvc = QueryService;
      this.betBuilderSvc = BetBuilderService;
      this.modalSvc = ModalService;
      this.logoPaths = TeamLogoService;
      this.$uibModal = $uibModal;
      this.$state = $state;
      this.$window = $window;
    }

    openModal(target) {
      if (target === 'edit') {
        this.modalSvc.setEditWarn(true);
      }

      if (target === 'restart') {
        this.modalSvc.setRestartWarn(true);
      }

      let modalInstance = this.$uibModal.open({
        animation: true,
        templateUrl: '/app/modal/modal.html',
        controller: 'ModalCtrl'
      });

      modalInstance.result
        .then(() => {
          if (this.modalSvc.getEditWarn()) this.edit();
          else this.startOver();
        }, () => {
          this.modalSvc.init();
        });
    }

    changePenalties(home, away) {
      if (home.goals !== away.goals) {
        home.penalties = 0;
        away.penalties = 0;
      }
    }

    removeGroupInvalidCharacters(groups) {
      let undef = false;

      groups.forEach(group => {
        group.matches.forEach(match => {
          if (typeof match.home.goals === 'undefined') undef = true;
          if (typeof match.away.goals === 'undefined') undef = true;
          if (typeof match.home.penalties === 'undefined') undef = true;
          if (typeof match.away.penalties === 'undefined') undef = true;
        });
      });

      this.disableButton = undef;
    }

    removeFinalsInvalidCharacters(TP, F) {
      let matches = [TP, F];
      this.removeMatchesInvalidCharacters(matches);
    }

    removeMatchesInvalidCharacters(matches) {
      let undef = false;

      matches.forEach(match => {
        if (typeof match.home.goals === 'undefined') undef = true;
        if (typeof match.away.goals === 'undefined') undef = true;
        if (typeof match.home.penalties === 'undefined') undef = true;
        if (typeof match.away.penalties === 'undefined') undef = true;
      });

      this.disableButton = undef;
    }

    edit() {
      let id = this.userBet._id;

      this.querySvc.deleteBet(id)
        .then(() => {
          delete this.userBet;
          this.startOver();
        })
        .catch(() => {
          this.$window.alert('ERROR DELETING BET');
        });
    }

    startOver() {
      this.groups = {};
      this.bet = {};
      this.teams = [];
      delete this.hasBet;
      delete this.quarterFinals;
      delete this.semiFinals;
      delete this.thirdPlace;
      delete this.finals;
      delete this.goldenBootTeam;
      delete this.goldenBootPlayer;
      delete this.podium;

      this.$onInit();
    }

    $onInit() {
      let user = this.auth.getCurrentUser()._id;

      this.modalSvc.init();

      this.querySvc.getTeams()
        .then(teams => {
          this.teams = teams;
        });

      this.querySvc.getBetByUser(user)
        .then(res => {
          this.userBet = res.data;
          this.hasBet = true;
          this.betInitialize();
        })
        .catch(() => {
          this.hasBet = false;
          this.noBetInitialize();
        });
    }

    betInitialize() {
      this.betSvc.betInitialize(this.userBet);
    }

    noBetInitialize() {
      this.betSvc.noBetInitialize(this.auth.getCurrentUser())
        .then(obj => {
          this.bet = obj.bet;
          this.groups = obj.groups;
        });
    }

    buildQuarterFinals() {
      this.quarterFinals = this.betSvc.buildQuarterFinals(this.groups, this.bet);
    }

    buildSemiFinals() {
      try {
        this.semiFinals = this.betSvc.buildSemiFinals(this.quarterFinals, this.bet);

        delete this.quarterFinalsError;
      } catch (e) {
        this.quarterFinalsError = 'BET_ERROR';
      }
    }

    buildFinals() {
      try {
        let obj = this.betSvc.buildFinals(this.semiFinals, this.bet);

        this.thirdPlace = obj.thirdPlace;
        this.finals = obj.finals;

        delete this.semiFinalsError;
      } catch (e) {
        this.semiFinalsError = 'BET_ERROR';
      }
    }

    buildPodium() {
      try {
        this.podium = this.betSvc.buildPodium(this.thirdPlace, this.finals, this.bet);
        this.goldenBootTeam = undefined;
        this.goldenBootPlayer = undefined;

        delete this.thirdPlaceError;
        delete this.finalsError;
      } catch (e) {
        if (e.thirdPlaceException) this.thirdPlaceError = 'BET_ERROR';
        else delete this.thirdPlaceError;

        if (e.finalsException) this.finalsError = 'BET_ERROR';
        else delete this.finalsError;
      }
    }

    save() {
      this.bet.goldenBoot = {
        _team: this.goldenBootTeam._id,
        _player: this.goldenBootPlayer._id
      };

      this.bet.podium = this.podium;

      this.betBuilderSvc.buildBet(this.bet)
        .then(() => {
          this.$state.go('main');
        });
    }
  }

  angular.module('copaamericaApp')
    .component('bet', {
      templateUrl: 'app/bet/bet.html',
      controller: BetComponent
    });
})();
