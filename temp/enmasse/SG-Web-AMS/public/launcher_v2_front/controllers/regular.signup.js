launcherApp.controller('regularSignUpCtrl', ['$scope', "$http", "$state", "steamManager", "loginManager", 'systemManager', "gameManager", "patchManager", "ngDialog",
  function ($scope, $http, $state, steamManager, loginManager, systemManager, gameManager, patchManager, ngDialog) {

    $scope.email = '';
    $scope.password = '';
    $scope.messageDisplay = '';
    $scope.minLength = false;
    $scope.maxLength = false;
    $scope.format = false;
    $scope.includeEmail = false;
    $scope.requesting = false;

    $scope.signUp = function() {
      console.log('step into signup');

      var error = false;
      if ($scope.email == null || $scope.email == '') {
        $scope.messageDisplayEmail = 'Email address cannot be blank.';
        error = true;
      } else {
        $scope.messageDisplayEmail = '';
      }

      if ($scope.password == null || $scope.password == '') {
        $scope.messageDisplayPassword = 'Password cannot be blank.';
        error = true;
      } else {
        $scope.messageDisplayPassword = '';
      }

      $scope.updateUI();

      // validation
      if (!$scope.passwordValid() || error) {
        $scope.updateUI();
        return;
      }

      // clean previous message
      $scope.messageDisplay = '';
      $scope.messageDisplayPassword = '';
      $scope.messageDisplayEmail = '';

      // do it
      loginManager.signUp(
        $scope.email,
        $scope.password,
        false,    // is steam?
        null,     // reference id
        null,     // game name
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
      loginManager.onLogin();
      $state.go('^.games');
    };

    $scope.onBadUser = function(message) {
      // user is not able to play
      console.log('user status is bad.');
      //$scope.alertBadUser(message);
      $scope.requesting = false;
      $scope.alertBadUserNoExit(message);
    };

    $scope.onActivationNeeded = function() {
      console.log('activation needed.');
      $state.go('^.activation');
    };

    $scope.onSecretQnANeeded = function() {
      console.log('secret QnA is needed.');
      $scope.go('^.qna');
    };

    $scope.onAccountArmorNeeded = function() {
      console.log('account armor is needed.');
      $scope.go('^.armor');
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