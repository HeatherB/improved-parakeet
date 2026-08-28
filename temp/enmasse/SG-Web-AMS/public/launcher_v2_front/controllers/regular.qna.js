launcherApp.controller('regularQnACtrl', ['$scope', '$state', 'systemManager', 'loginManager', 'patchManager', 'steamManager', 'ngDialog',
  function($scope, $state, systemManager, loginManager, patchManager, steamManager, ngDialog) {

  $scope.questions = null;
  $scope.selectedQuestion = '0';
  $scope.answer = null;
  $scope.messageDisplay = '';
  $scope.requesting = false;

  $scope.getQuestions = function() {
    loginManager.getSecretQuestions().then(
      function(questions) {
        console.log('received questions.');
        $scope.questions = questions;
        $scope.selectedQuestion = '0';
      },
      $scope.error_exit
    );
  };

  $scope.doAnswer = function() {

    console.log('selected question id:' + $scope.selectedQuestion);

    // check input values
    if ($scope.selectedQuestion == 0) {
      $scope.messageDisplay = 'Please select question.';
      return;
    }
    else if ($scope.answer == null || $scope.answer == '') {
      $scope.messageDisplay = 'Please check your answer.';
      return;
    }

    loginManager.answerQuestion($scope.selectedQuestion, $scope.answer).then(
      function() {
        console.log('answered.');
        $scope._checkUserStatus();
      },
      $scope.error_retry
    );
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
    console.log('user status is bad');
    $scope.alertBadUser(message);
  };

  $scope.activation = function() {
    // this is loop situation, cause user must have done before
    console.log('activation needed.');
    $scope.error_exit('C0004');
  };

  $scope.qna = function() {
    console.log('secret QnA is needed.');
    $scope.error_exit('C0005');
  };

  $scope.armor = function() {
    console.log('account armor is needed.');
    $state.go('^.armor');
  };

  $scope.error_retry = function(code) {
    console.log('error. code: ' + code);
    $scope.alertErrorRetry(code);

    //
    $scope.requesting = false;
  };

  $scope.error_exit = function(code) {
    console.log('error. code: ' + code);
    $scope.alertErrorExit(code);

    //
    $scope.requesting = false;
  };

  $scope.getQuestions();
}]);
