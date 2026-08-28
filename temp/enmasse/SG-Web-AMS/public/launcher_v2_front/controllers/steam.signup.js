launcherApp.controller('steamSignUpCtrl', ['$scope', "$http", "$state", "steamManager", "loginManager", 'systemManager', "gameManager", "patchManager", "ngDialog",
  function ($scope, $http, $state, steamManager, loginManager, systemManager, gameManager, patchManager, ngDialog) {

    // add facebook
    //
    // controller members
    $scope.FBID = null;
    $scope.FBAccessToken = null;
    $scope.FBEmail = null;
    $scope.FBPictureURL = null;
    $scope.FBLogined = false;
    $scope.email = '';
    $scope.password = '';
    $scope.displayMessage = null;
    $scope.signInProgress = false;
    $scope.logged_in = false;

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
    // when user press Facebook button (login to Facebook)
    $scope.FBLogin = function() {
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

    // end add facebook

    $scope.email = null;
    $scope.password = null;
    $scope.messageDisplay = null;
    $scope.minLength = false;
    $scope.maxLength = false;
    $scope.format = false;
    $scope.includeEmail = false;
    $scope.requesting = false;

    $scope.signUp = function() {
      console.log('step into signup');
      if ($scope.email == null || $scope.email == '')
      {
        $scope.messageDisplayEmail = 'Email address cannot be blank.';
        return;
      }
      if ($scope.password == null || $scope.password == '') {
        $scope.messageDisplayPassword = 'Password cannot be blank.';
        return;
      }

      // validation
      if (!$scope.passwordValid()) return;

      // clean previous message
      $scope.messageDisplay = null;
      $scope.messageDisplayPassword = null;
      $scope.messageDisplayEmail = null;

      // do it
      loginManager.signUp(
        $scope.email,
        $scope.password,
        steamManager.isSteamRunning(),
        null,
        patchManager.getGameFromSteam(steamManager.getSteamAppID()).name,
        $scope.onGoodUser,
        $scope.onBadUser,
        $scope.onActivationNeeded,
        $scope.onSecretQnANeeded,
        $scope.onAccountArmorNeeded,
        $scope.onAccountError,
        $scope.onGenericError
      );

      //
      $scope.requesting = true;
    };

    $scope.goSignIn = function() {
      $state.go('^.signin');
    };

    //
    // handlers BEGINS
    //
    $scope.onGoodUser = function() {
      // done
      console.log('user status is good.');

      // associate this account with current steam account
      $scope.associateAccount('^.patch');
    };

    $scope.onBadUser = function(message) {
      // user is not able to play
      console.log('user status is bad.');
      $scope.alertBadUser(message);
    };

    $scope.onActivationNeeded = function() {
      console.log('activation needed.');
      $scope.associateAccount('^.activation');
      $state.go('^.activation');
    };

    $scope.onSecretQnANeeded = function() {
      console.log('secret QnA is needed.');
      $scope.associateAccount('^.qna');
    };

    $scope.onAccountArmorNeeded = function() {
      console.log('account armor is needed.');
      $scope.associateAccount('^.armor');
    };

    $scope.onAccountError = function(message) {
      $scope.messageDisplay = message;

      //
      $scope.requesting = false;
    };

    $scope.onGenericError = function(code) {
      console.log('error. code: ' + code);
      $scope.alertErrorRetry(code);

      //
      $scope.requesting = false;
    };
    //
    // handlers ENDS
    //

    $scope.associateAccount = function(nextView) {
      var appID = steamManager.getSteamAppID();
      var authTicket = steamManager.getSteamAuthTicket();
      var userID = steamManager.getSteamUserID();
      loginManager.associateSteam(appID, authTicket, userID).then(
        function() {
          console.log('association succeeded.');
          $state.go(nextView);
        },
        function(code) {
          console.log('assiciation failed: ' + code);
          $scope.alertErrorExit(code);
        }
      );
    };

    $scope.openTerms = function() {
      $state.go('^.terms');
    };

    //
    // password validation BEGINS
    //

    $scope.passwordValid = function() {

      var email = $scope.email;
      var pass = $scope.password;
      var valid = true;

      if (pass != null) {

        var passRegex = /(?=.*[A-Z])(?=.*[^A-Z])[\S]+|(?=.*[a-z])(?=.*[^a-z])[\S]+$|(?=.*[0-9])(?=.*[^0-9])[\S]+$/;

        if (pass.length < 8) {
          valid = false;
          $scope.minLength = true;
        } else {
          $scope.minLength = false;
        }

        if (pass.length > 99) {
          valid = false;
          $scope.maxLength = true;
        } else {
          $scope.maxLength = false;
        }

        if (!pass.match(passRegex)) {
          valid = false;
          $scope.format = true;
        } else {
          $scope.format = false;
        }

        if ($scope.passwordContainsEmail(pass, email)) {
          valid = false;
          $scope.includeEmail = true;
        } else {
          $scope.includeEmail = false;
        }
      }

      return valid;
    };

    $scope.passwordContainsEmail = function() {

      var email = $scope.email;
      var password = $scope.password;

      (email == null) && (email = '');
      (password == null) && (password = '');

      if (email == null || $.trim(email) == "") return false;

      var emailArr = email.split("@");
      var emailName = emailArr[0];
      var emailDomain = emailArr[1];
      var pass = password.toLowerCase();

      if (pass.indexOf(emailName.toLowerCase()) >= 0) {
        return true;
      } else if (emailDomain != null) {
        var ix = emailDomain.lastIndexOf(".");
        if (ix <= 0) ix = emailDomain.length;
        if (pass.indexOf(emailDomain.substring(0, ix).toLowerCase()) >= 0) {
          return true;
        }
      }
      return false;
    };
    //
    // password validation ENDS
  }
]);