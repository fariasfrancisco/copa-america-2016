'use strict';

angular.module('copaamericaApp')
  .service('BetBuilderService', ['$http', ($http) => {
    const GROUP_NAMES = ['GA', 'GB', 'GC', 'GD'],
      BETS_API = '/api/bets/';

    let bet = {
      matches: [],
      groups: []
    };

    return {
      buildBet(betData) {
        bet._user = betData.user._id;
        bet.name = betData.user.name;
        bet.goldenBoot = betData.goldenBoot;
        bet.podium = {
          first: betData.podium.firstPlace._id,
          second: betData.podium.secondPlace._id,
          third: betData.podium.thirdPlace._id
        };

        let match, group;
        
        for (let i = 0; i < 32; i++) {
          match = betData.matches[i];

          bet.matches.push({
            _id: i,
            home: match.home,
            away: match.away
          });
        }
        
        for (let i = 0; i < 4; i++) {
          group = betData.groups[GROUP_NAMES[i]];

          bet.groups.push({
            name: GROUP_NAMES[i],
            first: group.first,
            second: group.second
          });
        }

        return $http.post(BETS_API, bet)
          .then(() => {
            bet = {
              matches: [],
              groups: []
            };
          }, res => {
            throw {message: 'Could not create Bet in the database', status: res.status};
          });
      }
    };
  }]);
