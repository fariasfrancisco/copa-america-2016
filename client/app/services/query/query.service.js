angular.module('copaamericaApp')
  .service('QueryService', ["$http", function ($http) {
    let groups = [],
      teams = [],
      bets;

    const GROUP_STAGE_API = '/api/groups/stage/group',
      TEAMS_API = '/api/teams',
      GROUP_TABLE_API = '/api/groups/table/',
      STAGE_API = '/api/groups/stage/',
      BETS_API = '/api/bets/';

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

    return {
      buildGroupsAndTeams: function () {
        let self = this;
        return $http.get(GROUP_STAGE_API).then(response => {
          groups = response.data;
          groups.sort(compareGroup);

          return $http.get(TEAMS_API).then(response => {
            teams = response.data;
            teams.sort(compareTeam);

            groups.forEach(group => {
              group.fullName = group.name.replace('G', 'GROUP_');

              group.matches.forEach(match => {
                match.home.teamName = teams[match.home._team].name;
                match.away.teamName = teams[match.away._team].name;
              });

              self.buildTable(group).then(table => {
                group.table = table;
              });
            });
            return groups;
          });
        })
      },

      buildTable: function (group) {
        let groupTable = GROUP_TABLE_API + group.name;

        return $http.get(groupTable).then(function (response) {
          let table = response.data;
          table.sort(compareLine);

          table.forEach(line => {
            line.teamName = teams[line.team].name;
          });

          return table;
        });
      },

      getGroups: function () {
        return groups;
      },

      getTeams: function () {
        return teams;
      },

      cloneGroups: function () {
        return this.buildGroupsAndTeams().then(result => {
          return angular.copy(result);
        });
      },

      getStage: function (stage) {
        let stageApi = STAGE_API + stage;

        return $http.get(stageApi).then(response => {
          return response.data;
        });
      },

      getBets: function () {
        return $http.get(BETS_API).then(response => {
          return response.data;
        });
      }
    }
  }]);
