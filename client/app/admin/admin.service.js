'use strict';

angular.module('copaamericaApp')
  .service('AdminService', ['$http', function ($http) {
    const USER_API = '/api/users/',
      VALIDATE = '/validate';

    return {
      validate: function (user, bool) {
        let id = user._id,
          body = {valid: Boolean(bool)};

        const USER_VALIDATE = USER_API + id + VALIDATE;

        return $http.put(USER_VALIDATE, body)
          .then(() => {
            user.valid = Boolean(bool);
          });
      }
    };
  }]);
