launcherApp.controller('regularKRITIKACtrl', ['$scope', "$http", "patchManager", "oauthManager", '$window', 'systemManager', "gameManager", "loginManager",
  function ($scope, $http, patchManager, oauthManager, $window, systemManager, gameManager, loginManager) {

  	$scope.gameGameManager;   // refer to game of gameManager
    $scope.gamePatchManager;  // refer to game of patchManager
  	$scope.selectedServer;      // remember user's server selection
    //$scope.userHasBetaAccess;   // remember if user has beta access
    $scope.inBeta;
    $scope.grantCode = "deny";

    $scope.selectedStage;

  	// access to gamePatchManager
    $scope.getGamePatchManager = function() {
      return $scope.gamePatchManager;
    };

  	$scope.chooseServer = function(server, save) {
      if(typeof server == "undefined") {
        if($('.game-options input[name=select-server]:checked').length > 0){
          server = $('.game-options input[name=select-server]:checked').val();
        } else {
          server = $('.game-options input[name=select-server]:first').val();
        }
      }

      if (typeof server == "undefined")
      	server = "server-na";

      $scope.selectedServer = server;
      if (server == "server-eu")
      	$scope.chosenServer = "--selectWorld 11"
      else
      	$scope.chosenServer = "--selectWorld 1"

      if(save){
        loginManager.getCurrentUser().then(
          function(user) {
            var sett = systemManager.getSettingKey("{0}-{1}-server".format(user.id, $scope.gameGameManager.game));
            window.settings.set(sett, server);
            window.settings.save();
          },
          function(code) {
            console.log('error in getting current user: ' + code);
          }
        );
      }

      // notify patchManager that user's changed server setting
      // it's applied to command line options actually.
      patchManager.setExtraCommandOption('kritika', 'server', $scope.chosenServer);
    };

    $scope.in_beta = function() {
      return $scope.inBeta;
    };
    
    $scope.grant_code = function(code) {
      return ($scope.grantCode.toLowerCase() == code.toLowerCase());
    };

    $scope.can_override = function() {
      var env = app.getConfig("Environment", "local");
      if (env == "production") {
        return false;
      }
      return true;
    };

    $scope.override = function() {
      $scope.grantCode = "allow";
      $scope.gameGameManager.beta = false;
    };

    $scope.showStageSelect = function() {
      var env = app.getConfig("Environment", "production");

      if ($scope.gamePatchManager.stages.length > 0 && env != "production")
        return true;
      return false;
    };

    $scope.canSwitchStage = function() {
      var status = $scope.gamePatchManager.status;

      if (status == patchManager.gamestatus.INSTALLING
        || status == patchManager.gamestatus.PATCHING
        || status == patchManager.gamestatus.PAUSED
        || status == patchManager.gamestatus.RUNNING
        || status == patchManager.gamestatus.REPAIRING)
        return false;

      return true;
    };

    $scope.chooseStage = function(stage, save) {
      if(typeof stage == "undefined") {
        if($('.game-options input[name=select-stage]:checked').length > 0){
          stage = $('.game-options input[name=select-stage]:checked').val();
        } else {
          stage = $('.game-options input[name=select-stage]:first').val();
        }
      }

      if (typeof stage == "undefined") {
        stage = 'stage-' + this.gamePatchManager.stages[0].name;
        $('.game-options input[name=select-stage][value='+ stage +']').attr('checked', 'checked');
      }

      $scope.selectedStage = stage;

      if(save){
        loginManager.getCurrentUser().then(
          function(user) {
            var sett = systemManager.getSettingKey("{0}-{1}-stage".format(user.id, $scope.gameGameManager.game));
            window.settings.set(sett, stage);
            window.settings.save();
          },
          function(code) {
            console.log('error in getting current user: ' + code);
          }
        );
      }

      patchManager.setStage(this.gamePatchManager.id, stage.match(/stage-(\w+)/)[1]);
    };

    $scope.userHasAccessToGame = function(access) {
      // finally, launcher declare current user has full access to game
      //console.log("userHasAccessToGame: ");
      //console.dir($scope.gamePatchManager);

      // set access grant flag for default actions to be performed
      $scope.gamePatchManager.userHasAccessToGame = access;

      //console.dir($scope.gamePatchManager);

      return true;
    };

    $scope.onRedeemSucceeded = function() {
      $scope.checkBetaAccess();
      setTimeout(function() {$scope.checkBetaAccess();}, 5000);
    };

    $scope.checkBetaAccess = function() {
      if ($scope.inBeta) {
        loginManager.getBetaAccessCode($scope.gamePatchManager.id, 
          function(code) {
            $scope.grantCode = code;
            console.log('user has grant code: ' + code);
          },
          function() {
            $scope.grantCode = "deny";
            console.log('system denial');
          },
          function(code) {
            $scope.grantCode = "deny";
            console.log('error in getting beta access code: ' + code);
          });
      } else {
        $scope.grantCode = 'allow';
      }
    };

    $scope.gameGameManager = gameManager.getGameWithName('kritika');
    $scope.gamePatchManager = patchManager.getGameWithName('kritika');      // this can be null for early stage games
    $scope.gamestatus = patchManager.getGameStatusEnum();
    $scope.images = [];
    angular.copy($scope.gameGameManager.gumballs, $scope.images);
    $scope.images = $scope.images.splice(1,100);

    // check if user have beta access
    $scope.inBeta = $scope.gameGameManager.beta;
    $scope.gamePatchManager.inBeta = $scope.gameGameManager.beta;
    // $scope.userHasBetaAccess = false;
    // if ($scope.inBeta) {
    //   console.log('KRITIKA: detected that this game is in beta');
    //   gameManager.userBetaAccess().then(
    //     function(success) {
    //       $scope.userHasBetaAccess = $scope.gameGameManager.beta_access;
    //       $scope.updateUI();
    //     },
    //     function(code) {
    //       console.log('error in getting beta access for user: ' + code);
    //     }
    //   )
    // }
    // if ($scope.userHasBetaAccess) {
    //   console.log('this user has beta access');
    // } else {
    //   console.log("this user doesn't have beta access");
    // }

    // another access control
    $scope.checkBetaAccess();


    // server setting
    loginManager.getCurrentUser().then(
      function(user) {
        var sett = systemManager.getSettingKey("{0}-{1}-server".format(user.id, $scope.gameGameManager.game));
        var server = window.settings.get(sett);
        $scope.chooseServer(server, false);

        // 
        if ($scope.showStageSelect()) {
          var sett = systemManager.getSettingKey("{0}-{1}-stage".format(user.id, $scope.gameGameManager.game));
          var stage = window.settings.get(sett);
          $scope.chooseStage(stage, false);
        }

        //

      },
      function(code) {
        console.log('error in getting current user: ' + code);
      }
    );

    // stage selection
    //console.dir($scope.gamePatchManager.stages);
    //patchManager.setStage($scope.gamePatchManager.id, 'beta');


  }]);