launcherApp.controller('regularSignInCtrl', ['$scope', "$http", "$state", "$stateParams", "oauthManager", "loginManager", 'systemManager', "gameManager", "patchManager", "ngDialog",
  function ($scope, $http, $state, $stateParams, oauthManager, loginManager, systemManager, gameManager, patchManager, ngDialog) {

    //
    // controller members
    $scope.FBID = null;
    $scope.FBAccessToken = null;
    $scope.FBEmail = null;
    $scope.FBPictureURL = null;
    $scope.FBLogined = false;
    $scope.email = "";
    $scope.password = "";
    $scope.displayMessage = null;
    $scope.signInProgress = false;
    $scope.doingAutoSignIn = false;
    $scope.emailWarning = false;
    $scope.passwordWarning = false;
    $scope.show = true;

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
      $scope.updateVisual();
      if ($scope.email == "" || $scope.password == "") {
        $scope.displayMessage = 'Enter your email and/or password';
        $scope.updateUI();
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
    // initialization
    $scope.initialize = function() {
      //
      // need to check faceook status
      FB.getLoginStatus(function(response) {onStatusChange(response)});

      //
      // retrieve rememberMe setting
      $scope.getRememberMe();

      //
      // check if this windows shows up because user logout previously
      var logout = loginManager.checkLogout();

      //
      //
      oauthManager.enableAutoLogin($scope.saveLogin, $(blackbox).val());

      //
      //
      if ($scope.saveLogin && !logout) {

        // remember auto signin is on pregress
        $scope.doingAutoSignIn = true;

        // request refresh token using stored encrypted piece
        $scope.signInProgress = true;
        oauthManager.fetchRefreshToken().then(
          function() {
            // login attempt
            loginManager.signInAuto(
              $scope.onGoodUser,
              $scope.onBadUser,
              $scope.onActivationNeeded,
              $scope.onSecretQnANeeded,
              $scope.onAccountArmorNeeded,
              $scope.onGenericError,
              $scope.onNotAuthorized);
          },
          function(code) {
            $scope.onNotAuthorized();
            console.log('error in getting decrypted refresh token: ' + code);
          }
        )
      }
    };

    //
    // when user check/uncheck remember me
    $scope.setRememberMe = function() {
      window.settings.set(systemManager.getSettingKey('rememberMe'), $scope.saveLogin);
      oauthManager.enableAutoLogin($scope.saveLogin, null);
    };

    $scope.getRememberMe = function() {
      $scope.saveLogin = window.settings.get(systemManager.getSettingKey('rememberMe'));
    };

    //
    // user qualified
    $scope.onGoodUser = function() {
      console.log('login succeeded.');
      loginManager.onLogin();
      $scope.show = false;
      $state.go('^.games');
    };

    //
    // login handlers
    $scope.onBadUser = function(error_msg) {
      // user is not able to play
      // $scope.alertBadUser(error_msg);
      $scope.signInProgress = false;
      $scope.doingAutoSignIn = false;
      $scope.alertBadUserNoExit(error_msg);
    };

    $scope.onActivationNeeded = function() {
      $state.go('^.activation');
    };

    $scope.onSecretQnANeeded = function() {
      $state.go('^.qna');
    };

    $scope.onAccountArmorNeeded = function() {
      $state.go('^.armor');
    };

    $scope.onGenericError = function(code) {
      $scope.signInProgress = false;
      $scope.doingAutoSignIn = false;
      $scope.alertErrorRetry(code);
    };

    $scope.onNotAuthorized = function() {
      $scope.signInProgress = false;

      if ($scope.doingAutoSignIn == true) {
        $scope.displayMessage = 'Could not login with stored session information';
        $scope.updateUI();
      } else {
        $scope.displayMessage = 'Email or password does not match';
        $scope.updateUI();
        $scope.emailWarning = true;
        $scope.passwordWarning = true;
      }

      $scope.doingAutoSignIn = false;
    };

    $scope.goSignUp = function() {
      $state.go('^.signup');
    };

    $scope.updateVisual = function() {
      if ($scope.email == "")
        $scope.emailWarning = true;

      if ($scope.password == "")
        $scope.passwordWarning = true;

      $scope.updateUI();
    };

    $scope.onInputChange = function() {
      // clear up all warning and messages
      $scope.emailWarning = false;
      $scope.passwordWarning = false;
      $scope.displayMessage = '';

      $scope.updateUI();
    };

    $scope.showMySelf = function() {
      return $scope.show;
    }

    // set instant resize
    $scope.setInstantResize($stateParams.instantResize);

    // let's start
    $scope.initialize();
  }]);
