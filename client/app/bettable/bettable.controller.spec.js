'use strict';

describe('Component: BettableComponent', function () {

  // load the controller's module
  beforeEach(module('copaamericaApp'));

  var BettableComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    BettableComponent = $componentController('BettableComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
