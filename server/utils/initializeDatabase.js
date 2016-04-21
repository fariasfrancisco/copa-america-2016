import Group from '../api/group/group.model';
import Team from '../api/team/team.model';
var groups;
var teams;

try {
  groups = require('./groups.json')
} catch (ex) {
  groups = {}
}

try {
  teams = require('./teams.json')
} catch (ex) {
  teams = {}
}

groups.forEach(function (current) {
  Group.create(current).then(function (res) {
    console.log(res);
  })
});

teams.forEach(function (current) {
  Team.create(current).then(function (res) {
    console.log(res);
  })
});
