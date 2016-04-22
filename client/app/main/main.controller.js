'use strict';
(function () {

  class MainComponent {
    constructor($http, Auth, MainService) {
      this.$http = $http;
      this.isLoggedIn = Auth.isLoggedIn;
      this.mainSvc = MainService;
      this.groups = [];
      this.teams = [];
    }

    toggleLoginForm() {
      this.mainSvc.setShowLoginForm(true);
      this.mainSvc.setShowSignUpForm(false);
      this.mainSvc.setShowButton(false);
    }

    static compareGroup(a, b) {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    };

    static compareTeam(a, b) {
      if (a._id < b._id) return -1;
      else if (a._id > b._id) return 1;
      else return 0;
    };

    static compareLine(a, b) {
      if (a.position < b.position) return -1;
      else if (a.position > b.position) return 1;
      else return 0;
    };

    $onInit() {
      this.mainSvc.setShowButton(!this.isLoggedIn());
      this.mainSvc.setShowLoginForm(false);
      this.mainSvc.setShowSignUpForm(false);
      this.mainSvc.setShowTables(this.isLoggedIn());

      if (this.isLoggedIn()) {
        var self = this;
        self.$http.get('/api/groups/stage/group')
          .then(function (response) {
            self.groups = response.data;
            self.groups.sort(MainComponent.compareGroup);
            self.$http.get('/api/teams')
              .then(function (response) {
                self.teams = response.data;
                self.teams.sort(MainComponent.compareTeam);
                self.groups.forEach(function (group) {
                  group.fullName = group.name.replace('G', 'Grupo ');
                  self.$http.get('/api/groups/table/' + group.name)
                    .then(function (response) {
                      group.table = response.data;
                      group.table.sort(MainComponent.compareLine);
                      group.table.forEach(function (line) {
                        line.team = self.teams[line.team - 1].name;
                      })
                    })
                })
              })
          })
      }
    }
  }

  angular.module('copaamericaApp')
    .component('main', {
      templateUrl: 'app/main/main.html',
      controller: MainComponent
    });

})();
