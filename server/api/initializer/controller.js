import moment from 'moment';
import Group from '../group/group.model.js';
import Team from '../team/team.model.js';
import groups from './groups.json';
import teams from './teams.json';

let init = {};

init.initialize = function (req, res) {
  groups.forEach(function (group) {
    group.matches.forEach(function (match) {
      match.date = moment.utc(match.date);
    });
  });

  groups.forEach(group => {
    Group.create(group);
  });

  teams.forEach(team => {
    Team.create(team);
  });

  return res.status(200)
    .json({message: 'Done loading teams & groups'})
    .end();
};

module.exports = init;
