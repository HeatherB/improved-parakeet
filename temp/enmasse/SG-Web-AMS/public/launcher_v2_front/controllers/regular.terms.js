launcherApp.controller('regularTermsCtrl', ['$scope', '$state', function ($scope, $state) {

  //$scope.goSignUp = function() {
  //  $state.go('^.signup');
  //}
  // need to close terms and return to signup flow

  $scope.goSignUp = function() {
    $state.go('^.signup');
  }

}]);