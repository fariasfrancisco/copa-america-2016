'use strict';

angular.module('copaamericaApp')
  .service('BetBuilder', ['$http', function ($http) {
    const GROUP_NAMES = ['GA', 'GB', 'GC', 'GD'],
      BETS_API = '/api/bets/';

    let bet = {
      matches: [],
      groups: []
    };

    return {
      buildBet(betData){
        bet._user = betData.user._id;
        bet.name = betData.user.name;
        bet.goldenBoot = betData.goldenBoot;

        bet.podium = {
          first: betData.podium.firstPlace._id,
          second: betData.podium.secondPlace._id,
          third: betData.podium.thirdPlace._id
        };

        for (let i = 0; i < 32; i++) {
          let match = betData.matches[i];

          bet.matches.push({
            _id: i,
            home: match.home,
            away: match.away
          });
        }

        for (let i = 0; i < 4; i++) {
          let group = betData.groups[GROUP_NAMES[i]];

          bet.groups.push({
            name: GROUP_NAMES[i],
            first: group.first,
            second: group.second
          });
        }

        return $http.post(BETS_API, bet).then(() => {
          bet = {
            matches: [],
            groups: []
          };
        });
      }
    };
  }]);
