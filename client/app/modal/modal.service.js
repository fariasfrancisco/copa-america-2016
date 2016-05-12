'use strict';

angular.module('copaamericaApp')
  .service('ModalService', function () {
    let editWarning, restartWarning;

    return {
      init() {
        editWarning = false;
        restartWarning = false;
      },

      getEditWarn() {
        return editWarning;
      },

      setEditWarn(value){
        editWarning = value;
      },

      getRestartWarn() {
        return restartWarning;
      },

      setRestartWarn(value){
        restartWarning = value;
      }
    };
  });