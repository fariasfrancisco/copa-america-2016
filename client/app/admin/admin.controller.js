'use strict';

(function () {

  class AdminController {
    constructor(User, AdminService) {
      // Use the User $resource to fetch all users
      this.users = User.query();
      this.adminSvc = AdminService;
    }

    delete(user) {
      user.$remove();
      this.users.splice(this.users.indexOf(user), 1);
    }
  }

  angular.module('copaamericaApp.admin')
    .controller('AdminController', AdminController);

})();
