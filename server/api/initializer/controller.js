import moment from 'moment';
import Group from '../group/group.model.js';
import Team from '../team/team.model.js';
import groups from './groups.json';
import teams from './teams.json';

var init = {};

init.initialize = function () {
  groups.forEach(function (group) {
    group.matches.forEach(function (match) {
      match.date = moment.utc(match.date);
    });

    Group.create(group).then(function (res) {
      console.log(res);
    })
  });

  teams.forEach(function (team) {
    Team.create(team).then(function (res) {
      console.log(res);
    })
  });
};

module.exports = init;
