launcherApp.factory('loginManager', ['$http', "$q", "oauthManager", function ($http, $q, oauthManager) {
  var loginManager = {

    apiBaseURL: app.getConfig("APIBaseURL", ""),
    amsBaseURL: app.getConfig("AMSWebBaseURL", ""),
    currentUser: null,

    signIn: function(email, password, good, bad, activation, qna, armor, error, mismatch) {

      var me = this;

      // get oauth token
      oauthManager.getAccessToken(
        email,
        password,
        function() {
          // check user status
         me.checkUserStatus(good, bad, activation, qna, armor, error);
        },
        mismatch,
        error
      );
    },

    signInAuto: function(good, bad, activation, qna, armor, error, mismatch) {
      var me = this;

      // get oauth token
      oauthManager.getAccessTokenAuto(
        function() {
          // check user status
          me.checkUserStatus(good, bad, activation, qna, armor, error);
        },
        mismatch,
        error
      );
    },

    signInFB: function(FBID, FBToken, email, birthday, good, bad, activation, qna, armor, error) {

      var me = this;

      // call signup_with_external_auth
      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/signup_with_external_auth',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          in_steam: 'true',
          campaign: null,
          email: email,
          birthday: birthday,
          token: FBToken,
          uid: FBID,
          provider: 'facebook',
          auto_subscribe_newsletters: 'true',
          newsletter_ids: null,
          blackbox: $(blackbox).val()
        }
      }).then(
        function(response) {
          if (response.data.success) {
            // operation succeeded
            oauthManager.getAccessTokenExtern(
              FBID,
              'facebook',
              function() { me.checkUserStatus(good, bad, activation, qna, armor, error); },
              function() { error('C0002'); },
              error
            );
          } else {
            error(response.data.error_code);
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;

          error(error_code);
        }
      );
    },

    signUp: function(email, password, in_steam, referenceID, gameName, good, bad, activation, qna, armor, accountError, error) {
      var me = this;

      // call signup_with_external_auth
      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/sign_up',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          user: {
            email: email,
            password: password,
            password_confirmation: password,
            io_black_box: $(blackbox).val(),
            disable_auto_subscribing: '1'
          },
          in_steam: in_steam.toString(),
          rid: referenceID,
          game_name: gameName
        }
      }).then(
        function(response) {
          if (response.data.success) {
            var state = response.data.info.state;
            console.log('response.data.success ' + state);

            if (state == 'signup_good') {
              // user has been created or fetched
              // get oauth token
              oauthManager.getAccessToken(
                email,
                password,
                function() { me.checkUserStatus(good, bad, activation, qna, armor, error); },
                function() { error('C0003'); },
                error
              );
            } else {
              accountError(response.data.info.display);
              console.log('response.data.info.display ' + response.data.info.display);
            }
          } else {
            error(response.data.error_code);
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;

          error(error_code);
        }
      );
    },

    // emp part
    getWallet: function() {
      var deferred = $q.defer();
       $http({
          method: 'GET',
          url: this.amsBaseURL + '/users/account/get_emp_wallet_balance?access_token=' + oauthManager.accessToken,
          dataType: 'json',
          headers: {
            "Content-Type": "application/json"
          }
        }).then(
          function(response) {
            var emp_wallet_balance = response.data.emp_wallet_balance;
            //console.log('response is worth ' + emp_wallet_balance);
            $('#empHere').html(emp_wallet_balance);
            deferred.resolve();
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
    },
    // end emp part

    getCurrentUser: function() {

      var me = this;
      var deferred = $q.defer();

      if (me.currentUser) {
        deferred.resolve(me.currentUser);
        return deferred.promise;
      }

      oauthManager.sendRequest({
        method: 'GET',
        url: me.apiBaseURL + '/launcher_v2/user',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        }
      }).then(
        function(response) {
          if (response.data.success) {
            me.currentUser = response.data.info;
            //console.log('me.currentUser passes back ' + me.currentUser);
            //me.getWallet();
            var user_email = response.data.info.email;
            $('#user_emailHere').html(user_email);
            deferred.resolve(me.currentUser);
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

    checkUserStatus: function(good, bad, activation, qna, armor, error) {
      var me = this;

      // get user status
      oauthManager.sendRequest({
        method: 'GET',
        url: me.apiBaseURL + '/launcher_v2/check_user_status',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          user: {
            io_black_box: $(blackbox).val()
          }
        }
      }).then(
        function(response) {
          if (response.data.success) {
            me._handleUserStatus(response.data, good, bad, activation, qna, armor);
          } else {
            error(response.data.error_code);
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;
          error(error_code);
        }
      );
    },

    checkIOVationForGame: function(game_id, good, bad, error) {
      var me = this;

      oauthManager.sendRequest({
        method: 'GET',
        url: me.apiBaseURL + '/launcher_v2/check_iovation_game',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          game_id: game_id,
          user: {
            io_black_box: $(blackbox).val()
          }
        }
      }).then(
        function(response) {
          if (response.data.success) {
            if (response.data.info && response.data.info.state == 'bad_user') {
              bad(response.data.info.display);
            } else {
              good();
            }
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;
          error(error_code);
        }
      );
    },

    verifyActivationCode: function(activationCode, matched, mismatched, resend, error) {

      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/verify_activation_code',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          activation_code: activationCode
        }
      }).then(
        function(response) {
          if (response.data.success) {
            var state = response.data.info.state;
            if (state == 'activation_code_match') {
              matched();
            } else if (state == 'activation_code_mismatch') {
              mismatched();
            } else {
              resend();
            }
          } else {
            error(response.data.error_code);
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;
          error(error_code);
        }
      );
    },

    sendActivationCode: function() {

      var deferred = $q.defer();

      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/resend_activation',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
      }).then(
        function(response) {
          if (response.data.success)
            deferred.resolve();
          else
            deferred.reject(response.data.error_code);
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

    getSecretQuestions: function() {

      var deferred = $q.defer();

      oauthManager.sendRequest({
        method: 'GET',
        url: this.apiBaseURL + '/launcher_v2/secrete_questions',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        }
      }).then(
        function(response) {
          if (response.data.success)
            deferred.resolve(response.data.info.custom.secret_questions);
          else
            deferred.reject(response.data.error_code);
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

    answerQuestion: function(questionID, answer) {

      var deferred = $q.defer();

      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/secret_answer',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          secret_question_id: questionID,
          secret_answer: answer
        }
      }).then(
        function(response) {
          if (response.data.success)
            deferred.resolve();
          else
            deferred.reject(response.data.error_code);
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

    verifyAccountArmorCode: function(code, remember, matched, mismatched, error) {

      oauthManager.sendRequest({
        method: 'GET',
        url: this.apiBaseURL + '/launcher_v2/verify_account_armor_code',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          engarde_ticket: code,
          remember_device: remember
        }
      }).then(
        function(response) {
          console.log('verify armor code passed said ' + response.data);
          if (response.data.success) {
            var state = response.data.info.state;
            if (state == 'account_armor_match')
              matched();
            else
              mismatched();
          } else {
            error(response.data.error_code);
          }
        },
        function(response) {
          console.log('verify armor code failed and said ' + JSON.stringify(response.data));
          //$scope.submitarmor_error = "The Account Armor code entered is not valid. If trying again doesn't fix the problem, contact our Customer Support team.";
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            //error_code = response.data.error_code;
            error_code = "The Account Armor code entered is not valid. If trying again doesn't fix the problem, contact our Customer Support team.";
          else
            error_code = 'H' + response.status;
          error(error_code);
        }
      );
    },

    sendAccountArmorCode: function(ok, ticketAbsent, error) {
      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/send_account_armor_code',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        }
      }).then(
        function(response) {

          if (response.data.success) {
            var state = response.data.info.state;
            if (state == 'account_armor_code_sent')
              ok();
            else if (state == 'send_account_armor_ticket_absent')
              ticketAbsent();
            else
              error('C0001');
          } else {
            error(response.data.error_code);
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;
          error(error_code);
        }
      );
    },

    associateSteam: function(steamAppID, steamAuthTicket, steamUserID) {

      var deferred = $q.defer();

      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/associate_steam',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          provider: 'steam',
          steam_auth_ticket: steamAuthTicket,
          steam_app_id: steamAppID,
          steam_user_id: steamUserID
        }
      }).then(
        function(response) {
          if (response.data.success) {
            deferred.resolve();
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

    applyLoginPromotion: function(game_id, has, none, error) {

      var me = this;
      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/apply_login_promotion',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          game_id: game_id
        }
      }).then(
        function(response) {
          if (response.data.success) {
            var promotions = [];
            if (response.data.hasOwnProperty('info') && response.data.info.hasOwnProperty('custom'))
              promotions = response.data.info.custom;
            if (promotions.length > 0) {
              has(promotions);
            } else {
              none();
            }
          } else {
            error(response.data.error_code)
          }
        },
        function(response) {
          var error_code = me._handleError(response);
          error(error_code);
        }
      );
    },

    onGameRun: function(id) {
      this.applyLoginPromotion(id,
        function(promotions) {
          console.log("login promotion fulfilled: ");
          console.dir(promotions);
        },
        function() {
          console.log("no login promotion available.");
        },
        function(code) {
          console.log("error in login promotion: " + code);
        });
    },

    _handleUserStatus: function(data, good, bad, activation, qna, armor) {
      var state = data.info.state;

      if (state == 'bad_user') {
        var error_msg = data.info.display;
        bad(error_msg);
      } else if (state == 'activation_needed') {
        activation();
      } else if (state == 'secret_qa_needed') {
        qna();
      } else if (state == 'account_armor_needed') {
        armor();
      } else if (state == 'good') {
        good();
      } else {
        console.log('exception: unknown state {0}'.format(state));
      }
    },

    _handleError: function(response) {
      var error_code;
      if (response.data.hasOwnProperty('error_code'))
        error_code = response.data.error_code;
      else
        error_code = 'H' + response.status;

      return error_code;
    },

    onLogin: function() {
      // set
      window.settings.set(this.getSettingKey('didLogout'), false);
      window.settings.save();
    },

    onLogout: function() {
      // set logout flag so that next login window detect it
      // and prevent from auto login
      window.settings.set(this.getSettingKey('didLogout'), true);
    },

    checkLogout: function() {
      var rtn = window.settings.get(this.getSettingKey('didLogout'));
      if (rtn == null)
        return false;

      return rtn;
    },

    getSettingKey: function(base) {
      var rtn = base;
      var env = app.getConfig("Environment", "");
      if (env != "production" && env != "") {
        rtn = "{0}_{1}".format(base, env);
      }

      return rtn;
    },

    getBetaAccessCode: function(game_id, code, system_deny, fail) {

      oauthManager.sendRequest({
        method: 'GET',
        url: this.apiBaseURL + '/launcher_v2/get_user_beta_access_code',
        dataType: 'json',
        params: {
          game_id: game_id
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(
        function(response) {
          if (response.data.success) {
            var rtn_code = response.data.info.custom;
            if (rtn_code == "__system_deny__") {
              system_deny();
            } else {
              code(rtn_code);
            }
          }
        },
        function(response) {
          var error_code;
          if (response.data.hasOwnProperty('error_code'))
            error_code = response.data.error_code;
          else
            error_code = 'H' + response.status;
          fail(error_code);
        }
      );
    },

  };

  return loginManager;
}]);