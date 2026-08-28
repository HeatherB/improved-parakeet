launcherApp.controller('redeemCtrl', ['$scope', '$state', 'oauthManager', 'systemManager', 'ngDialog', function ($scope, $state, oauthManager, systemManager, ngDialog) {

  var baseURL = app.getConfig("APIBaseURL", "");

  $scope.errorMessages = [];
  $scope.promotionTitle = null;
  $scope.skus = [];

  $scope.redeemCode = function(redeem_code) {
    oauthManager.sendRequest({
      method: 'POST',
      url: baseURL + '/launcher_v2/redeem_code',
      dataType: 'json',
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        game_code: redeem_code,
        pref_account: null
      }
    }).then(

      function(response) {
        console.log('redeem ends up with: ' + response.data.success);
        console.dir(response);

        if (response.data.success) {
          if (response.data.hasOwnProperty('info')) {
            var info = response.data.info;
            $scope.promotionTitle = info.custom.promotion.promotion_description;
            var skus = info.custom.skus;
            for (i=0;i<skus.length;i++) {
              $scope.skus.push(skus[i].description);
            }
          }
          $scope.tryRedeemSuccess();
        } else {
          if (response.data.hasOwnProperty('info')) {
            var table = {
              'invalid code': 'Code is not valid.',
              'not eligible to redeem this code': "It's not eligible to redeem this code",
              'not eligible to redeem internal code': "It's not eligible to redeem internal code",
              'redemption limit overflow': 'Redemption limit exceed limit.'
            };
            $scope.errorMessages = [];
            for (i=0;i<response.data.info.length;i++) {
              console.log('error: ' + response.data.info[i]);
              var message = table[response.data.info[i]];
              console.log('message: ' + message);
              $scope.errorMessages.push(message);
            }
          }

          $scope.tryRedeemFail();
        }
      },
      function(response) {
        console.log('redeem failed');
        console.dir(response);

        if (response.data.hasOwnProperty('error_code'))
          error_code = response.data.error_code;
        else
          error_code = 'H' + response.status;

        $scope.alertErrorRetry(error_code);
      }
      // function(response) {

      //   if(response.data.error == true) {
      //     $scope.tryRedeemFail();
      //   } else {
      //     $scope.tryRedeemSuccess();
      //   }
      // },
      // function(response) {
      //   $scope.tryRedeemFail();
      // }
    );
  };

  // popup replacer
  $scope.tryRedeemFail = function() {
    var dialog = ngDialog.open({
      template: 'views/common.redeem_fail.html',
      controller: 'redeemCtrl',
      data: {
        errorMessages: $scope.errorMessages
      }
    });
    ngDialog.close(0);

    var fnRedeem = $scope.__proto__.$parent.onRedeemFailed;
    if (typeof fnRedeem == 'function') {
      fnRedeem();
    }
  };

  $scope.tryRedeemSuccess = function() {
    var dialog = ngDialog.open({
      template: 'views/common.redeem_success.html',
      controller: 'redeemCtrl',
      data: {
        promotion: $scope.promotionTitle,
        skus: $scope.skus
      }
    });
    ngDialog.close(0);

    var fnRedeem = $scope.__proto__.$parent.onRedeemSucceeded;
    if (typeof fnRedeem == 'function') {
      fnRedeem();
    }
  };

  $scope.retryRedeem = function() {
    var dialog = ngDialog.open({
      template: 'views/common.redeem.html',
      controller: 'redeemCtrl'
    });
    ngDialog.close(0);
  };

  $scope.openWebNoSession = function(url, target) {
    systemManager.openExternalBrowser(url, target);
  };
}]);