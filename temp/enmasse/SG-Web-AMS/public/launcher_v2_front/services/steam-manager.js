var steamSupport = null;
REMOTE_CALL_TIMEOUT = 5.0;

launcherApp.factory('steamManager', ['$http', '$q', 'patchManager', 'oauthManager', 'systemManager', function ($http, $q, patchManager, oauthManager, systemManager) {

  var steamManager = {
    initialized: false,
    steamUserID: null,
    steamUserPersonaName: null,
    steamMode: false,
    steamAppID: null,
    steamAuthTicket: null,

    apiBaseURL: app.getConfig("APIBaseURL", ""),

    initialize: function() {

      // make sure we've loaded all interops in workflow
      steamSupport = interop.createInstance('EME.SteamSupport', SteamSupport);

      if (steamSupport == null) {

        // steam is not ready in whatever reason
        console.log('cannot create steamSupport object');

        // set steam mode false for this case,
        // we don't know this is steam execution or not cause we couldn't load steam dll
        this.steamMode = false;

        // have to quit
        //alert("Launcher is unable to make steamSupport object." + "\n\nIf this problem persists please visit support.enmasse.com for additional help");
        //app.closeAll();

      } else {

        // release steamsupport when unloaded
        var steamSupportWillUnloadObs = notificationCenter.addObserver("Interop", "WillUnload", function(sender, info) {
          if (info.name !== "steamsupport") { return false; }
          steamSupportWillUnloadObs.release();
          console.log("release steamsupport\n");
          steamSupport.release();
          steamSupport = null;
        });
      }

      // load steam api dynamically
      if (steamSupport != null && steamSupport.steam_is_api_loaded() == "false") {
        if (steamSupport.steam_load_api(app.expandString("{ModulePath}") + "steam_api.dll") == "false") {
          //_googleAnalyticsTrackEvent("LoadSteamAPI Error", "cannot load steam_api.dll");
          console.log("cannot load steam_api.dll");
          alert("Launcher is unable to load the steam_api.dll file." + "\n\nIf this problem persists please visit support.enmasse.com for additional help");
          app.closeAll();
        }
      }

      // register game status handler
      this.setGameStatusHandler();

      // check commandline option for 'fake steam mode'
      var cmd = app.expandString("{ModuleArguments}");
      var keyword = '/steam';
      if (cmd.search(keyword) != -1) {
        // this is fake mode
        this.initialized = true,
        this.steamUserID = 'fake_steam_user_id_use_your_own',
        this.steamUserPersonaName = 'fakeuser',
        this.steamMode = true,
        //this.steamAppID = '102700',         // AVA
          this.steamAppID = '306830',           // ZMR
        this.steamAuthTicket = 'fake_authticket'
        return;
      }

      // initialize steam
      if (steamSupport != null && steamSupport.steam_init() == "true") {
        this.steamUserID = steamSupport.steam_get_user_id();
        this.steamUserPersonaName = steamSupport.steam_get_user_persona_name();
      }

      if (steamSupport != null) {
        if (this.steamUserID) {
          steamSupport.set_injection_enabled(true);
          this.steamMode = true;
        } else {
          // disable SteamSupport.dll injection to subprocesses
          steamSupport.set_injection_enabled(false);
          this.steamMode = false;
        }
      }

      // debug out
      console.log('steamMode:' + this.steamMode);

      if (this.steamMode) {

        this.steamAppID = steamSupport.steam_get_app_id();
        this.steamAuthTicket = steamSupport.steam_get_auth_session_ticket().ticket;

        console.log("running under steam, steamAppID='{0} steamUserID='{1}', steamUserPersonaName='{2}'\n".format(this.steamAppID, this.steamUserID, this.steamUserPersonaName));

        var me = this;


        // add event listener for onShellExecute which will be called when the game invokes ShellExecute API
        notificationCenter.addInstanceObserver("SteamSupport", "onShellExecute", steamSupport, function(sender, info) {
          console.log('SteamSupport::onShellExecute notification');
          console.dir(sender);
          console.dir(info);

          try {
            if (info.operation == 'open') {
              console.log('operation is open');

              // prevent original operation
              info.post_action = "skip";

              //var url = info.file;
              var url = info.file;
              if (url.indexOf(me.url_needle) >= 0) {
                try {
                  url = me.url_target;
                }
                catch(e) {
                }
              }
              console.log("ShellExecute url={0}\n".format(url));
              var result = me.makeSSOURL(
                url,
                {steam_user_id: me.steamUserID, steam_user_persona_name: me.steamUserPersonaName},
                function(result) {
                  me.navigateSteamBrowser(result.url);
                },
                function(response) {
                  //
                  console.log('-------- error on makdSSOURL --------');
                  console.dir(response);
                }
              );
            }
          }
          catch(e) {
            console.error(e);
          }
          info.return_value = "OK";
        });
      }

      //notificationCenter.addObserver("App", "WillConstructWebGetTarget", onConstructWebGetTarget);

      var skinWindowWillCloseObs = notificationCenter.addInstanceObserver("SkinWindow", "WillClose", skinWindow, function(sender, info) {
        /*
        if (info.canClose === false) {
            return;
        }

        launcherWillClose = true;

        dlcInstalledChecker.stop();

        if (_launcherUpdated == false && app.getRestart() == false) {
            CloseExitFrame();
            ShowExitInProgressFrame();
        }

        skinWindowWillCloseObs.release();

        _getWindowSize();
        _saveSettings();

        if (app.getRestart() == true) {
            app.setRemoveLocalStorage(false);   // don't delete on a restart - likely launcher is patching
        }
        else {
            app.setRemoveLocalStorage(true);    // normal exit, delete cache to simplify things
        }
        */
      });

      // set flag for preventing run twice
      this.initialized = true;
    },

    setGameStatusHandler: function() {
      var me = this;
      patchManager.setUpdateStatusHandler('steamManager', function(id, oldState, newState, progress) {
        if (newState == patchManager.gamestatus.RUNNING) {
          console.log('game is now running');
          me.onGameStart();
        } else if (newState == patchManager.gamestatus.READY_TO_RUN && oldState == patchManager.gamestatus.RUNNING) {
          console.log('closing launcher');
          me.onGameEnd();
        }
      });
    },

    isSteamRunning: function() {
      return this.steamMode;
    },

    getSteamUserID: function() {
      return this.steamUserID;
    },

    getSteamAppID: function() {
      return this.steamAppID;
    },

    getSteamAuthTicket: function() {
      return this.steamAuthTicket;
    },

    navigateDefaultBrowser: function(strUrl) {
      if(this.isUrl(strUrl) && platform)
        platform.shellOpen(strUrl);
    },

    checkRemoteSteamInitialized: function(remote_name) {
      if (steamSupport.remote_steam_is_api_loaded(remote_name, REMOTE_CALL_TIMEOUT) == "false") {
        if (steamSupport.remote_steam_load_api(remote_name, app.expandString("{ModulePath}") + "steam_api.dll", REMOTE_CALL_TIMEOUT) == "true") {
          if (steamSupport.remote_steam_init(remote_name, REMOTE_CALL_TIMEOUT) == "true") {
            return true;
          }
        }
        return false;
      }
      else
        return true;
    },

    checkRemoteSteamOverlayEnabled: function(remote_name) {
      if (this.checkRemoteSteamInitialized(remote_name) == true) {
        if (steamSupport.remote_steam_is_overlay_enabled(remote_name, REMOTE_CALL_TIMEOUT) == "true") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    navigateSteamBrowser: function(strUrl) {
      var remote_name = this.executable;
      if(this.isUrl(strUrl)) {
        if (this.checkRemoteSteamOverlayEnabled(remote_name)) {
          steamSupport.remote_steam_activate_game_overlay_to_web_page(remote_name, strUrl, REMOTE_CALL_TIMEOUT);
        } else {
          console.log("Steam Overlay is not enabled, use system browser.")
          this.navigateDefaultBrowser(strUrl);
        }
      }
    },

    isUrl: function(s) {
      var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
      return regexp.test(s);
    },


    addShellExecuteHookToGameProcess: function() {
      // wait until game subprocess registered
      var me = this;
      var checking_count = 0;
      var check_and_setup_interval = setInterval(
        function () {
          if (steamSupport.remote_register_callback(me.executable, "shellexecute", "onShellExecute", REMOTE_CALL_TIMEOUT) == "true") {
            clearInterval(check_and_setup_interval);
            console.log("remote callback 'shellexecute' installed\n");
          }
          else {
            if (checking_count > 100) {
              clearInterval(check_and_setup_interval);
              console.log("fail to install remote callback 'shellexecute'\n");
            }
            else {
              checking_count += 1;
            }
          }
        },
        100
      );
    },

    onGameStart: function() {
      if (this.steamMode) {
        var game = patchManager.getGameFromSteam(this.steamAppID);
        this.url_needle = game.storeURLNeedle;
        this.url_target = game.storeURLTarget;
        this.executable = game.executable;
        this.gameID = game.id;

        console.log('url_needle: ' + this.url_needle);
        console.log('url_target: ' + this.url_target);
        console.log('executable: ' + this.executable);

        this.addShellExecuteHookToGameProcess();
      }
    },

    onGameEnd: function() {
      if (this.steamMode) {
        systemManager.closeSelf();
      }
    },

    makeSSOURL: function(popupUrl, optionalData, success, error) {

      //success({url: popupUrl, enable_system_browser: false});
      //return;

      //
      var me = this;


      // parse optional flags in popupUrl
      var splitted_popupUrl = popupUrl.split("|");
      popupUrl = splitted_popupUrl[0];
      var optional_flags = splitted_popupUrl.slice(1);

      var enable_sso = true;
      var enable_system_browser = false;
      var result_url = null;

      for (var i = 0; i < optional_flags.length; i++) {
        var optional_flag = optional_flags[i];
        if (optional_flag == "sso") {
          enable_sso = true;
        }
        if (optional_flag == "not_sso") {
          enable_sso = false;
        }
        if (optional_flag == "system_browser") {
          enable_system_browser = true;
        }
        if (optional_flag == "not_system_browser" || optional_flag == "ingame_browser") {
          enable_system_browser = false;
        }
      }

      // get SSO forwarder url
      var SSOURL = app.getConfig('AMSHost', 'https://account.enmasse.com');

      // get oauth access_token and insert it in post params
      var accessToken = oauthManager.getCurrentAccessToken();

      // 1. visit '/landing' page to set up session cache and cookies
      $http({
        method: 'GET',
        url: SSOURL + '/launcher_v2/landing?access_token=' + accessToken,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(
        function(response) {
          console.log('visited landing page.');

          // 2. get sso ticket
          $http({
            method: 'GET',
            url: me.apiBaseURL + '/launcher_v2/sso_auth_ticket?access_token=' + accessToken + '&game_id=' + me.gameID,
            dataType: 'json',
            params: optionalData,
            headers: {
              "Content-Type": "application/json"
            }
          }).then(
            function(response) {
              var ticket = response.data.info.custom;
              console.log('got ticket: ' +  ticket);

              result_url = SSOURL + "/launcher/auth_forward_url?next=" + encodeURIComponent(popupUrl) + "&ticket=" + ticket;
              success({url: result_url, enable_system_browser: enable_system_browser});
              return;
            },
            function(response) {
              console.log('could not get ticket.');
              console.dir(response);
              error(response);
            }
          );
        },
        function(response) {
          console.log('could not visit landing page.');
          console.dir(response);
          error(response);
        }
      );


      // // get SSO forwarder url
      // var SSOURL = app.getConfig('SSOForwarder', 'https://account.enmasse.com');

      // if (enable_sso) {
      //   var ticket = "";

      //   $http({
      //     method: 'POST',
      //     url: SSOURL + "/launcher/" + this.gameID + "/sso_auth_ticket_v2",
      //     dataType: 'json',
      //     data: optionalData,
      //     headers: {
      //       "Content-Type": "application/json"
      //     }
      //   }).then(
      //     function(data) {
      //       ticket = data.ticket;
      //       //@TODO
      //       result_url = SSOURL + "/launcher/auth_forward_url?next=" + encodeURIComponent(popupUrl) + "&ticket=" + ticket;
      //       success({url: result_url, enable_system_browser: enable_system_browser});
      //     },
      //     function(xhr, status, error) {
      //       error(xhr, status, error);
      //     }
      //   );

        /*
        $.ajax({
          type: "POST",
          async: true,
          data: optionalData,
          dataType: 'json',
          url: SSOURL + "/launcher/" + this.gameID + "/sso_auth_ticket",
          success: function (data) {
            ticket = data.ticket;
            //@TODO
            result_url = SSOURL + "/launcher/auth_forward_url?next=" + encodeURIComponent(popupUrl) + "&ticket=" + ticket;
            success({url: result_url, enable_system_browser: enable_system_browser});
          },
          error: function(xhr, status, error) {
            error(xhr, status, error);
          }
        });*/
      // } else {
      //   result_url = popupUrl;
      //   success({url: result_url, enable_system_browser: enable_system_browser});
      // }
    },

    //
    // API wrapper BEGINS
    //
    activateSteamDLC: function(DLCIDList, gameID) {
      var deferred = $q.defer();

      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/activate_steam_dlc',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          dlc_id_list: DLCIDList,
          game_id: gameID
        }
      }).then(
        function(response) {
          if (response.data.success) {
            deferred.resolve();
          }
          else {
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

    checkSteamDLCActivated: function(DLCList, onHasDLC, onNothing, error) {

      oauthManager.sendRequest({
        method: 'POST',
        url: this.apiBaseURL + '/launcher_v2/check_steam_dlc_activated',
        dataType: 'json',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          dlc_list: DLCList
        }
      }).then(
        function(response) {
          if (response.data.success) {

            // check if not-activated DLC available
            var rtn = [];
            var dlcs = response.data.info.custom;
            if (dlcs == null) error('C0006');

            // count not-activated DLCs
            for (var i=0;i<dlcs.length;i++) {
              var dlc = dlcs[i];
              if (dlc.activated == false && dlc.will_be_activated == false) {
                rtn.push(dlc.dlc_id);
              }
            }

            // call proper handler
            if (rtn.length > 0)
              onHasDLC(rtn);
            else
              onNothing();

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
    }
    //
    // API wrapper ENDS
    //
  };



  return steamManager;

}]);
