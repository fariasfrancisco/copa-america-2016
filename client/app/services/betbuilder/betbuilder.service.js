'use strict';

angular.module('copaamericaApp')
  .service('BetBuilder', function () {
    var bet = {
      matches: [],
      groups: []
    };

    return {
      buildBet(betData){
        bet._user = betData.user;
        bet.goldenBoot = betData.goldenBoot;

        bet.podium = {
          first: betData.podium.firstPlace._id,
          second: betData.podium.secondPlace._id,
          third: betData.podium.thirdPlace._id
        };

        betData.matches.forEach(function (match, id) {
          bet.matches.push({
            _id: id,
            home: match.home,
            away: match.away
          });
        });

        betData.groups.forEach(function (group, name) {
          bet.groups.push({
            name: name,
            first: group.first,
            second: group.second
          });
        });
      }
    }
  });
