launcherApp.controller('steamSecurityMeasureGuideCtrl', ['$scope', '$state', '$stateParams', 'systemManager', 'loginManager', 'ngDialog',
  function($scope, $state, $stateParams, systemManager, loginManager, oauthManager, ngDialog) {

    $scope.userInfoReady = false;
    $scope.email = null;

    $scope.getUserInformation = function() {
      //
      loginManager.getCurrentUser().then(
        function(userInfo) {
          $scope.email = userInfo.email;
          $scope.userInfoReady = true;
        },
        function() {
          // failed to show information
          // but still can proceed
          $state.proceed();
        }
      );
    };

    $scope.proceed = function() {
      console.log('next (params): ' + $stateParams.goNext);

      var next = '^.activation';

      if ($stateParams.goNext != null)
        next = $stateParams.goNext;

      console.log('next (local): ' + next);

      $state.go(next);
    };

    $scope.goSignIn = function() {
      $state.go('^.signin');
    };

    //
    $scope.setInstantResize($stateParams.instantResize);

    //
    $scope.getUserInformation();

  }
]);