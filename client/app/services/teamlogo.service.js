'use strict';

angular.module('copaamericaApp')
  .service('TeamLogoService', function () {
    const largeLogoPaths = [
      'assets/images/team_logos_large/0.png',
      'assets/images/team_logos_large/1.png',
      'assets/images/team_logos_large/2.png',
      'assets/images/team_logos_large/3.png',
      'assets/images/team_logos_large/4.png',
      'assets/images/team_logos_large/5.png',
      'assets/images/team_logos_large/6.png',
      'assets/images/team_logos_large/7.png',
      'assets/images/team_logos_large/8.png',
      'assets/images/team_logos_large/9.png',
      'assets/images/team_logos_large/10.png',
      'assets/images/team_logos_large/11.png',
      'assets/images/team_logos_large/12.png',
      'assets/images/team_logos_large/13.png',
      'assets/images/team_logos_large/14.png',
      'assets/images/team_logos_large/15.png',
      'assets/images/team_logos_large/q.png'
    ];
    
    const smallLogoPaths = [
      'assets/images/team_logos_small/0.png',
      'assets/images/team_logos_small/1.png',
      'assets/images/team_logos_small/2.png',
      'assets/images/team_logos_small/3.png',
      'assets/images/team_logos_small/4.png',
      'assets/images/team_logos_small/5.png',
      'assets/images/team_logos_small/6.png',
      'assets/images/team_logos_small/7.png',
      'assets/images/team_logos_small/8.png',
      'assets/images/team_logos_small/9.png',
      'assets/images/team_logos_small/10.png',
      'assets/images/team_logos_small/11.png',
      'assets/images/team_logos_small/12.png',
      'assets/images/team_logos_small/13.png',
      'assets/images/team_logos_small/14.png',
      'assets/images/team_logos_small/15.png',
      'assets/images/team_logos_small/q.png'
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
