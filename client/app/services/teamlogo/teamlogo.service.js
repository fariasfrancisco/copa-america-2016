'use strict';

angular.module('copaamericaApp')
  .service('TeamLogoService', function () {
    const largeLogoPaths = [
      'assets/images/team_logos/large/0.png',
      'assets/images/team_logos/large/1.png',
      'assets/images/team_logos/large/2.png',
      'assets/images/team_logos/large/3.png',
      'assets/images/team_logos/large/4.png',
      'assets/images/team_logos/large/5.png',
      'assets/images/team_logos/large/6.png',
      'assets/images/team_logos/large/7.png',
      'assets/images/team_logos/large/8.png',
      'assets/images/team_logos/large/9.png',
      'assets/images/team_logos/large/10.png',
      'assets/images/team_logos/large/11.png',
      'assets/images/team_logos/large/12.png',
      'assets/images/team_logos/large/13.png',
      'assets/images/team_logos/large/14.png',
      'assets/images/team_logos/large/15.png',
      'assets/images/team_logos/large/q.png'
    ];
    
    const smallLogoPaths = [
      'assets/images/team_logos/small/0.png',
      'assets/images/team_logos/small/1.png',
      'assets/images/team_logos/small/2.png',
      'assets/images/team_logos/small/3.png',
      'assets/images/team_logos/small/4.png',
      'assets/images/team_logos/small/5.png',
      'assets/images/team_logos/small/6.png',
      'assets/images/team_logos/small/7.png',
      'assets/images/team_logos/small/8.png',
      'assets/images/team_logos/small/9.png',
      'assets/images/team_logos/small/10.png',
      'assets/images/team_logos/small/11.png',
      'assets/images/team_logos/small/12.png',
      'assets/images/team_logos/small/13.png',
      'assets/images/team_logos/small/14.png',
      'assets/images/team_logos/small/15.png',
      'assets/images/team_logos/small/q.png'
    ];

    return {
      getSmallPath(index) {
        return smallLogoPaths[index];
      },
      
      getLargePath(index) {
        return largeLogoPaths[index];
      }
    };
  });
