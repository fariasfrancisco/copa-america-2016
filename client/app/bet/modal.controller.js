'use strict';

angular.module('copaamericaApp')
  .controller('ModalController', ['$scope', '$uibModalInstance', 'ModalService', ($scope, $uibModalInstance, ModalService) => {
    $scope.modalSvc = ModalService;

    $scope.ok = () => {
      $uibModalInstance.close();
    };

    $scope.cancel = () => {
      $uibModalInstance.dismiss();
    };
  }]);
