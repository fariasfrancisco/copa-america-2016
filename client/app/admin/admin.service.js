'use strict';

angular.module('copaamericaApp')
  .service('AdminService', ['$http', function ($http) {
    const USER_API = '/api/users/',
      VALIDATE = '/validate',
      INITIALIZE_API = '/api/init/',
      MATCH_API = '/api/groups/match/',
      TEAMS_API = '/api/teams/',
      GROUPS_API = '/api/groups/id/';

    return {
      validate(user, bool) {
        const id = user._id,
          body = {valid: Boolean(bool)};

        const USER_VALIDATE = USER_API + id + VALIDATE;

        return $http.put(USER_VALIDATE, body)
          .then(() => {
            user.valid = Boolean(bool);
          });
      },

      initialize(){
        return $http.get(INITIALIZE_API)
          .then(response => {
              console.log(response.data, response.status);
            },
            err => {
              console.log(err.data, err.status);
            });
      },

      searchMatch(id){
        if (isNaN(parseInt(id)) || !isFinite(id)) throw 'Not a Number';
        if (parseInt(id) > 31 || parseInt(id) < 0) throw 'Out of Range';

        const MATCH_SEARCH = MATCH_API + id;

        return $http.get(MATCH_SEARCH)
          .then(response => {
            return response.data;
          });
      },

      getTeam(id){
        const TEAM_SEARCH = TEAMS_API + id;

        return $http.get(TEAM_SEARCH)
          .then(response => {
            return response.data;
          });
      },

      clone(obj){
        return angular.copy(obj);
      },

      saveTeam(team, empty){
        const TEAM_UPDATE = TEAMS_API + team._id;

        if (!empty) {
          return $http.put(TEAM_UPDATE, team)
            .then(() => {
                return {message: 'saved.'}
              },
              () => {
                throw 'save Error';
              });
        } else {
          return Promise.resolve({message: 'Nothing to save.'})
        }
      },

      saveGroup(group){
        const GROUP_UPDATE = GROUPS_API + group._id;

        return $http.put(GROUP_UPDATE, group)
          .then(() => {
              return {message: 'saved'}
            },
            () => {
              throw 'save Error';
            });
      }
    };
  }]);
