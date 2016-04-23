'use strict';

describe('Component: TournamentComponent', function () {

  // load the controller's module
  beforeEach(module('copaamericaApp'));

  var TournamentComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    TournamentComponent = $componentController('TournamentComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
