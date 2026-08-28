launcherApp.controller('regularMainCtrl', ['$scope', '$state',
  function ($scope, $state) {
    $state.go('.signin', {instantResize: true});
  }]);
