launcherApp.controller('steamMainCtrl', ['$scope', "$http", "$q", "$state", "oauthManager", "steamManager", 'systemManager', 'patchManager', 'gameManager', 'loginManager', 'ngDialog',
  function ($scope, $http, $q, $state, oauthManager, steamManager, systemManager, patchManager, gameManager, loginManager, ngDialog) {

    $scope.messageDisplay = '',

    //
    // initialize
    $scope.initialize = function(width, height) {

      // set width and height
      systemManager.setWindowSize(width, height);

      // set background
      //document.body.style.background = '#ffffff';
      //$scope.pageLoaded = true;
    };

    //
    // get enmasse user from steam user id
    $scope.getEMEUser = function() {

      // display message
      $scope.messageDisplay = "Fetching En Masse Account.";

      // trying to get oauth token
      var steamUserID = steamManager.getSteamUserID();
      oauthManager.getAccessTokenExtern(
        steamUserID,
        'steam',
        $scope.onTokenGet,
        $scope.onTokenMismatch,
        $scope.error
      );

      $scope.sharedEmail = steamUserID;

    };

    //
    // handlers
    $scope.onTokenGet = function() {

      // we found enmasse account. Update game if needed
      console.log('EME account matched.');

      // check this user is good
      $scope._checkUserStatus();
    };

    $scope.onTokenMismatch = function() {
      console.log("Matching EME account not found.")
      $state.go('.account_setup_guide', {instantResize: true});
    };


    //
    // close button
    $scope.close = function() {
      $scope.alertConfirmExit();
    };

    //
    // invite user to login - first step
    //$state.go('.signin');
    // get Enmasse user from steam-side information
    $scope.getEMEUser();

    // check if user is good
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

    // handler
    $scope.good = function() {
      // done
      console.log('user status is good.');
      //loginManager.getWallet();
      //loginManager.getCurrentUser();
      //$scope.updateUI();

      //var gameName = patchManager.getGameFromSteam(steamManager.getSteamAppID()).name.toLowerCase();
      $state.go('.games', {instantResize: true});
      //$state.go('.{0}'.format(gameName), {instantResize: true});
      //$state.go('.patch');

      //
      $scope.requesting = false;
    };

    $scope.bad = function(message) {
      // user is not able to play
      console.log('user status is bad');
      $scope.alertBadUser(message);
    };

    $scope.activation = function() {
      console.log('activation needed.');
      $state.go('.security_measure_guide', {goNext: '^.activation', instantResize: true});
    };

    $scope.qna = function() {
      console.log('secret QnA is needed.');
      $state.go('.security_measure_guide', {goNext: '^.qna', instantResize: true});
    };

    $scope.armor = function() {
      console.log('account armor is needed.');
      $state.go('.security_measure_guide', {goNext: '^.armor', instantResize: true});
    };

    $scope.error = function(code) {
      console.log('error. code: from main ' + code);
      $scope.alertErrorExit(code);

      //
      $scope.requesting = false;
    };


  }]);

