'use strict';

describe('Component: BetComponent', function () {

  // load the controller's module
  beforeEach(module('copaamericaApp'));

  var BetComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    BetComponent = $componentController('BetComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
