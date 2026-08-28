launcherApp.controller('redeemEntryCtrl', ['$scope', 'ngDialog', 'patchManager',
  function ($scope, ngDialog, patchManager) {

    $scope.redeem = function() {
      var dialog = ngDialog.open({
        template: 'views/common.redeem.html',
        controller: 'redeemCtrl',
        scope: $scope
      });
    };
  }
]);