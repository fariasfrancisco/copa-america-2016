'use strict';
(function () {

  class BettableComponent {
    constructor(QueryService) {
      this.querySvc = QueryService;
    }

    $onInit() {
      this.bets = this.querySvc.getBets();
    }
  }

  angular.module('copaamericaApp')
    .component('bettable', {
      templateUrl: 'app/bettable/bettable.html',
      controller: BettableComponent
    });

})();
