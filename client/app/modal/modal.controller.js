'use strict';

angular.module('copaamericaApp')
  .controller('ModalCtrl', ['$scope', '$uibModalInstance', 'ModalService', function ($scope, $uibModalInstance, ModalService) {
    $scope.modalSvc = ModalService;

    $scope.ok = function () {
      $uibModalInstance.close();
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss();
    };
  }]);
