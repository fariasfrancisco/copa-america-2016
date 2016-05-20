import moment from 'moment';
import Group from '../group/group.model.js';
import Team from '../team/team.model.js';
import groups from './groups.json';
import teams from './teams.json';

let init = {};

init.initialize = function (req, res) {
  try {
    groups.forEach(group => {
      group.matches.forEach(match => {
        match.date = moment.utc(match.date);
      });

      Group.create(group)
        .catch(res => {
          console.log(res);
          throw 'Failed to create group';
        });
    });
  } catch (err) {
    return res.status(500)
      .json({message: 'Error when building groups'})
      .end();
  }

  try {
    let players;

    teams.forEach(team => {
      try {
        players = require("./teams/" + team.name + ".json");
      } catch (e) {
        console.log('can\'t find ' + team.name + '.json');
        players = [];
      }
      team.players = players;

      Team.create(team)
        .catch(res => {
          console.log(res);
          throw 'Failed to create team';
        });
    });
  } catch (err) {
    return res.status(500)
      .json({message: 'Error when building teams'})
      .end();
  }
  return res.status(200)
    .json({message: 'Done loading teams & groups'})
    .end();
};

module.exports = init;
