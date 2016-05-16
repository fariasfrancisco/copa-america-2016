'use strict';

angular.module('copaamericaApp')
  .service('QueryService', ['$http', function ($http) {
    let groups = [],
      teams = [];

    const GROUP_STAGE_API = '/api/groups/stage/group/',
      TEAMS_API = '/api/teams/',
      GROUP_TABLE_API = '/api/groups/table/',
      STAGE_API = '/api/groups/stage/',
      BETS_API = '/api/bets/',
      BETS_API_USER = '/api/bets/user/',
      IS_VALID_API = '/api/users/valid/';

    let compareGroup = function (a, b) {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    };

    let compareTeam = function (a, b) {
      if (a._id < b._id) return -1;
      else if (a._id > b._id) return 1;
      else return 0;
    };

    let compareLine = function (a, b) {
      if (a.position < b.position) return -1;
      else if (a.position > b.position) return 1;
      else return 0;
    };

    let queryGroups = function () {
      return $http.get(GROUP_STAGE_API)
        .then(response => {
          return response.data.sort(compareGroup);
        });
    };

    let queryTeams = function () {
      return $http.get(TEAMS_API)
        .then(response => {
          console.log(response.data);
          return response.data.sort(compareTeam);
        });
    };

    return {
      getGroups() {
        return groups;
      },

      getTeams() {
        return teams;
      },

      getStage(stage) {
        const STAGE = STAGE_API + stage;

        return $http.get(STAGE)
          .then(response => {
            return response.data;
          });
      },

      getBets() {
        return $http.get(BETS_API)
          .then(response => {
            return response.data;
          });
      },

      getBetByUser(user) {
        let USER_BET = BETS_API_USER + user;

        return $http.get(USER_BET)
          .then(response => {
            return response;
          }, err => {
            throw err;
          });
      },

      deleteBet(id) {
        let BET = BETS_API + id;

        return $http.delete(BET)
          .then(response => {
            return response;
          }, err => {
            throw err;
          });
      },

      buildGroupsAndTeams() {
        let self = this;

        return queryTeams()
          .then(response => {
            teams = response;
            console.log(teams);

            return queryGroups()
              .then(response => {
                groups = response;

                groups.forEach(group => {
                  group.fullName = group.name.replace('G', 'GROUP_');

                  group.matches.forEach(match => {
                    match.home.teamName = teams[match.home._team].name;
                    match.away.teamName = teams[match.away._team].name;
                  });

                  self.buildTable(group)
                    .then(table => {
                      group.table = table;
                    });
                });
              });
          });
      },

      buildTable(group) {
        const GROUP_TABLE = GROUP_TABLE_API + group.name;

        return $http.get(GROUP_TABLE)
          .then(function (response) {
            let table = response.data;
            table.sort(compareLine);

            table.forEach(line => {
              line.teamName = teams[line.team].name;
            });

            return table;
          });
      },

      cloneGroups() {
        return this.buildGroupsAndTeams()
          .then(() => {
            return angular.copy(groups);
          });
      },

      isValid(id){
        const IS_VALID = IS_VALID_API + id;

        return $http.get(IS_VALID)
          .then(response => {
              return response.data;
            },
            () => {
              return false;
            }
          );
      }
    };
  }]);
