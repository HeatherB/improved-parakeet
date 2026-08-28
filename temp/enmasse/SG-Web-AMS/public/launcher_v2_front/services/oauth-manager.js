launcherApp.factory('oauthManager', ['$http', "$q", function ($http, $q) {

  var oauthManager = {

    apiBaseURL: app.getConfig("APIBaseURL", ""),
    baseURL: app.getConfig("OAuthProvider", ""),
    clientID: app.getConfig("ClientID", ""),
    clientSecret: app.getConfig("ClientSecret", ""),
    accessToken: null,
    _refreshToken: null,
    expireInSec: null,
    timerHandle: null,
    inRetrial: false,
    autoLoginEnabled: false,
    ioBlackBox: null,

    getAccessToken: function(email, password, success, mismatch, error) {

      var me = this;

      $http({
        method: 'POST',
        url: me.baseURL + "token",
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          client_id: me.clientID,
          client_secret: me.clientSecret,
          grant_type: "password",
          username: email,
          password: password,
          scope: "public"
        }
      })
      .then(
        function successCallback(response) {
          me.accessToken = response.data.access_token;
          success();

          // setup refresh
          me._refreshToken = response.data.refresh_token;
          me.expireInSec = response.data.expires_in - 10;
          if (me.expireInSec <= 10) me.expireInSec = 10;
          me.setupRefreshTimer(true);

          // save
          me.saveRefreshToken();
        },
        function errorCallback(response) {

          // check it has data and error properties
          if (response.data.hasOwnProperty('error')) {
            if (response.data.error == 'invalid_grant') {
              mismatch();
            } else {
              error(response.data.error);
            }
          } else {
            // this is either system unavilable or not reachable: 500, 404, ...
            // show with prefix 'H' which stands 'HTTP status code'
            error('H' + response.status);
          }
        }
      );
    },

    getAccessTokenAuto: function(success, mismatch, error) {

      var me = this;

      me.refreshToken()
      .then(
        function successCallback(response) {
          console.log('oauth token: access_token = {0}'.format(me.accessToken));
          success();
        },
        function errorCallback(response) {

          // check it has data and error properties
          if (response.hasOwnProperty('error')) {
            if (response.error == 'invalid_grant') {
              mismatch();
            } else {
              error('S0028');
            }
          } else {
            // this is either system unavilable or not reachable: 500, 404, ...
            // show with prefix 'H' which stands 'HTTP status code'
            error('H' + response.status);
          }
        }
      );
    },

    getAccessTokenExtern: function(userID, provider, success, mismatch, error) {
      var me = this;
    //  var deferred = $q.defer();

      $http({
        method: 'POST',
        url: me.baseURL + "token",
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          client_id: me.clientID,
          client_secret: me.clientSecret,
          grant_type: "password",
          uid: userID,
          provider: provider,
          scope: "public"
        }
      })
      .then(
        function successCallback(response) {
          me.accessToken = response.data.access_token;
          console.log('oauth token: access_token = {0}'.format(me.accessToken));
          success();

          // setup refresh
          me._refreshToken = response.data.refresh_token;
          me.expireInSec = response.data.expires_in - 10;
          if (me.expireInSec <= 10) me.expireInSec = 10;
          me.setupRefreshTimer(true);

          // save
          me.saveRefreshToken();
        },
        function errorCallback(response) {
      //    deferred.reject({'error': response.data.error, 'error_message': response.data.error_description});
          // check it has data and error properties
          if (response.data.hasOwnProperty('error')) {
            if (response.data.error == 'invalid_grant') {
              mismatch();
            } else {
              error(response.data.error);
            }
          } else {
            // this is either system unavilable or not reachable: 500, 404, ...
            // show with prefix 'H' which stands 'HTTP status code'
            error('H' + response.status);
          }
        }
      );
      //return deferred.promise;
    },

    encryptRefreshToken: function() {
      var me = this;
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: me.apiBaseURL + "/launcher_v2/encrypt_refresh_token",
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          refresh_token: me._refreshToken,
          io_black_box: me.ioBlackBox
        }
      })
      .then(
        function(response) {
          if (response.data.success) {
            deferred.resolve(response.data.info.custom);
          } else {
            deferred.reject(response.data.error_code);
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;

          deferred.reject(error_code);
        }
      );

      return deferred.promise;
    },

    decryptRefreshToken: function(encrypted_refresh_token) {
      var me = this;
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: me.apiBaseURL + "/launcher_v2/decrypt_refresh_token",
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          encrypted_refresh_token: encrypted_refresh_token,
          io_black_box: me.ioBlackBox
        }
      })
      .then(
        function(response) {
          if (response.data.success) {
            me._refreshToken = response.data.info.custom;
            deferred.resolve(response.data.info.custom);
          } else {
            deferred.reject(response.data.error_code);
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;

          deferred.reject(error_code);
        }
      );

      return deferred.promise;
    },

    getCurrentAccessToken: function() {
      return this.accessToken;
    },

    sendRequest: function(config, isRetry) {
      var me = this;
      var deferred = $q.defer();
      var thisIsRetry = false;

      // check if it's retry
      if (typeof isRetry != 'undefined')
        thisIsRetry = isRetry;

      // add access_token to config.data
      if (config.method.toLowerCase() == "get") {
        var params = $.extend({}, config.params, {"access_token": me.accessToken});
        config.params = params;
      } else {
        var data = $.extend({}, config.data, {"access_token": me.accessToken});
        config.data = data;
      }

      $http(config).then(
        function successCallback(response) { deferred.resolve(response);},
        function errorCallback(responseSave) {
          if (responseSave.data.error_code == "unauthorized" && me._refreshToken && !thisIsRetry) {
            me.refreshToken().then(
              function successCallback(response) {
                me.sendRequest(config, true).then(
                  function successCallback(response) { deferred.resolve(response); },
                  function errorCallback(reason) { deferred.reject(reason); }
              );},
              function errorCallback(response) { deferred.reject(responseSave);}
            );
          } else {
            deferred.reject(responseSave);
          }
        }
      );
      return deferred.promise;
    },

    fetchRefreshToken: function() {
      var me = this;
      var deferred = $q.defer();

      var encryptedRefreshToken = window.settings.get(this.getSettingKey('rfrshtkn'));
      this.decryptRefreshToken(encryptedRefreshToken).then(
        function(refreshToken) {
          deferred.resolve();
        },
        function(error_code) {
          deferred.reject(error_code);
        }
      );

      return deferred.promise;
    },

    refreshToken: function() {
      var me = this;
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: me.baseURL + "token",
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          client_id: me.clientID,
          client_secet: me.clientSecret,
          refresh_token: me._refreshToken,
          grant_type: "refresh_token",
          scope: "public"
        }
      }).then(function successCallback(response) {
        me.accessToken = response.data.access_token;
        console.log('oauth token: access_token = {0}'.format(me.accessToken));

        // setup refresh
        me._refreshToken = response.data.refresh_token;
        me.expireInSec = response.data.expires_in - 10;
        if (me.expireInSec <= 10) me.expireInSec = 10;
        me.setupRefreshTimer(true);

        // save
        me.saveRefreshToken();

        //
        deferred.resolve(response.data.access_token);

      }, function errorCallback(response) {

        console.log("@@@@@@@@ PASSING HERE");

        var error = null;
        var error_description = null;
        if (response.data.hasOwnProperty('error')) {
          error = response.data.error;
        } else {
          error = 'H' + response.status;
        }
        if (response.data.hasOwnProperty('error_description')) {
          error_description = response.data.error_description;
        }

        deferred.reject({'error': error, 'error_message': error_description});
        console.log(error_description);

        // setup retry
        me.setupRefreshTimer(false);
      });
      return deferred.promise;
    },

    enableAutoLogin: function(auto, ioBlackBox) {
      this.autoLoginEnabled = auto;
      this.ioBlackBox = ioBlackBox;
    },

    saveRefreshToken: function() {
      console.log('need to encrypt refresh token? :' + this.autoLoginEnabled);

      var me = this;
      if (this.autoLoginEnabled) {
        this.encryptRefreshToken().then(
          function(encryptedRefreshToken) {
            window.settings.set(me.getSettingKey('rfrshtkn'), encryptedRefreshToken);
            window.settings.save();
          },
          function(code) {
            console.log('error in ecrypting refresh token: ' + code);
          }
        );
      }
    },



    setupRefreshTimer: function(success) {

      var me = this;

      // clear out current timer if there is
      if (this.timerHandle != null) {
        clearTimeout(this.timerHandle);
        this.timerHandle = null;
      }

      // set up new tiemr
      if (success) {
        if (this.isRetrial) {
          // get out of retrial period
          this.isRetrial = false;
          console.log('oauth token: getting out of retry');
        }
      } else {
        if (this.inRetrial) {
          // double interval
          this.expireInSec = this.expireInSec * 2;
          console.log('oauth token: next retry interval: ' + this.expireInSec);
        } else {
          // entering retry. set initial interval 2 sec and double it everytime it fails
          this.expireInSec = 2;
          this.inRetrial = true;
          console.log('oauth token: begin retrial');
        }
      }

      this.timerHandle = setTimeout(
        function() { me.refreshToken(); },
        this.expireInSec * 1000
      );
      console.log('oauth token: next refresh will be issued in {0} sec'.format(this.expireInSec));
    },

    getSettingKey: function(base) {
      var rtn = base;
      var env = app.getConfig("Environment", "");
      if (env != "production" && env != "") {
        rtn = "{0}_{1}".format(base, env);
      }

      return rtn;
    }
  };
  return oauthManager;
}]);



/*
#1. Getting access token

curl -H "Content-Type: application/json" -d '{"client_id":"26654eb37d3c14a402bc6e4c651da1c68fcb3c006ad78050319433cc166b9bff","client_secret":"2f6a11b937d5d3acc139ca85ddad2925467e1a139aab5f87e5fc54309428b3dc","grant_type":"password","username":"jhyeo001@gmail.com","password":"4k1l4k1l","scope":"public"}' http://localhost:8080/oauth/token

===>

{"access_token":"a3e75591c9fbe41cf3f538a3cf1c947e25c51f14f496aad81e20e6d22721dc36","token_type":"bearer","expires_in":7200,"refresh_token":"617f903416eef4c215e6233ee17fa9d4d8d926607d4d137aada21950bd7cfc8f","created_at":1465509985}


#2. API Request with access token
curl -H "Content-Type: application/json" http://localhost:8080/api/public/user?access_token=a3e75591c9fbe41cf3f538a3cf1c947e25c51f14f496aad81e20e6d22721dc36

#3. Refresh Token

curl -H "Content-Type: application/json" -d '{"client_id":"26654eb37d3c14a402bc6e4c651da1c68fcb3c006ad78050319433cc166b9bff","client_secret":"2f6a11b937d5d3acc139ca85ddad2925467e1a139aab5f87e5fc54309428b3dc","grant_type":"refresh_token","refresh_token":"","scope":"public"}'
*/