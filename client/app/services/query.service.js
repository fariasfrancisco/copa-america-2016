'use strict';

angular.module('copaamericaApp')
  .service('QueryService', ['$http', function ($http) {
    let groups = [],
      teams = [],
      validCount = null;

    const API = '/api/',
      GROUPS = API + 'groups/',
      USERS = API + 'users/',
      TEAMS = API + 'teams/',
      BETS = API + 'bets/',
      INITIALIZE = API + 'init/',
      GROUP_TABLE = GROUPS + 'table/',
      STAGE = GROUPS + 'stage/',
      MATCHES = GROUPS + 'match/',
      GROUP_ID = GROUPS + 'id/',
      GROUP_STAGE = STAGE + 'group/',
      BETS_USER = BETS + 'user/',
      IS_VALID = USERS + 'valid/',
      ALL_VALID = USERS + 'allvalid/',
      VALIDATE = '/validate';

    const compareGroup = function (a, b) {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    };

    const compareTeam = function (a, b) {
      if (a._id < b._id) return -1;
      else if (a._id > b._id) return 1;
      else return 0;
    };

    const compareLine = function (a, b) {
      if (a.position < b.position) return -1;
      else if (a.position > b.position) return 1;
      else return 0;
    };

    const queryGroups = function () {
      return $http.get(GROUP_STAGE)
        .then(response => {
          groups = response.data.sort(compareGroup);
        });
    };

    const queryTeams = function () {
      return $http.get(TEAMS)
        .then(response => {
          teams = response.data.sort(compareTeam);
        });
    };

    const queryValidUsersCount = function () {
      return $http.get(ALL_VALID)
        .then(response => {
          validCount = response.data;
        });
    };

    return {
      getGroups() {
        if (groups.length < 1) {
          return queryGroups()
            .then(() => {
              return groups;
            });
        } else {
          return Promise.resolve(groups);
        }
      },

      getTeams() {
        if (teams.length < 1) {
          return queryTeams()
            .then(() => {
              return teams;
            });
        } else {
          return Promise.resolve(teams);
        }
      },

      getStage(stage) {
        const STAGE_URL = STAGE + stage;

        return $http.get(STAGE_URL)
          .then(response => {
            return response.data;
          });
      },

      getBets() {
        return $http.get(BETS)
          .then(response => {
            return response.data;
          });
      },

      getBetByUser(user) {
        const USER_BET_URL = BETS_USER + user;

        return $http.get(USER_BET_URL)
          .then(response => {
            return response.data;
          }, () => {
            return undefined;
          });
      },

      deleteBet(id) {
        const BET_URL = BETS + id;

        return $http.delete(BET_URL)
          .then(response => {
            return response;
          }, err => {
            throw err;
          });
      },

      buildGroupsAndTeams() {
        return this.getTeams()
          .then(() => {
            return this.getGroups()
              .then(() => {
                groups.forEach(group => {
                  group.matches.forEach(match => {
                    match.home.teamName = teams[match.home._team].name;
                    match.away.teamName = teams[match.away._team].name;
                  });

                  this.buildTable(group)
                    .then(table => {
                      group.table = table;
                    });
                });
              });
          });
      },

      buildTable(group) {
        const GROUP_TABLE_URL = GROUP_TABLE + group.name;

        return $http.get(GROUP_TABLE_URL)
          .then(response => {
            let table = response.data;
            table.sort(compareLine);

            return this.getTeams()
              .then(teams => {
                table.forEach(line => {
                  line.teamName = teams[line.team].name;
                });

                return table;
              })
          });
      },

      cloneGroups() {
        return this.buildGroupsAndTeams()
          .then(() => {
            return angular.copy(groups);
          });
      },

      isValid(id){
        const IS_VALID_URL = IS_VALID + id;

        return $http.get(IS_VALID_URL)
          .then(response => {
              return response.data;
            },
            () => {
              return false;
            }
          );
      },

      getValidUsersCount() {
        if (validCount === null) {
          return queryValidUsersCount()
            .then(() => {
              return validCount;
            });
        } else {
          return Promise.resolve(validCount);
        }
      },

      validate(user, bool) {
        const USER_VALIDATE = USERS + user._id + VALIDATE,
          body = {valid: Boolean(bool)};

        return $http.put(USER_VALIDATE, body)
          .then(() => {
            user.valid = Boolean(bool);
          });
      },

      initialize(){
        return $http.get(INITIALIZE)
          .then(() => {
              return true;
            },
            () => {
              return false;
            });
      },

      searchMatch(id){
        const MATCH_URL = MATCHES + id;

        return $http.get(MATCH_URL)
          .then(response => {
            return response.data;
          });
      },

      searchTeam(id){
        const TEAM_URL = TEAMS + id;

        return $http.get(TEAM_URL)
          .then(response => {
            return response.data;
          });
      },

      saveTeam(team, empty){
        const TEAM_UPDATE = TEAMS + team._id;

        if (!empty) {
          return $http.put(TEAM_UPDATE, team)
            .then(() => {
                return {message: 'saved.'};
              },
              () => {
                throw 'save Error';
              });
        } else {
          return Promise.resolve({message: 'Nothing to save.'});
        }
      },

      saveGroup(group){
        const GROUP_UPDATE = GROUP_ID + group._id;

        return $http.put(GROUP_UPDATE, group)
          .then(() => {
              return {message: 'saved'};
            },
            () => {
              throw 'save Error';
            });
      }
    };
  }]);
