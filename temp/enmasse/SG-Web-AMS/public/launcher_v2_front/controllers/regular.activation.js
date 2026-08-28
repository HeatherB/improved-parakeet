launcherApp.controller('regularActivationCtrl', ['$scope', '$state', 'steamManager', 'systemManager', 'loginManager', 'patchManager', 'ngDialog',
  function ($scope, $state, steamManager, systemManager, loginManager, patchManager, ngDialog) {

    $scope.messageDisplay = '';
    $scope.code = '';
    $scope.activationResolved = false;
    $scope.requesting = false;

    $scope.codeSubmit = function() {

      if ($scope.code == null || $scope.code == '') {
        $scope.messageDisplayError = 'Please enter activation code.';
        return;
      }

      console.log('entered.');

      loginManager.verifyActivationCode($scope.code, $scope.onMatched, $scope.onMismatched, $scope.onResendNeeded, $scope.error);

      //
      $scope.requesting = true;
    };

    $scope.resend = function() {
      console.log('resend');

      loginManager.sendActivationCode().then(
        function() {
          $scope.messageDisplay = 'Your activation code has been resent.';

          //
          $scope.requesting = false;
        },
        function(error_code) {
          $scope.error(error_code);

          //
          $scope.requesting = false;
        }
      );

      //
      $scope.requesting = true;
    };

    $scope.check = function() {
      console.log('check');
      $scope._checkUserStatus();
    };

    $scope._checkUserStatus = function() {
      loginManager.checkUserStatus(
        $scope.good,
        $scope.bad,
        $scope.activation,
        $scope.qna,
        $scope.armor,
        $scope.error
      );

      //
      $scope.requesting = true;
    };

   /* $scope.getUserInformation = function() {
      console.log('do we use this at all?');
      loginManager.getCurrentUser().then(
        function(userInfo) {
          console.log('do we use this at all? with return');
          $scope.email = userInfo.email;
        },
        function() {
          // failed to show information
          // but still can proceed
        }
      );
    };*/


    // handler
    $scope.good = function() {
      // done
      console.log('user status is good.');
      loginManager.onLogin();
      $state.go('^.games');

      //
      $scope.requesting = false;
    };

    $scope.bad = function(message) {
      // user is not able to play
      $scope.alertBadUser(message);
    };

    $scope.activation = function() {

      if ($scope.activationResolved) {
        // this is loop situation --> fail stop
        console.log('closing app for loop condition (activation).');
        $scope.alertErrorExit('C0013');
      } else {
        $scope.messageDisplay = 'Please check activation is completed.';
      }

      //
      $scope.requesting = false;
    };

    $scope.qna = function() {
      console.log('secret QnA is needed.');
      $state.go('^.qna');
    };

    $scope.armor = function() {
      console.log('account armor is needed.');
      $state.go('^.armor');
    };

    $scope.error = function(code) {
      console.log('error. code: from activation ' + code);
      $scope.alertErrorRetry(code);

      //
      $scope.requesting = false;
    };

    $scope.onMatched = function() {
      console.log('activation code succeeded.');
      $scope._checkUserStatus();

      //
      $scope.requesting = false;
    };

    $scope.onMismatched = function() {
      console.log('activation code mismatched.');
      $scope.messageDisplayError = 'Activation code is not correct. Please check it again, or resend it.';

      //
      $scope.requesting = false;
    };

    $scope.onResendNeeded = function() {
      console.log('activation code need to be resended.');
      $scope.messageDisplayError = 'Activation code has been expired. Please resend it.';

      //
      $scope.requesting = false;
    }

    $scope.goSignIn = function() {
      $state.go('^.signin');
    };
    //$scope.getUserInformation();
  }
]);