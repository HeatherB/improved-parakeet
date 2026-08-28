launcherApp.controller('steamZMRCtrl', ['$scope', "$http", "patchManager", "oauthManager", '$window', 'systemManager', "gameManager", "loginManager",
  function ($scope, $http, patchManager, oauthManager, $window, systemManager, gameManager, loginManager) {
    $scope.selectedLang;      // remember user's language selection

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
      patchManager.setExtraCommandOption('zmr', 'language', $scope.chosenLang);
    };

    $scope.initialize = function() {

      $scope.images = $scope.gameGameManager.gumballs.splice(1,100);

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

    $scope.initialize();
  }
]);