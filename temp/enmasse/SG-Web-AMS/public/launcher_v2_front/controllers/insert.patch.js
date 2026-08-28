launcherApp.controller('patchCtrl', ['$scope', '$state', 'steamManager', 'patchManager',
  function ($scope, $state, steamManager, patchManager) {

    $scope.game;
    $scope.gamestatus;

    $scope.initialize = function(name) {
      $scope.game = patchManager.getGameWithName(name.toLowerCase());
      $scope.gamestatus = patchManager.getGameStatusEnum();

      if ($scope.game == null) {
        $scope.alertErrorExit('C0018');
      }

      // register handlers
      patchManager.setUpdateStatusHandler('patchCtrl_' + name, function(id, oldState, newState, progress) {

        if ($scope.game.id != id) return;

        if (oldState != newState) {
          $scope.updateUI();
        }

        if (typeof progress != 'undefined' && progress != null) {
          $scope.updateUI();
        }
      });

      patchManager.setErrorReportHandler('steamPatchCtrl', function(info) {

        if (info.errorCode == 1 || info.errorCode == 2) {
          // user cancel in most cases
          $scope.breaking = true;

        } else if (info.errorCode == 3) {
          $scope.alertErrorExit('C0014');
        } else if (info.errorCode == 4) {
          $scope.alertInsufficientSpace();
        } else if (info.errorCode == 5) {
          $scope.alertErrorExit('C0015');
        } else if (info.errorCode == 6) {
          $scope.alertErrorExit('C0016');
        } else if (info.errorCode == 7) {
          $scope.alertErrorExit('C0017');
        } else if (info.errorCode == 8) {
          $scope.alertBadUserNoExit(info.message);
        } else if (info.errorCode == 9) {
          $scope.alertErrorRetry(info.code);
        }
      });
    };

    $scope.install = function() {
      patchManager.install($scope.game.id, function() {});
    };

    $scope.patch = function() {
      patchManager.patch($scope.game.id);
    };

    $scope.repair = function() {
      patchManager.repair($scope.game.id);
    };

    $scope.pause = function() {
      patchManager.pause($scope.game.id);
    };

    $scope.resume = function() {
      patchManager.resume($scope.game.id);
    }

    $scope.play = function() {
      patchManager.play($scope.game.id, function() {});
    };
  }
]);