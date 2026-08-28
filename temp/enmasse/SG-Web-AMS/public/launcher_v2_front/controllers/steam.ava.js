launcherApp.controller('steamAVACtrl', ['$scope', "$state", "$stateParams", "patchManager", "steamManager", "gameManager", 'systemManager', 'steamManager', 'loginManager', "ngDialog",
  function ($scope, $state, $stateParams, patchManager, steamManager, gameManager, systemManager, steamManager, loginManager, ngDialog) {

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
      patchManager.setExtraCommandOption('ava', 'language', $scope.chosenLang);
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






//     //
//     //
//     $scope.start = function() {

//       // set instant resize value from state params
//       $scope.setInstantResize($stateParams.instantResize);

//       // get this game
//       var steamAppID = steamManager.getSteamAppID();
//       $scope.game = patchManager.getGameFromSteam(steamAppID);

//       // get currnt game to set options from our api
//       //$scope.currentGame = gameManager.currentGame();

//       // get game status array
//       $scope.gameStatus = patchManager.getGameStatusEnum();

//       // get interface for game
//       $scope.getGames();

//       // get action message
//       $scope.getActionMessage();

//       // register handlers
//       patchManager.setUpdateStatusHandler('steamPatchCtrl', function(id, oldState, newState, progress) {

//         //console.log('on patch controller: id:{0} oldState:{1} newState:{2} breaking:{3} gameStarted:{4}'.format(id, oldState, newState, $scope.breaking, $scope.gameStarted));
//         if ($scope.game.id != id) return;

//         if (oldState != newState && !$scope.breaking) {
//           $scope.doNext();          // status has changed
//           $scope.getActionMessage();
//         }

//         if (typeof progress != 'undefined' && progress != null) {
//           $scope.progress = progress;
//           $scope.statusMessage = $scope.game.statusMessage;
//           $scope.updateUI();
//         }
//       });

//       patchManager.setErrorReportHandler('steamPatchCtrl', function(info) {

//         if (info.errorCode == 1 || info.errorCode == 2) {
//           // user cancel in most cases
//           $scope.breaking = true;

//         } else if (info.errorCode == 3) {
//           $scope.breaking = true;
//           $scope.alertErrorExit('C0009');
//         } else if (info.errorCode == 4) {
//           $scope.breaking = true;
//           $scope.alertInsufficientSpace();
//         } else if (info.errorCode == 5) {
//           $scope.breaking = true;
//           $scope.alertErrorExit('C0010');
//         } else if (info.errorCode == 6) {
//           $scope.breaking = true;
//           $scope.alertErrorExit('C0011');
//         } else if (info.errorCode == 7) {
//           $scope.breaking = true;
//           $scope.alertErrorExit('C0012');
//         } else if (info.errorCode == 8) {
//           $scope.breaking = true;
//           $scope.alertBadUser();
//         } else if (info.errorCode == 9) {
//           $scope.breaking = true;
//           $scope.alertErrorRetry(info.code);
//         }
//       });

//       // get user information
//       loginManager.getCurrentUser().then(
//         function(userInfo) {
//           console.dir(userInfo);
//           $scope.email = userInfo.email;
//         },
//         function(code) {
//           // no need to stop here
//           $scope.alertErrorRetry(code);
//         }
//       );
//     };

//     $scope.doNext = function() {
//       // do install, patch, and run based on current status
//       if ($scope.game.status == $scope.gameStatus.PATCHABLE && !$scope.gameStarted) {
//         patchManager.patch($scope.game.id);
//         $scope.patchStarted = true;
//         console.log('game shows as patchable');
//       } else if ($scope.game.status == $scope.gameStatus.NOT_INSTALLED && !$scope.gameStarted) {
//         patchManager.install($scope.game.id);
//         $scope.patchStarted = true;
//         console.log('game shows as not installed');
//       } else if ($scope.game.status == $scope.gameStatus.READY_TO_RUN && !$scope.gameStarted) {
//         //patchManager.play($scope.game.id);
//         //$scope.gameStarted = true;
//         console.log('game shows as ready');
//       } else if ($scope.game.status == $scope.gameStatus.READY_TO_RUN && $scope.gameStarted) {
//         // shut down launcher in 5 secs.
//         setTimeout(function() {
//           app.closeAll();
//         }, 100);
//       }
//     };

//     $scope.inProgress = function() {
//       return ($scope.game.status == $scope.gameStatus.PATCHING || $scope.game.status == $scope.gameStatus.INSTALLING);
//     };

//     $scope.readyToRun = function() {
//       return ($scope.game.status == $scope.gameStatus.READY_TO_RUN);
//     };

//     $scope.run = function() {
//       if ($scope.game.status == $scope.gameStatus.READY_TO_RUN) {
//         patchManager.play($scope.game.id);
//         $scope.gameStarted = true;

//         // let steamManager know now it's starting
//         steamManager.onGameStart();

//         // check and fulfil login event
//         // has moved to loginManager
//         // loginManager.applyLoginPromotion(
//         //   $scope.game.id,
//         //   function(promotions) {
//         //     console.log('login promotion succeeded.');
//         //     console.dir(promotions);
//         //   },
//         //   function() {
//         //     console.log('no login promotion available');
//         //   },
//         //   function(code) {
//         //     console.log('error in checking login promotion: ' + code);
//         //   }
//         // );
//       }
//     };

//     $scope.getActionMessage = function() {
//       var translator = {
//         'unknown'           : 'UNKNOWN',
//         'not installed'     : 'INSTALL',
//         'installing'        : 'INSTALLING',
//         'patch available'   : 'PATCH',
//         'patching'          : 'PATCHING',
//         'paused'            : 'PAUSED',
//         'ready to run'      : 'PLAY',
//         'running'           : 'RUNNING',
//         'repairing'         : 'REPAIRING'
//       };

//       $scope.action = translator[$scope.game.status];
//     };

//     $scope.close = function() {
//       $scope.alertConfirmExit();

//       // check if patching is in progress
//       // if so, pause it and close
//       // if ($scope.game.status == $scope.gameStatus.PATCHING
//       //   || $scope.game.status == $scope.gameStatus.INSTALLING) {
//       //   patchManager.pause($scope.game.id);

//       //   // display message
//       //   $scope.messageDisplay = 'Stopping...';

//       //   setTimeout(function() {
//       //     app.closeAll();
//       //   }, 5000);
//       // } else {
//       //   $scope.alertConfirmExit();
//       // }
//     };

//     $scope.start();
// }]);