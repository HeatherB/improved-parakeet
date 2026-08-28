launcherApp.controller('steamGameCtrl', ['$scope', "$http", "$state", "$stateParams", "patchManager", "steamManager", 'systemManager', "gameManager", "loginManager", "ngDialog",
  function ($scope, $http, $state, $stateParams, patchManager, steamManager, systemManager, gameManager, loginManager, ngDialog) {

    $scope.gameGameManager;   // refer to game of gameManager
    $scope.gamePatchManager;  // refer to game of patchManager
    $scope.pageLoaded = false;
    $scope.pageShowed = false;

    // access to gamePatchManager
    $scope.getGamePatchManager = function() {
      return $scope.gamePatchManager;
    };

    $scope.initialize = function() {

      // set resize mode
      console.log($stateParams.instantResize);
      $scope.setInstantResize($stateParams.instantResize);

      // set timer
      setTimeout(function() {
        $scope.pageShowed = true;
      }, 250);

      // decide which game we're on
      var gameName = patchManager.getGameFromSteam(steamManager.getSteamAppID()).name.toLowerCase();
      $state.go('steam.games.{0}'.format(gameName));

      // get game references both from gameManager and patchManager
      gameManager.allGames().then(
        function(games) {
          // set point to both gameManager and patchManager
          var gameName = patchManager.getGameFromSteam(steamManager.getSteamAppID()).name.toLowerCase();
          $scope.gameGameManager = gameManager.getGameWithName(gameName);
          $scope.gamePatchManager = patchManager.getGameWithName(gameName);      // this can be null for early stage games
          $scope.pageLoaded = true;
        },
        function(error_code) {
          $scope.alertErrorExit(error_code);
        }
      );

      loginManager.getCurrentUser().then(
        function(user) {
        },
        function(code) {
          console.log('error in getting current user: ' + code);
        }
      );
    };

    $scope.initialize();
  }
]);