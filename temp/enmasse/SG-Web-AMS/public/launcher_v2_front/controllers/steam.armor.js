launcherApp.controller('steamArmorCtrl', ['$scope', '$state', 'steamManager', 'systemManager', 'loginManager', 'patchManager', 'ngDialog',
  function ($scope, $state, steamManager, systemManager, loginManager, patchManager, ngDialog) {

    $scope.messageDisplay = '';
    $scope.code = '';
    $scope.remember = true;
    $scope.requesting = false;

    $scope.codeSubmit = function() {
      console.log('code entered.');

      if ($scope.code == null || $scope.code == '') {
        $scope.messageDisplay = 'Please enter account armor code.';
        return;
      }

      loginManager.verifyAccountArmorCode($scope.code, $scope.remember, $scope.onMatched, $scope.onMismatched, $scope.error_retry);

      //
      $scope.requesting = true;
    };

    $scope.resend = function() {
      console.log('resend');
      loginManager.sendAccountArmorCode($scope.onCodeSent, $scope.ticketAbsent, $scope.error_retry);

      $scope.requesting = true;
      $scope.resend_sent = "Account Armor code resent, Check your email!"
    };

    $scope._checkUserStatus = function() {
      loginManager.checkUserStatus(
        $scope.good,
        $scope.bad,
        $scope.activation,
        $scope.qna,
        $scope.armor,
        $scope.error_exit
      );

      //
      $scope.requesting = true;
    };

    // handler
    $scope.good = function() {
      // done
      console.log('user status is good.');
      //var gameName = patchManager.getGameFromSteam(steamManager.getSteamAppID()).name.toLowerCase();
      $state.go('^.games');
      //$state.go('^.{0}'.format(gameName));
      //$state.go('^.patch');

      //
      $scope.requesting = false;
    };

    $scope.bad = function(message) {
      // user is not able to play
      console.log('user status is bad.');
      $scope.alertBadUser(message);
    };

    $scope.activation = function() {
      // this is loop situation, cause user must have done before
      console.log('activation needed.');
      $scope.error_exit();
    };

    $scope.qna = function() {
      // this is loop situation, cause user must have done before
      console.log('secret QnA needed.');
      $scope.error_exit();
    };

    $scope.armor = function() {
      // this is loop situation, cause user must have done before
      console.log('account armor needed.');
      $scope.error_exit();
    };

    $scope.error_retry = function(code) {
      console.log('error. code: is it the retry ' + code);
      //$scope.alertErrorRetry(code);
      $scope.submitarmor_error = code;

      //
      $scope.requesting = false;
    };

    $scope.error_exit = function(code) {
      console.log('account association error. code: ' + code);
      $scope.alertErrorExit(code);

      //
      $scope.requesting = false;
    };

    $scope.onMatched = function() {
      console.log('account armor code succeeded.');
      $scope._checkUserStatus();
    };

    $scope.onMismatched = function() {
      console.log('account armor code mismatched.');
      $scope.messageDisplay = 'Account armor code is not correct. Please check it again, or resend it.';

      //
      $scope.requesting = false;
    };

    $scope.onCodeSent = function() {
      //
      console.log('account armor code has been sent.');
      $scope.messageDisplay = 'New account armor code has been sent.';

      //
      $scope.requesting = false;
    };

    $scope.emailFAQlink = function(passed_url, target) {
      url = "http://support.enmasse.com/tera/i-didn-t-receive-my-account-verification-email";
      systemManager.openExternalBrowser(url, target);
    };

    $scope.onTicketAbsent = function() {
      //
      console.log("user doesn't have account armor ticket");
      $scope.messageDisplay = "You don't have valid account armor ticket.";

      //
      $scope.requesting = false;
    };
  }
]);