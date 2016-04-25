angular.module('copaamericaApp')
  .service('QueryService', ["$http", function ($http) {
    var groups = [];
    var teams = [];

    var compareGroup = function (a, b) {
      if (a.name < b.name) return -1;
      else if (a.name > b.name) return 1;
      else return 0;
    };

    var compareTeam = function (a, b) {
      if (a._id < b._id) return -1;
      else if (a._id > b._id) return 1;
      else return 0;
    };

    var compareLine = function (a, b) {
      if (a.position < b.position) return -1;
      else if (a.position > b.position) return 1;
      else return 0;
    };

    return {
      buildGroupsAndTeams: function () {
        var self = this;
        return $http.get('/api/groups/stage/group')
          .then(function (response) {
            groups = response.data;
            groups.sort(compareGroup);
            return $http.get('/api/teams')
              .then(function (response) {
                teams = response.data;
                teams.sort(compareTeam);
                groups.forEach(function (group) {
                  group.fullName = group.name.replace('G', 'Group ');
                  group.matches.forEach(function (match) {
                    match.home.teamName = teams[match.home._team].name;
                    match.away.teamName = teams[match.away._team].name;
                  });
                  self.buildTable(group);
                });
                return groups;
              })
          })
      },

      buildTable: function (group) {
        return $http.get('/api/groups/table/' + group.name)
          .then(function (response) {
            group.table = response.data;
            group.table.sort(compareLine);
            group.table.forEach(function (line) {
              line.teamName = teams[line.team].name;
            });
          });
      },

      getGroups: function () {
        return groups;
      },

      getTeams: function () {
        return teams;
      },

      cloneGroups: function () {
        return this.buildGroupsAndTeams().then(function (result) {
          return angular.copy(result);
        });
      },

      getStage: function (stage) {
        return $http.get('/api/groups/stage/' + stage)
          .then(function (response) {
            console.log(response.data);
            return response.data;
          })
      }
    }
  }]);