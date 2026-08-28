launcherApp.controller('toolsCtrl', ['$scope', '$state', 'steamManager', 'patchManager', 'systemManager',
  function ($scope, $state, steamManager, patchManager, systemManager) {

    $scope.showRepairTool = function() {
      if ($scope.getGamePatchManager() != null && $scope.getGamePatchManager().status == patchManager.getGameStatusEnum().READY_TO_RUN)
        return true;
      return false;
    };

    $scope.repair = function() {
      if ($scope.getGamePatchManager() != null) {
        patchManager.repair($scope.getGamePatchManager().id);
      }
    };

    $scope.runEMEDiag = function() {
      systemManager.runEMEDiag();
    };
  }
]);