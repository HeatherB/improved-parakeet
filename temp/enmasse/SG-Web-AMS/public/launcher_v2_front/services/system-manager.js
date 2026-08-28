launcherApp.factory('systemManager', ['$http', "$q", "oauthManager", "patchManager", function ($http, $q, oauthManager, patchManager) {
  var systemManager = {

    handlers: {
      defaultAction: {}
    },

    getSettingKey: function(base) {
      var rtn = base;
      var env = app.getConfig("Environment", "");
      if (env != "production" && env != "") {
        rtn = "{0}_{1}".format(base, env);
      }

      return rtn;
    },

    getVersion: function() {
      //return app.getConfig('LauncherVersion', '1.0');
      return "0.1";
    },

    closeSelf: function() {
       app.closeAll();
    },

    // get command line argument
    getCommandLineArgument: function() {
      return app.expandString("{ModuleArguments}");
    },

    // open external browser, no session
    openExternalBrowser: function(url, target) {
      var openTask = {
        'type': 'open',
        'path': url
      };

      workflow.tasks.tasks['_openBrowser'] = openTask;
      workflow.runTask('_openBrowser', function() {});
    },

    // open external browser
    openExternalBrowserWithSession: function(url, target) {

      var separator = '?';
      if (url.search('\\?') != -1)
        separator = '&'

      url = '{0}{1}{2}access_token={3}'.format(
        app.getConfig('AMSWebBaseURL', ''),
        url,
        separator,
        oauthManager.getCurrentAccessToken()
      );

      var openTask = {
        'type': 'open',
        'path': url
      };

      workflow.tasks.tasks['_openBrowser'] = openTask;
      workflow.runTask('_openBrowser', function() {});
    },

    runEMEDiag: function() {
      var taskName = 'runEMEDiag';
      workflow.runTask(taskName, function() {});
    },

    setWindowSize: function(width, height, instantResize) {
      var width_old = skinWindow.getWidth();
      var height_old = skinWindow.getHeight();

      var width_delta = width - width_old;
      var height_delta = height - height_old;

      var x_old = skinWindow.getX();
      var y_old = skinWindow.getY();

      var x = x_old - width_delta / 2.0;
      var y = y_old - height_delta / 2.0;

      if (x < 0) x = 0;
      if (y < 0) y = 0;

      x = Math.ceil(x);
      y = Math.ceil(y);

      if (typeof instantResize == 'undefined')
        instantResize = false;

      if (instantResize) {
        console.log('######## instant resize');
        skinWindow.setSize(width, height);
        skinWindow.setOrigin(x, y);
      } else {
        console.log('######## delayed resize: ({0}, {1})'.format(width, height));
        setTimeout(function() {
          skinWindow.setSize(width, height);
          skinWindow.setOrigin(x, y);
        }, 300);  // keep this value as 1/4 of transition duration. If transitions take 1 sec, set this as 250ms.
      }
    },

    getWindowWidth: function() {
      return skinWindow.getWidth();
    },

    getWindowHeight: function() {
      return skinWindow.getHeight();
    },

    // *****************************************************************************************
    // handlers
    // *****************************************************************************************
    setDefaultActionHandler: function(signature, handler) {
      this.handlers.defaultAction[signature] = handler;    // json object
    },

    unsetDefaultActionHandler: function(signature) {
      delete this.handlers.defaultAction[signature];   // json object
    },


    // *****************************************************************************************
    // default action related
    // *****************************************************************************************

    markDefaultActionComplete: function() {
      _markDefaultActionComplete();
    },

    //
    // check if default action exist
    checkDefaultAction: function(handler) {
      var action = this._getDefaultAction();
      var me = this;

      // check we have thing to do
      if (!action)
        return;

      // call user handler and store return value
      handler(action, 
        function() {    // do it
          me._doDefaultAction(action);  
        },
        function() {    // hold on, I'll take care of it
          // do nothing
        }
      );
    },

    doDefaultAction: function() {
      this._doDefaultAction();
    },

    _markDefaultActionComplete: function() {
      // erase register key 'action' of [USER]SOFTWARE\\ENMASSE\LAUNCHER
      platform.registryDeleteValue('default', 'user', 'SOFTWARE\\ENMASSE\\LAUNCHER', 'action')
    },

    _doDefaultAction: function(action) {
      // there is only one kind of action: install
      //{"type": "install", "params": {"gameName": "AVA"}}
      var me = this;

      if (typeof action == 'undefined') {
        action = this._getDefaultAction();
        if (!action)
          return;
      }

      if (action.hasOwnProperty('params') && action.params.hasOwnProperty('gameName')) {
        var gameName = action.params.gameName;
        var type = action.type;

        // use patchManager
        var id = patchManager.getGameIDFromName(gameName);

        if (id) {

          if (type == 'install') {
            patchManager.install(id, function(id, success) {
              if (success) me._markDefaultActionComplete();
            });
          } else if (type == 'run') {
            patchManager.play(id, function(id, success) {
              // do nothing
            });
          } else if (type == 'uninstall') {
            patchManager.uninstall(id);
          }

          // notify components who have registered their handler
          var handlers = this.handlers.defaultAction
          for (var property in handlers) {
            if (handlers.hasOwnProperty(property)) {
              handlers[property](id);
            }
          }
        }
      }
    },

    _getDefaultAction: function() {

      var action = null;

      var commandLineOption = this.getCommandLineArgument();

      // check for uninstall
      gameName = patchManager.findGameByUninstallAction(commandLineOption);
      if (gameName) {
        action = {
          type: 'uninstall',
          params: {
            gameName: gameName,
          }
        }
      }

      if (!action) {
        gameName = patchManager.findGameByCommandLineArgument(commandLineOption);
        if (gameName) {
          // {"type": "install", "params": {"gameName": "AVA"}}
          action = {
            type: 'run',
            params: {
              gameName: gameName
            }
          }
        }
      }

      if (!action) {
        // check register key 'action' of [USER]SOFTWARE\\ENMASSE\\LAUNCHER
        var value = platform.getRegistryString('default', 'user', 'SOFTWARE\\ENMASSE\\LAUNCHER', 'action', '');

        // try registry first

        if (value) {
          try {
            action = JSON.parse(value);
          } catch (e) {
            console.log('parsing error: when parsing default action: {0}'.format(value));
          }
        }
      }

      console.log("$$$$$$$$ default action:");
      console.dir(action);

      // delete 'install' default action when we found uninstall or run
      if (action && (action.type == 'uninstall' || action.type == 'run')) {
        this._markDefaultActionComplete();
        console.log('deleted install remaining action because we engaged ' + action.type);
      }

      return action;
    }
  };
  return systemManager;
}]);


