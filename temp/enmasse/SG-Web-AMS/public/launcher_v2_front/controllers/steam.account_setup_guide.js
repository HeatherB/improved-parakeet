launcherApp.controller('steamAccountSetupGuideCtrl', ['$scope', '$state', '$stateParams', 'ngDialog', function ($scope, $state, $stateParams, ngDialog) {
  $scope.proceed = function() {
    $state.go('^.signin');
  };
  /*$scope.proceed = function() {
    var dialog = ngDialog.open({
      template: 'views/steam.signin.html',
    });
  };*/

  //
  $scope.setInstantResize($stateParams.instantResize);

}]);