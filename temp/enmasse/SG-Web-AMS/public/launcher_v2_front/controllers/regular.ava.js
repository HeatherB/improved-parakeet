launcherApp.controller('regularAVACtrl', ['$scope', "$http", "patchManager", "oauthManager", '$window', 'systemManager', "gameManager", "loginManager",
  function ($scope, $http, patchManager, oauthManager, $window, systemManager, gameManager, loginManager) {

    $scope.gameGameManager;   // refer to game of gameManager
    $scope.gamePatchManager;  // refer to game of patchManager
    $scope.selectedLang;      // remember user's language selection

    // access to gamePatchManager
    $scope.getGamePatchManager = function() {
      return $scope.gamePatchManager;
    };

    // get language selection
    $scope.chooseLanguage = function(lang, save) {
      if(lang == undefined) {
        if($('.game-options input[name=select-language]:checked').length > 0){
          lang = $('.game-options input[name=select-language]:checked').val();
        } else {
          lang = $('.game-options input[name=select-language]:first').val();
        }
      }
      $scope.selectedLang = lang;
      $scope.chosenLang = "-sublang=" + lang;
      if(save){
        loginManager.getCurrentUser().then(
          function(user) {
            var sett = systemManager.getSettingKey("{0}-{1}-lang".format(user.id, $scope.gameGameManager.game));
            window.settings.set(sett, lang);
            window.settings.save();
          },
          function(code) {
            console.log('error in getting current user: ' + code);
          }
        );
      }

      // notify patchManager that user's changed language setting
      // it's applied to command line options actually.
      patchManager.setExtraCommandOption('ava', 'language', $scope.chosenLang);
    };

    // set point to both gameManager and patchManager
    $scope.gameGameManager = gameManager.getGameWithName('ava');
    $scope.gamePatchManager = patchManager.getGameWithName('ava');      // this can be null for early stage games
    $scope.gamestatus = patchManager.getGameStatusEnum();
    $scope.images = [];
    angular.copy($scope.gameGameManager.gumballs, $scope.images);
    $scope.images = $scope.images.splice(1,100);

    // language setting
    loginManager.getCurrentUser().then(
      function(user) {
        var sett = systemManager.getSettingKey("{0}-{1}-lang".format(user.id, $scope.gameGameManager.game));
        var lang = window.settings.get(sett);
        $scope.chooseLanguage(lang, false);
      },
      function(code) {
        console.log('error in getting current user: ' + code);
      }
    );
  }
]);