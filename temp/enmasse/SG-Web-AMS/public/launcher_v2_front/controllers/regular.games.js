launcherApp.controller('regularGameCtrl', ['$scope', "$http", "$state", "patchManager", "oauthManager", 'systemManager', "gameManager", "loginManager", "ngDialog",
  function ($scope, $http, $state, patchManager, oauthManager, systemManager, gameManager, loginManager, ngDialog) {

    $scope.pageLoaded = false;
    $scope.gameStatus = null;
    $scope.gamesPatchManager = null;
    $scope.gamesGameManager = null;
    $scope.user = null;


    // api base url
    $scope.apiBaseURL = app.getConfig("APIBaseURL", "");

    // ams base url
    $scope.amsBaseURL = app.getConfig("AMSWebBaseURL", "");

    //
    // register patch manager handlers
    $scope.registerHandlers = function() {
      patchManager.setUpdateStatusHandler("regularMainCtrl", function (id, oldState, newState, progress) {
        //console.log('game:{0} oldState:{1} newState:{2} progress:{3}'.format(id, oldState, newState, progress));
      });

      patchManager.setLauncherStatusHandler("regularMainCtrl", function (oldState, newState, progress) {
        console.log('launcher: oldState:{0} newState:{1} progress:{2}'.format(oldState, newState, progress));
      });

      patchManager.setErrorReportHandler("regularMainCtrl", function(info) {
        console.log('gameID:{0} errorCode:{1}'.format(info.gameID, info.errorCode));
      });

      systemManager.setDefaultActionHandler("regularMainCtrl", function(id) {
        console.log('default action for gameID: ' + id);
        var index = gameManager.getIndexFromID(id);
        if (index != null) {
          $scope.onGameClick(index);
        }
      })
    };

    //
    // setup patchManager related
    $scope.setupPatchManager = function() {

      // catch events from patch manager
      $scope.registerHandlers();

      // get game status enum
      $scope.gameStatus = patchManager.getGameStatusEnum();

      // games from patch manager
      $scope.gamesPatchManager = patchManager.getGames();

    };

    //
    // setup gameManager related
    $scope.setupGameManager = function() {

      // games from game manager
      gameManager.allGames().then(
        function(games) {
          $scope.gamesGameManager = games;

          // adjust current index
          //$scope.adjustCurrentIndex();

          // show current page
          $scope.onGameClick(gameManager.currentIndex());

          // good spot for showing this window
          $scope.pageLoaded = true;

          // assign shortcut to corresponding game in patchManager
          $scope.setShortcut();

          // run default action
          $scope.runDefaultAction();
        },
        function(error_code) {
          $scope.alertErrorExit(error_code);
        }
      );
    };

    $scope.setShortcut = function() {
      for (i=0;i<$scope.gamesGameManager.length;i++) {
        var game = $scope.gamesGameManager[i];
        for (j=0;j<$scope.gamesPatchManager.length;j++) {
          var _game = $scope.gamesPatchManager[j];
          if (game.game.toLowerCase() == _game.name.toLowerCase()) {
            game.gamePM = _game;
          }
        }
      }
    };

    //
    // retrieve user information
    $scope.retrieveUserInformation = function() {
      $scope.getWallet();
      loginManager.getCurrentUser().then(
        function(user) {
          $scope.user = user;
        },
        function(code) {
          console.log('error in getting user information: ' + code);
        }
      );
    };

    //
    // check and run defaultAction
    $scope.runDefaultAction = function() {
      // check if game repository check is done periodically

      var count = 0;
      var interval = setInterval(function() {
        count = count + 1;
        console.log("checking all game repository: " + count);
        if (patchManager.isAllGameRepositoryStatusCheckDone()) {
          $scope._runDefaultAction();
          clearInterval(interval);
        } else {
          if (count > 10) {
            clearInterval(interval);
          }
        }
      }, 1000);
    };

    $scope._runDefaultAction = function() {
      systemManager.checkDefaultAction(function(action, go, hold) {
        console.log("run default action: " + JSON.stringify(action));

        // if it is uninstall action, show confirmation alert
        if (action.type == 'uninstall') {

          // get game fullname
          var game = patchManager.getGameWithName(action.params.gameName);
          if (game == null) {
            console.log('could not fetch game with name: ' + action.params.gameName);
            return;
          }

          // uninstall game confirmation
          ngDialog.openConfirm({
            template: 'views/common.confirm_uninstall.html',
            plain: false,
            data: {
              gameName: game.displayName
            }
          }).then(
            function() { console.log('uninstall game.'); go(); },//systemManager.doDefaultAction(); },
            function() { console.log('canceled.'); hold(); }
          );
        } else if (action.type == 'install' || action.type == 'run') {

          // get game
          var game = patchManager.getGameWithName(action.params.gameName);
          if (game == null) {
            console.log('could not fetch game with name: ' + action.params.gameName);
            return;  
          }

          // check if this is in beta
          if (game.inBeta == true) {
            // check if current user has full access to this game
            var count = 0;
            var interval = setInterval(function() {
              count = count + 1;
              console.log("checking full access to game: " + count);
              if (game.userHasAccessToGame == true) {
                clearInterval(interval);
                go();
              } else if (game.userHasAccessToGame == false) {
                clearInterval(interval);
                hold();
              } else {
                if (count > 10) {
                  clearInterval(interval);
                  hold();
                }
              }
            }, 1000);
          } else {
            go();
          }
        } else {
          go();
        }
      });
    };

    // unit functions exposed at dashboard
    $scope.initialize = function() {

      // patchManager related
      $scope.setupPatchManager();

      // gameManager related
      $scope.setupGameManager();

      // get user infomation
      $scope.retrieveUserInformation();

    };

    $scope.onGameClick = function(index) {
      var maxIndex = $scope.gamesGameManager.length - 1;
      if (index > maxIndex || index < 0) {
        // if new tab is out of index, we can just set it to zero
        console.log("new index is out of bound. We set it to zero" + index);
        index = 0;
      }

      console.log("tab page index: " + index)
      $scope.currentGameIndex = index;
      gameManager.selectGame(index);

      // display game page
      var game = $scope.gamesGameManager[index].game.toLowerCase();
      $state.go('regular.games.' + game);
    };

    $scope.onProgress = function(game) {
      if (game.gamePM && (
          game.gamePM.status == $scope.gameStatus.INSTALLING
          || game.gamePM.status == $scope.gameStatus.REPAIRING
          || game.gamePM.status == $scope.gameStatus.PATCHING)) {
        return true;
      } else {
        return false;
      }
    };

    $scope.getWallet = function() {
     $http({
        method: 'GET',
        url: $scope.amsBaseURL + '/users/account/get_emp_wallet_balance?access_token=' + oauthManager.accessToken,
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        }
      }).then(
        function(response) {
          $scope.emp_wallet_balance = response.data.emp_wallet_balance;
        },
        function(reason) {
        }
      );
    };

    $scope.getUserName = function() {
      if ($scope.user) {
        return $scope.user.email;
      }
      return null;
    };

    $scope.initialize();
  }
]);
