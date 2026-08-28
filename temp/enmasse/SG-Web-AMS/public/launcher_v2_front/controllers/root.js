launcherApp.controller('rootCtrl', ['$scope', 'systemManager', 'ngDialog', 'loginManager',
  function ($scope, systemManager, ngDialog, loginManager) {

    // keep 'instantResize' for page transitions that start from invisible page
    $scope.instantResize = false;

    //
    // set instantResize
    //
    $scope.setInstantResize = function(value) {
      $scope.instantResize = value;
    };

    //
    // set width and height
    //
    $scope.setSize = function(width, height) {
      systemManager.setWindowSize(width, height, $scope.instantResize);

      // reset instantResize
      // there must be better solution...
      $scope.instantResize = false;
    };

    //
    // update angular UI
    //
    $scope.updateUI = function() {
      // safe apply
      if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
        $scope.$apply();
      }
    };

    //
    // display error code and exit
    //
    $scope.alertErrorExit = function(code) {

      var dialog = ngDialog.open({
        template: 'views/common.error_exit.html',
        data: {
          code: code
        }
      });

      dialog.closePromise.then(function () {
        app.closeAll();
      });
    };

    //
    // display error code and say 'retry'
    //
    $scope.alertErrorRetry = function(code) {
      var dialog = ngDialog.open({
        template: 'views/common.error_retry.html',
        data: {
          code: code
        }
      });
    };

    //
    // display 'bad user' message and exit
    //
    $scope.alertBadUser = function(error_msg) {
      var dialog = ngDialog.open({
        template: 'views/common.bad_user.html',
        controller: 'rootCtrl',
        data: {
          error_msg: error_msg
        }
      });
      console.log('$scope.alertBadUser', error_msg);
      dialog.closePromise.then(function () {
        app.closeAll();
      });
    };

    //
    // display 'bad user' message and exit
    //
    $scope.alertBadUserNoExit = function(error_msg) {
      var dialog = ngDialog.open({
        template: 'views/common.bad_user_no_exit.html',
        controller: 'rootCtrl',
        data: {
          error_msg: error_msg
        }
      });
    };

    //
    // display 'insufficient space' message and exit
    //
    $scope.alertInsufficientSpace = function() {
      // insufficient space
      var dialog = ngDialog.open({
        template: 'views/common.insufficient_space.html'
      });
      dialog.closePromise.then(function () {
        console.log('closing app for insufficient space.');
        app.closeAll();
      });
    };

    //
    // user exit confirmation
    //
    $scope.alertConfirmExit = function() {
      ngDialog.openConfirm({
        template: 'views/common.confirm_exit.html',
        plain: false
      }).then(
        function() { console.log('closing app.'); app.closeAll(); },
        function() { console.log('canceled.'); }
      );
    };

    //
    // user log out confirmation
    //
    $scope.alertConfirmLogout = function() {
      ngDialog.openConfirm({
        template: 'views/common.confirm_logout.html',
        plain: false
      }).then(
        function() { console.log('restart app.'); loginManager.onLogout(); app.setRestart(true); },
        function() { console.log('canceled.'); }
      );
    };


    //
    // user dragging
    //
    $scope.dragMe = function() {
      skinWindow.beginMove();
    };

    // allow window minification
    $scope.minimize = function() {
      skinWindow.minimize();
    };

    $scope.openWeb = function(url, target) {
      systemManager.openExternalBrowserWithSession(url, target);
    };

    $scope.openWebNoSession = function(url, target) {
      systemManager.openExternalBrowser(url, target);
    };

    $scope.openBrandedStore = function(target) {
      url = "https://store.enmasse.com/enmasse/emp";
      systemManager.openExternalBrowser(url, target);
    };

    $scope.openBrandedSignup = function(passed_url, target) {
      url = "https://account.enmasse.com/" + passed_url + "/sign-up";
      systemManager.openExternalBrowser(url, target);
    };

    $scope.emailFAQlink = function(passed_url, target) {
      url = "http://support.enmasse.com/tera/i-didn-t-receive-my-account-verification-email";
      systemManager.openExternalBrowser(url, target);
    };

    $scope.getVersion = function() {
      $scope.version = systemManager.getVersion();
    };

    $scope.openItemClaimFAQ = function(target) {
      console.log('does not appear to work');
      url = "https://support.enmasse.com/tera/how-do-i-claim-my-premium-services-and-purchased-promotional-items";
      systemManager.openExternalBrowser(url, target);
    };

    $scope.close = function() {
      $scope.alertConfirmExit();
    };

    $scope.restart = function() {
      $scope.alertConfirmLogout();
    }
  }
]);