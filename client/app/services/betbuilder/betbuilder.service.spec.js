'use strict';

describe('Service: betbuilder', function () {

  // load the service's module
  beforeEach(module('copaamericaApp'));

  // instantiate service
  var betbuilder;
  beforeEach(inject(function (_betbuilder_) {
    betbuilder = _betbuilder_;
  }));

  it('should do something', function () {
    expect(!!betbuilder).toBe(true);
  });

});
