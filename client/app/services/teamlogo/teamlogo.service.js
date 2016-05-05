'use strict';

angular.module('copaamericaApp')
  .service('TeamLogoService', function () {
    let logoPaths = [
      'assets/images/team_logos/0.png',
      'assets/images/team_logos/1.png',
      'assets/images/team_logos/2.png',
      'assets/images/team_logos/3.png',
      'assets/images/team_logos/4.png',
      'assets/images/team_logos/5.png',
      'assets/images/team_logos/6.png',
      'assets/images/team_logos/7.png',
      'assets/images/team_logos/8.png',
      'assets/images/team_logos/9.png',
      'assets/images/team_logos/10.png',
      'assets/images/team_logos/11.png',
      'assets/images/team_logos/12.png',
      'assets/images/team_logos/13.png',
      'assets/images/team_logos/14.png',
      'assets/images/team_logos/15.png',
      'assets/images/team_logos/q.png'
    ];

    return {
      getPath(index) {
        return logoPaths[index];
      }
    };
  });
