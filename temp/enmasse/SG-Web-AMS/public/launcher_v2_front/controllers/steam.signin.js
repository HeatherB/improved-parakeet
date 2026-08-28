launcherApp.controller('steamSignInCtrl', ['$scope', "$http", "$state", "steamManager", "loginManager", 'systemManager', "gameManager", "patchManager", "ngDialog",
  function ($scope, $http, $state, steamManager, loginManager, systemManager, gameManager, patchManager, ngDialog) {

    //
    // controller members
    $scope.FBID = null;
    $scope.FBAccessToken = null;
    $scope.FBEmail = null;
    $scope.FBPictureURL = null;
    $scope.FBLogined = false;
    $scope.email = null;
    $scope.password = null;
    $scope.displayMessage = null;
    $scope.signInProgress = false;

    //
    // Facebook login status change callback
    function onStatusChange(response) {

      if (response.status === 'connected') {
        // get id, access token
        $scope.FBID = response.authResponse.userID;
        $scope.FBAccessToken = response.authResponse.accessToken;

        // get picture and profile
        $scope.FBGetMe();

        // set facebook logined
        $scope.FBLogined = true;
      } else {
        // otherwise user has no facebook login
        $scope.FBLogined = false;
      }

      // apply status change to UI
      $scope.updateUI();
    }

    //
    // let this function called when user sign-in
    function checkLoginState() {
      FB.getLoginStatus(function(response) {
        onStatusChange(response);
      });
    }

    //
    // when user press Facebook button (login to Facebook)
    $scope.FBLogin = function() {
      var targetWidth = 500;
      var targetHeight = 390;

      var screenWidth = window.screen.width;
      var screenHeight = window.screen.height;

      var top = Math.floor( (screenHeight - targetHeight) / 2 );
      var left = Math.floor( (screenWidth - targetWidth) / 2 );

      window._open = window.open; // saving original function
      window.open = function(url,name,params) {

        var w = window._open(url,name, params+",left={0},top={1},width={2},height={3}".format(left, top, targetWidth, targetHeight));

        window.open = window._open;

        return w;
      }

      FB.login(onStatusChange, {scope:'email'});
    };

    //
    // get profile picture and email address
    $scope.FBGetMe = function() {

      FB.api('/me?fields=id,email,birthday', function(response) {
        console.dir(response);
        $scope.FBEmail = response.email;

        // now we have vaild email, enable login button
        $scope.updateUI();
      });

      FB.api('/me/picture?type=normal', function(response) {
        $scope.FBPictureURL = response.data.url;

        // now we have valid picture, show it
        $scope.updateUI();
      });
    };

    $scope.signInWithFB = function() {
      // login attempt
      $scope.signInProgress = true;
      loginManager.signInFB(
        $scope.FBID,
        $scope.FBAccessToken,
        $scope.FBEmail,
        null,   /* birthday: it requires additional step from user */
        $scope.onGoodUser,
        $scope.onBadUser,
        $scope.onActivationNeeded,
        $scope.onSecretQnANeeded,
        $scope.onAccountArmorNeeded,
        $scope.onGenericError
      );
    };

    //
    // when user press sign-in button
    $scope.signIn = function() {
      // check email and password
      if ($scope.email == null || $scope.password == null) {
        $scope.displayMessage = 'Enter your email and/or password';
        return;
      }

      // login attempt
      $scope.signInProgress = true;
      loginManager.signIn(
        $scope.email,
        $scope.password,
        $scope.onGoodUser,
        $scope.onBadUser,
        $scope.onActivationNeeded,
        $scope.onSecretQnANeeded,
        $scope.onAccountArmorNeeded,
        $scope.onGenericError,
        $scope.onNotAuthorized);
    };

    //
    //
    // apply changes to UI
    $scope.updateUI = function() {
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
        $scope.$apply();
    };

    //
    // need to check faceook status
    FB.getLoginStatus(function(response) {onStatusChange(response)});

    //
    // user qualified
    $scope.onGoodUser = function() {
      console.log('login succeeded.');

      // associate this EME account with current steam account
      //var gameName = patchManager.getGameFromSteam(steamManager.getSteamAppID()).name.toLowerCase();
      $scope.associateAccount('^.games');
      //$scope.associateAccount('^.{0}'.format(gameName));
      //$state.go('^.{0}'.format(gameName));
    };

    //
    // login handlers
    $scope.onBadUser = function(message) {
      // user is not able to play
      console.log('user status is bad');
      $scope.alertBadUser(message);
    };

    $scope.onActivationNeeded = function() {
      $scope.associateAccount('^.activation');
    };

    $scope.onSecretQnANeeded = function() {
      $scope.associateAccount('^.qna');
    };

    $scope.onAccountArmorNeeded = function() {
      $scope.associateAccount('^.armor');
    };

    $scope.onGenericError = function(code) {
      $scope.signInProgress = false;
      $scope.alertErrorRetry(code);
    };

    $scope.onNotAuthorized = function() {
      $scope.signInProgress = false;
      $scope.displayMessage = 'Email or password does not match';
      $scope.updateUI();
    };

    $scope.associateAccount = function(nextView) {
      var appID = steamManager.getSteamAppID();
      var authTicket = steamManager.getSteamAuthTicket();
      var userID = steamManager.getSteamUserID();
      loginManager.associateSteam(appID, authTicket, userID).then(
        function() {
          console.log('association succeeded.');
          $state.go(nextView);
        },
        function(error_code) {
          console.log('assiciation failed: code: ' + error_code);

          $scope.alertErrorExit(code);
        }
      );
    };

    $scope.goSignUp = function() {
      $state.go('^.signup');
    };
  }]);
