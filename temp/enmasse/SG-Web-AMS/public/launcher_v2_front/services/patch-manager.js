launcherApp.factory('patchManager', ['$http', "$filter", "$q", "$interval", "oauthManager", "loginManager",
  function ($http, $filter, $q, $interval, oauthManager, loginManager) {
  var patchManager = {

    gamestatus: {
      UNKNOWN:        'unknown',
      NOT_INSTALLED:  'not installed',
      INSTALLING:     'installing',
      PATCHABLE:      'patch available',
      PATCHING:       'patching',
      PAUSED:         'paused',
      READY_TO_RUN:   'ready to run',
      RUNNING:        'running',
      REPAIRING:      'repairing'
    },

    launcherstatus: {
      UNKNOWN:    'unknown',
      READY:      'ready',
      PATCHING:   'patching'
    },

    errorCode: {
      LAUNCHER_UPDATE_FAIL: 0,
      PATCH_FAIL: 1,
      INSTALL_FAIL: 2,
      LAUNCH_FAIL: 3,
      INSUFFICIENT_SPACE: 4,
      LAUNCH_ARGUMENT_LOGIC_FAIL: 5,
      LAUNCH_ARGUMENT_GENERIC_FAIL: 6,
      LAUNCH_TASK_MISSING: 7,
      LAUNCH_IOVATION_DENY: 8,
      GENERIC_FAIL_RETRYABLE: 9
    },

    games: [],
    initialized: false,
    downloadTracker: {},
    workflowLoaded: false,
    observersAdded: false,
    taskTracker: {},
    installOrPatch: 'PATCHING',
    executionCheckMS: 5000,
    timer: null,

    handlers: {
      updateStatus: {},
      launcherStatus: {},
      errorReport: {}
    },

    allGameRepositoryStatusCheckDone: false,


    // *****************************************************************************************
    // public methods
    // *****************************************************************************************

    updateLauncher: function(onLauncherWillUpdate, onLauncherIsUpToDate, onError) {
      var launcherUpdateStarted = false;
      var me = this;

      // download workflow from ams server
      me._downloadWorkflow().then(
        function(data) {

          // read game information on the workflow
          me._readMeta(data);

          // add observers for patchManager
          me._addObservers();

          // check launcher is up to date
          n = notificationCenter.addObserver('Task', 'Start', function(sender, info) {
            console.log('task started: ' + sender.name);
            if (sender.name == 'syncLauncher') {
              n.release();
              launcherUpdateStarted = true;
              onLauncherWillUpdate();
              return;
            }
          });

          // run syncChecker for launcher
          // @TODO: for debug
          var cmd = app.expandString("{ModuleArguments}");
          var keyword = '/skiplauncherupdate';
          if (cmd.search(keyword) != -1) {
            onLauncherIsUpToDate();
            n.release();
            return;
          } else {
            workflow.runTask('syncCheckLauncher', function(sender, info) {
              if (!launcherUpdateStarted) {
                onLauncherIsUpToDate();
                n.release();
                return;
              }
            });
          }
        },
        function(reason) {
          onError('C0008');
        });
    },

    // intialize
    //
    // 1. check patch status for all the repository
    // 2. add observers
    //
    initialize: function() {
      var deferred = $q.defer();
      var me = this;


      me._checkRepositoryStatus().then(
        function() {
          deferred.resolve();
          if (me.timer) $interval.cancel(me.timer);
          me.timer = $interval( function() { me._checkExecution(me) }, me.executionCheckMS );
        },
        function(reason) { deferred.reject("check repository status: " + reason); }
      );

      return deferred.promise;
    },

    setRefreshCatalogDurationMS: function(ms) {
      if (this.timer)
      {
        $interval.cancel(this.timer);
        this.catalogRefreshMS = ms;
        this.timer = $interval( function() { this.doNothing() }, this.catalogRefreshMS );
      }
    },

    // get status for all games
    getGames: function() {
      return this.games;
    },

    // get game status of gameId = id
    getGame: function(id) {
      var found = $filter('filter')(this.games, {id: id}, true);
        if (found && found.length) {
            return found[0];
        }
        return null;
    },

    // game status enumeration
    getGameStatusEnum: function() {
      return this.gamestatus;
    },

    refreshStatus: function() {
      this.workflow.runTask("refreshStatus");
    },

    doNothing: function() {

    },

    play: function(id, handler, options) {

      if (!this._checkActionAllowed(id, 'play'))
        return;

      this._checkPlayable(id, handler, options);
      /*
      var taskName = "launch" + id;
      workflow.tasks.tasks[taskName]['arguments'] = argument;
      workflow.runTask(taskName, function(a,b){});
      */
    },

    install: function(id, handler) {

      if (!this._checkActionAllowed(id, 'install'))
        return;

      var me = this;

      this.installOrPatch = 'INSTALLING';
      var taskName = "sync" + id;
      workflow.runTask(taskName, function(sender, info){

        //
        console.log("@@@@@@@@ install completed: " + id);

        // create shortcut
        me.createShortcut(id);

        // register uninstall info.
        me.setupUninstall(id);

        // call handler
        if ( (typeof handler != 'undefined') && handler != null) {
          var success = !sender.hasError(null) && sender.isComplete();
          handler(id, success);
        }
      });
    },

    patch: function(id) {

      if (!this._checkActionAllowed(id, 'patch'))
        return;

      this.installOrPatch = 'PATCHING';
      var taskName = "sync" + id;
      workflow.runTask(taskName, function(a,b){});
    },

    repair: function(id) {
      /*
      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        var patchmanifest = found[0].patchManifest;
        var taskName = "repair" + id;
        var task = workflow.tasks.create(taskName, false, window.taskControllerCreator, window.taskViewCreator);
        task.controller.url = patchmanifest;
        task.controller.fastVerify = true;
        task.controller.repair();
      }
      */

      var taskName = "repair" + id;
      workflow.runTask(taskName, function(a,b){});
    },

    pause: function(id) {

      if (!this._checkActionAllowed(id, 'pause'))
        return;

      var download = this.downloadTracker[id];
      if (download) {

        // pause it
        download.setActive(false);

        // change status
        var found = $filter('filter')(this.games, {id: id}, true);
        if (found && found.length > 0) {
          var oldState = found[0]['status'];
          var newState = this.gamestatus['PAUSED'];
          found[0]['status'] = newState;

          console.log("old: {0} new: {1}".format(oldState, newState));

          // call handler
          if (oldState != newState) {
            this._callUpdateStatusHandlers(id, oldState, newState);
          }
        }
      }
    },

    resume: function(id) {

      if (!this._checkActionAllowed(id, 'resume'))
        return;

      var download = this.downloadTracker[id];
      if (download) {

        // resume it
        download.setActive(true);

        // call handler
        var found = $filter('filter')(this.games, {id: id}, true);
        if (found && found.length > 0) {
          var oldState = found[0]['status'];
          var newState = this.gamestatus[this.installOrPatch];
          found[0]['status'] = newState;

          // call handler
          if (oldState != newState) {
            this._callUpdateStatusHandlers(id, oldState, newState);
          }
        }
      }
    },

    // *****************************************************************************************
    // handlers
    // *****************************************************************************************
    setUpdateStatusHandler: function(signature, handler) {
      this.handlers.updateStatus[signature] = handler;    // id, oldState, newState, progress
    },

    unsetUpdateStatusHandler: function(signature) {
      delete this.handlers.updateStatus[signature];   // id, oldState, newState, progress
    },

    setLauncherStatusHandler: function(signature, handler) {
      this.handlers.launcherStatus[signature] = handler;
    },

    unsetLauncherStatusHandler: function(signature) {
      delete this.handlers.launcherStatus[signature];
    },

    setErrorReportHandler: function(signature, handler) {
      this.handlers.errorReport[signature] = handler;
    },

    unsetErrorReportHandler: function(signature) {
      delete this.handlers.errorReport[signature];
    },

    // *****************************************************************************************
    // miscs
    // *****************************************************************************************
    getGameIDFromName: function(name) {
      var rtn = this.getGameWithName(name);
      if (rtn != null)
        return rtn.id;
      else
        return rtn;
    },

    getGameWithName: function(name) {
      var found = $filter('filter')(this.games, {name: name}, true);
      if (found && found.length > 0) {
        return found[0];
      }

      var found = $filter('filter')(this.games, {name: name.toUpperCase()}, true);
      if (found && found.length > 0) {
        return found[0];
      }

      var found = $filter('filter')(this.games, {name: name.toLowerCase()}, true);
      if (found && found.length > 0) {
        return found[0];
      }
      return null;
    },

    findGameByCommandLineArgument: function(commandlineOption) {
      var _cmd = commandlineOption.toLowerCase();
      for (i=0; i< this.games.length; i++) {
        var game = this.games[i];
        if (_cmd.search(game.name.toLowerCase()) != -1)
          return game.name;
      }
    },

    findGameByUninstallAction: function(commandlineOption) {
      for (i=0; i<this.games.length; i++) {
        var game = this.games[i];
        var needle = "uninstall_{0}".format(game.name.toLowerCase());
        if (commandlineOption.search(needle) != -1)
          return game.name;
      }
      return null;
    },

    getGameFromSteam: function(steamAppID) {
      var found = $filter('filter')(this.games, {steamAppID: steamAppID}, true);
      if (found && found.length > 0) {
        return found[0];
      }
      return null;
    },

    setExtraCommandOption: function(gameName, key, value) {

      var game = this.getGameWithName(gameName);
      if (game) {
        if (typeof game.commandOption == "undefined")
          game.commandOption = [];
        
        for (i=0;i<game.commandOption.length;i++) {
          if (game.commandOption[i].key == key) {
            game.commandOption[i].value = value;
            return;
          }
        }
        game.commandOption.push({key: key, value: value});        
      }


      // for (i=0;i<this.commandOption.length;i++) {
      //   if (this.commandOption[i].key == key) {
      //     this.commandOption[i].value = value;
      //     return;
      //   }
      // }
      // this.commandOption.push({key: key, value: value});
    },

    isAllGameRepositoryStatusCheckDone: function() {
      return this.allGameRepositoryStatusCheckDone;
    },

    // *****************************************************************************************
    // internal methods
    // *****************************************************************************************

    // get task and gameId from task-name
    _parseTaskName: function(sender, info) {
      var taskName = sender.name;
      var re = /(\D+)(\d+)/;
      var matches = re.exec(taskName);

      // if matches doesn't have 3 parts, we ignore it.
      if (!matches || matches.length != 3)
          return null;

      var name = matches[1];
      var id = parseInt(matches[2]);
      return {
          "name": name,
          "id": id
      };
    },

    _getIdFromPatchManifestURL: function(url) {
      var found = $filter('filter')(this.games, {patchManifest: url}, true);
      //console.log(typeof found);
      if (found && found.length > 0) {
        return found[0].id;
      }

      return null;
    },

    _getGameFromDownloadID: function(instanceID) {
      var gameID = null;
      for (var entry in this.downloadTracker) {
        var download = this.downloadTracker[entry];
        if (download.instanceId == instanceID) {
          gameID = entry;
          break;
        }
      }

      if (gameID != null) {
        gameID = parseInt(gameID);
        var found = $filter('filter')(this.games, {id: gameID}, true);
        if (found && found.length > 0) {
          return found[0];
        }
      }

      return null;
    },

    _callUpdateStatusHandlers: function(id, oldState, newState, progress) {

      // var found = $filter('filter')(this.games, {id: id}, true);
      // if (found && found.length > 0) {
      //   if (found[0].hasOwnProperty('isRunning') && found[0]['isRunning']) {
      //     return;
      //   }
      // }

      var handlers = this.handlers.updateStatus;
      for (var property in handlers) {
        if (handlers.hasOwnProperty(property)) {
          handlers[property](id, oldState, newState, progress);
        }
      }
    },

    _callLauncherStatusHandlers: function(oldState, newState, progress) {
      var handlers = this.handlers.launcherStatus;
      if (handlers) {
        for (var property in handlers) {
          if (handlers.hasOwnProperty(property)) {
            handlers[property](oldState, newState, progress);
          }
        }
      }
    },

    _callErrorReportHandlers: function(info) {
      var handlers = this.handlers.errorReport;
      if (handlers) {
        for (var property in handlers) {
          if (handlers.hasOwnProperty(property)) {
            handlers[property](info);
          }
        }
      }
    },

    _checkGameUpdateStatusWithTaskStart: function(task) {

      // update game status
      var convertString = {
          'upToDate': 'READY_TO_RUN',
          'updateNeeded': 'PATCHABLE',
          'installNeeded': 'NOT_INSTALLED',
          'repair': 'REPAIRING',
          'sync': this.installOrPatch,
          'launch': 'RUNNING',
          'isRunning': 'RUNNING',
          'isNotRunning': 'UNKNOWN'
      };
      var status = convertString[task.name];

      // if we got something other than convert strings, we ignore it
      if (!status)
          return;

      var id = task.id;
      var found = $filter('filter')(this.games, {id: id}, true);

      //console.log("before id:{0} status:{1} found:{2}".format(id, status, JSON.stringify(found)));

      if (found && found.length > 0) {
        var oldState = found[0]['status'];
        var newState;

        // check if this is in case of isRunning or isNotRunning
        if (task.name == 'isRunning') {
          found[0]['isRunning'] = true;

        } else if (task.name == 'isNotRunning') {
          if (found[0]['isRunning'] == true) {
            // we don't know what state it is
            // so we run syncCheck
            found[0]['isRunning'] = false;
            workflow.runTask('syncCheck' + task.id, function(a,b){});
            return;
          }
          // state haven't changed and still not running
          // nothing to do
          return;
        }

        newState = this.gamestatus[status];
        found[0]['status'] = this.gamestatus[status];

        // call handler
        if (oldState != newState) {
          this._callUpdateStatusHandlers(id, oldState, newState);
        }
      }
    },

    _checkGameUpdateStatusWithTaskComplete: function(task, success, errors) {
      // @TODO: dealing with success value
      // note. regardless the result, we set READY_TO_RUN.
      //console.log('task:{0} success:{1}'.format(JSON.stringify(task), success));


      // update game status
      var convertString = {
          'sync': 'READY_TO_RUN',
          'repair': 'READY_TO_RUN',
          'launch': 'READY_TO_RUN'
      };

      var status = convertString[task.name];

      // if we got something other than convert strings, we ignore it
      if (!status)
        return;

      if (success) {
      /*
        var id = task.id;
        var found = $filter('filter')(this.games, {id: id}, true);

        //console.log("before id:{0} status:{1} found:{2}".format(id, status, JSON.stringify(found)));

        if (found && found.length > 0) {

          var oldState = found[0]['status'];
          var newState = this.gamestatus[status];
            found[0]['status'] = this.gamestatus[status];

            // call handler
            if (oldState != newState) {
              this._callUpdateStatusHandlers(id, oldState, newState);
            }
        }
      */
      } else {
        // report error
        var syncError = this.errorCode.INSTALL_FAIL;
        if (this.installOrPatch == 'PATCHING')
          syncError = this.errorCode.PATCH_FAIL;
        var convertString = {
          'sync': syncError,
          'repair': this.errorCode.REPAIR_FAIL,
          'launch': this.errorCode.LAUNCH_FAIL
        };
        var errorCode = convertString[task.name];

        // ignore 'Launch_UnknownCode' this time
        // fix this when we have exit code table
        var skipError = false;
        for (i=0;i<errors.length;i++) {
          if (errors[i].hasOwnProperty('message') && errors[i].message == 'Launch_UnknownCode') {
            skipError = true;
            break;
          }
        }
        if (!skipError) {
          this._callErrorReportHandlers({
            errorCode: errorCode,
            gameID: task.id
          });
        }
      }

      // let's do syncCheck
      workflow.runTask('syncCheck' + task.id, function(a,b){});

    },

    _updateRepositoryStatus: function(sender, info) {
      var instanceId = null;
      var stateFlags = 0;
      var actionFlags = 0;
      var newProgress = 0;
      var repositoryName = '';
      var me = this;

      if (sender.hasOwnProperty('instanceId')) {
        instanceId = sender.instanceId;
      }

      if (info.hasOwnProperty('stateFlags')) {
          stateFlags = info.stateFlags;
      }

      if (info.hasOwnProperty('actionFlags')) {
          actionFlags = info.actionFlags;
      }

      if (info.hasOwnProperty('progress')) {
          newProgress = info.progress * 100.0;
      }

      if (info.hasOwnProperty('name')) {
          repositoryName = info.name;
      }

      var found = $filter('filter')(me.games, {repositoryName: repositoryName}, true);
      if (found && found.length > 0) {
        var id = found[0]['id'];
          var status = new RepositoryState;
          var action = new RepositoryAction;
          var oldState = found[0]['status'];
          var newState = oldState;
          var oldProgress = found[0]['progress'];

          /*
          if ((stateFlags & status.INSTALL) && (actionFlags & action.SYNC))
            newState = me.gamestatus.INSTALLING;
          else if ((stateFlags & status.INSTALL) && !(actionFlags & action.SYNC))
            newState = me.gamestatus.NOT_INSTALLED;
          else if ((stateFlags & status.UPDATE) && (actionFlags & action.SYNC))
            newState = me.gamestatus.PATCHING;
          else if ((stateFlags & status.UPDATE) && !(actionFlags & action.SYNC))
            newState = me.gamestatus.PATCHABLE;
          else if ((actionFlags & action.SYNC))
            newState = me.gamestatus.REPAIRING;
          else
            newState = me.gamestatus.READY_TO_RUN;
          */
          // check pause
          if ( (actionFlags & action.SYNC) && !(actionFlags & action.ACTIVE) )
            newState = me.gamestatus.PAUSED;

          // set new state
          found[0]['status'] = newState;

          // set instanceId
          if (instanceId)
            found[0]['instanceId'] = instanceId;

          // progress
          found[0]['progress'] = newProgress;

          // call handler
          if (oldState != newState || newProgress != oldProgress) {
            this._callUpdateStatusHandlers(id, oldState, newState, newProgress);
          }


          // update view
          //$scope.$apply();
      }
    },

    _setActive: function(id, active) {
      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        var instanceId = found[0]['instanceId'];

        var repository = createRepository(instanceId);
          if (!isNull(repository)) {

              repository.setActive(active);
              repository.release();

              // save/restore old state before pause
              if (active == false) {
                found[0]['savePauseState'] = found[0]['status'];
              } else {
                var oldState = found[0]['status'];
                found[0]['status'] = found[0]['savePauseState'];

                // notify status change
                this._callUpdateStatusHandlers(id, oldState, found[0]['status']);
              }
          }
      }
    },

    // download workflow
    _downloadWorkflow: function() {
      var url = app.getConfig('WorkflowURL', 'http://qa.axt.com:8080/launcher_v2/workflow_direct3');
      var deferred = $q.defer();
      var me = this;

      console.log("workflow: " + url);

      $http({
        method: 'GET',
        url: url
      })
      .success(function (data, status, headers, config) {
        me.workflowLoaded = true;
        //workflow.tasks.tasks = data;
        deferred.resolve(data);

        console.log("load workflow is done.");
      })
      .error(function(data, status, headers, config) {
        deferred.reject(status);
      });

      return deferred.promise;
    },

    // read meta data
    _readMeta: function(data) {
      // preserve current data,
      // and also make sure it add or delete games
      /*
      var _hash = {};
      _hash['a'] = 'b';
      console.log('++++ ====');
      console.dir(_hash);

      for (game in this.games) {
        _hash[game.id] = game['cmdArgument'];
      }

      console.log('==== ====');
      console.dir(_hash);

      // assign first,
      this.games = data.meta.games;

      // and then recover the orverwrite
      for (game in this.games) {
        if (_hash.hasOwnProperty(game.id)) {
          game['cmdArgument'] = _hash[game.id];
        }
      }
      */
      this.games = data.meta.games;
      data.syncLauncher.url = data.syncCheckLauncher.url = app.getConfig('LauncherPatch', 'http://localhost')    // set launcher patchmanifest
      workflow.tasks.tasks = data;
    },

    // update install paths
    /*
    _updateInstallPaths: function(data) {
      // workflow has pre-selected install path
      // target PC registry has user-selected install path
      // here, we replace pre-selected with user-selected
      managedTasks = ['syncCheck', 'sync', 'repair', 'launch'];

      for (var game in this.games) {
        var path =
        for (var task in managedTasks) {


          var taskName = task + game.id
          if (task == 'launcher') {

          } else {
            url
          }
      }
    },
    */

    // initialize workflow engine
    _addObservers: function() {

      var me = this;

      if (me.observersAdded) {
        console.log('observers are already added.');
        return;
      }

      //
      // add PatchController/StateChange observer
      notificationCenter.addObserver('PatchController', 'StateChange', function(sender, info) {
        var status = patchControllerState.nameFromId(info.state);
        var message = host.getLanguageString("PatchControllerState_" + status);
        console.log('******** status from PC: ' + message);

        // associate download object with game
        var id = me._getIdFromPatchManifestURL(sender.url);
        var found = $filter('filter')(me.games, {id: id}, true);
        if (found && found.length > 0) {
          var download = sender.download;
          me.downloadTracker[id] = download;

          // set status message for display purpose
          found[0].statusMessage = message;
        }

        // set status message in game object
        //var game = me._getGameFromDownloadID(sender.download.instanceId);
        //console.dir(game);
        //if (game)
        //  game.statusMessage = message;
      });

      notificationCenter.addObserver('Download', 'StateChange', function(sender, info) {
        var status = downloadState.nameFromId(info.state);
        console.log('status is ' + status);
        var message = host.getLanguageString("DownloadState_" + status);
        console.log('******** status from DL: ' + message);

        // set status message in game object
        var game = me._getGameFromDownloadID(sender.instanceId);
        if (game)
          game.statusMessage = message;
      });

      //
      // add Task/Start notification
      notificationCenter.addObserver('Task', 'Start', function(sender, info) {

        if(debug.all || debug.patch){
          console.log("======== Task Start: {0} ========".format(sender.name));
          console.dir(sender);
          console.dir(info);
        }

        // check if this is syncLauncher
        if (sender.name == 'syncLauncher') {
          me.launcherStatus = me.launcherstatus.PATCHING;
          me._callLauncherStatusHandlers(me.launcherstatus.UNKNOWN, me.launcherstatus.PATCHING);
          return;
        }

        // parse task name into (name, id)
        task = me._parseTaskName(sender, info);

        if (task) {

            // add instance observer if this is add task
            me.taskTracker[sender.instanceId] = task;

            // set game status from TaskStart event (updateNeeded, installNeeded, patchNeeded)
            me._checkGameUpdateStatusWithTaskStart(task);
        }

      });

      //
      // add Task/Complete notification
      notificationCenter.addObserver('Task', 'Complete', function(sender, info) {

        if(debug.all || debug.patch){
          console.log("======== Task Complete: {0} ========".format(sender.name));
          console.dir(sender);
          console.dir(info);
        }

        var success = !sender.hasError(null); // && sender.isComplete();

        if (!success) {
          console.log(":::::::: task '{0}' ended with error ::::::::".format(sender.name));
          console.log("errors: " + JSON.stringify(sender.errors));
        }

        // check if this is launcher update
        if (sender.name == 'syncLauncher') {

          if (!success) {
            // report error
            this._callErrorReportHandlers({
              errorCode: this.errorCode.LAUNCHER_UPDATE_FAIL,
              gameID: null
            });
          }

          // ignore failure case and just go on.
          me.launcherStatus = me.launcherstatus.READY;
          me._callLauncherStatusHandlers(me.launcherstatus.PATCHING, me.launcherstatus.READY);
          return;
        }

        if (me.taskTracker[sender.instanceId]) {
            var task = me.taskTracker[sender.instanceId];
            me._checkGameUpdateStatusWithTaskComplete(task, success, sender.errors);
            delete me.taskTracker[sender.instanceId];
        }

      });

      //
      // add TaskView/WillUpdateProgress
      notificationCenter.addObserver('TaskView', 'WillUpdateProgress', function(sender, info) {
        if(debug.all || debug.patch){
          console.log("======== TaskView WillUpdateProgress ========");
          console.dir(sender);
          console.dir(info);
        }

        // test
        sender.normalizeProgress = true;
        if (info.hasOwnProperty('percent')) {
          // check if this is launcher
          if (app.getConfig('LauncherPatch', '') == sender.controller.url) {
            var state = me.launcherStatus;
            me._callLauncherStatusHandlers(state, state, info.percent);
          } else {
            var id = me._getIdFromPatchManifestURL(sender.controller.url);
            var found = $filter('filter')(me.games, {id: id}, true);
            if (found && found.length > 0) {
              var oldState = found[0]['status'];
              var newState = oldState;
              found[0]['progress'] = info.percent;
              me._callUpdateStatusHandlers(id, oldState, newState, info.percent);

              var download = sender.controller.download;
              me.downloadTracker[id] = download;
            }
          }
        }

        // check if insufficient space error
        // This is not a good place for it,
        // But patch task returns no error in any error cases.
        if (sender.controller.download.getLastError() == 4) {
          me._callErrorReportHandlers({
            errorCode: me.errorCode.INSUFFICIENT_SPACE,
            gameID: id
          });
        }


        //Below is not for this task
        //me._updateRepositoryStatus(sender, info);
        /*
        var download = sender.controller.download;
        console.log("session_state: {0} state: {1} state_progress: {2} accessible: {3}".format(download.getSessionState(),
          download.getState(), download.getStateProgress(), download.getAccessible()));
        var totalBytes = download.getTotalBytes();
        var bytesLeft = download.getBytesLeft();
        if (totalBytes > 0) {
          var progress = (totalBytes - bytesLeft) * 100.0 / totalBytes;
          var id = me._getIdFromPatchManifestURL(sender.controller.url);
          var found = $filter('filter')(me.games, {id: id}, true);
          if (found && found.length > 0) {
            var oldState = found[0]['status'];
            var newState = oldState;
            found[0]['progress'] = progress;
            me._callUpdateStatusHandlers(id, oldState, newState, progress);
          }
        }
        */

        // Let's deal with progress
        // this comes from TaskView and it has patch manifest URL
        // so we get id from it
        //var id = me._getIdFromPatchManifestURL(sender.controller.url);
        //var progress = info.percent / 100.0;
        //var found = $filter('filter')(me.games, {id: id}, true);
        //console.dir(found);


        //
        // manipulate downloadTracker
        // downloadTracker
        //   id : => download object

      });

      /*
      //
      // add Patch/StateChange
      notificationCenter.addObserver('Patch', 'StateChange', function(sender, info) {


        console.log("======== Patch StateChange ========");
        console.dir(sender);
        console.dir(info);

        console.log("from: {0} to: {1}".format(patchState.nameFromId(info.previousState), patchState.nameFromId(info.state)));
      });

      //
      // PatchView
      notificationCenter.addObserver('PatchController', 'Complete', function(sender, info) {
        console.log("======== PatchController Complete ========");
        console.dir(sender);
        console.dir(info);
      });

      //
      // PatchController / StateChange
      notificationCenter.addObserver('PatchController', 'StateChange', function(sender, info) {
        console.log("======== PatchController StateChange ========");
        console.dir(sender);
        console.dir(info);
      });

      //
      // PatchView / Bind
      notificationCenter.addObserver('PatchView', 'Bind', function(sender, info) {
        console.log("======== PatchView Bind ========");
        console.dir(sender);
        console.dir(info);
      });
      */

      // set flag to prevent multiple execution
      me.observersAdded = true;
    },

    _updateLauncher: function() {
      var deferred = $q.defer();

      workflow.runTask('syncCheckLauncher', function(sender, info) {
        if (!sender.hasError(null) && sender.isComplete())
          deferred.resolve();
        else
          deferred.reject(sender.getLastErrorMessage());
      });

      return deferred.promise;
    },

    _checkRepositoryStatus: function() {
      var deferred = $q.defer();
      var me = this;

      if (this.allGameRepositoryStatusCheckDone) {
        // we did this already and was succeeded
        deferred.resolve();
        return deferred.promise;
      }

      workflow.runTask('syncCheckGroup', function(sender, info) {
        if (!sender.hasError(null) && sender.isComplete()) {
          me.allGameRepositoryStatusCheckDone = true;
          deferred.resolve();
        } else {
          deferred.reject(sender.getLastErrorMessage());
        }
      });

      return deferred.promise;
    },

    _checkExecution: function(me) {
      // Using only launch task only doesn't guarantee 100%
      // - launcher can be terminated while game is running and then restarted
      // - or in some cases, the waiting for the game executable ends without any reason
      // So, we need to run timer for regularly check game execution
      // If a certain game has checkExecution%d task in its workflow,
      // we do check for the game.

      //console.log('checking running...');

      for (var i=0;i<me.games.length;i++) {
        game = me.games[i];
        if (workflow.tasks.tasks.hasOwnProperty('checkExecution' + game.id)) {
          // it has checkExecution task, so we do it
          workflow.runTask('checkExecution' + game.id, function(a,b){});
        }
      }
    },

    _checkPlayable: function(id, handler, options) {
      var me = this;
      var taskName = "launch" + id;
      var launchTask = workflow.tasks.tasks[taskName];
      var argument = null;
      var boolIOVationDone = false;
      var boolArgumentDone = false;

      // condition 1: IOVation check for this game
      loginManager.checkIOVationForGame(id,
        function () {
          boolIOVationDone = true;

          if (boolIOVationDone && boolArgumentDone) {
            boolIOVationDone = false;
            // both conditions met
            console.log('run with argument: ' + argument);
            me._play(id, argument, handler, options);
          }
        },
        function (message) {
          me._callErrorReportHandlers({
            errorCode: me.errorCode.LAUNCH_IOVATION_DENY,
            gameID: id,
            message: message
          });
        },
        function (code) {
          me._callErrorReportHandlers({
            errorCode: me.errorCode.GENERIC_FAIL_RETRYABLE,
            gameID: id,
            code: code
          });
        }
      );

      // condition 2: commandline option
      if ( (typeof launchTask) != 'undefined' && launchTask != null ) {
        var runMethod = launchTask.runMethod;

        if ( (typeof runMethod) != 'undefined' && runMethod != null ) {

          // fetch argument
          // get commandline options
          var _url = app.getConfig('APIBaseURL', 'http://10.63.75.199:8080/api/public');
          oauthManager.sendRequest({
            method: 'GET',
            url: _url + runMethod.url, //'/launcher_v2/commandline_option',
            dataType: 'json',
            params: {game_id: id},
            headers: {
              "Content-Type": "application/json"
            }
          }).then(
            function(response) {
              if (response.data.success) {
                boolArgumentDone = true;
                argument = response.data.info.custom.commandline_option;

                if (boolIOVationDone && boolArgumentDone) {
                  boolArgumentDone = false;
                  console.log('run with argument: ' + argument);
                  me._play(id, argument, handler, options);
                }
              } else {
                me._callErrorReportHandlers({
                  errorCode: me.errorCode.LAUNCH_ARGUMENT_LOGIC_FAIL,
                  gameID: id
                });
              }
            },
            function(response) {
              // launch task doesn't have runMethod field
              me._callErrorReportHandlers({
                errorCode: me.errorCode.LAUNCH_ARGUMENT_GENERIC_FAIL,
                gameID: id
              });
            }
          );
          return;
        }
      }

      // launch task doesn't have runMethod field
      me._callErrorReportHandlers({
        errorCode: this.errorCode.LAUNCH_TASK_MISSING,
        gameID: id
      });
    },

    _play: function(id, argument, handler, options) {
      var me = this;
      var taskName = "launch" + id;
      var found = $filter('filter')(this.games, {id: id}, true);
      var game;

      if (found && found.length > 0) {
        game = found[0];
        if (typeof game.commandOption == "undefined")
          game.commandOption = []      
      }

      var argument_final = argument;

      if ( (typeof options != 'undefined') && options != null )
        argument_final = argument_final + " " + options;

      if (game) {
        for (i=0;i<game.commandOption.length;i++) {
          argument_final = argument_final + " " + game.commandOption[i].value;
        }
      }

      workflow.tasks.tasks[taskName]['arguments'] = argument_final;
      workflow.runTask(taskName, function(sender, info){
        if ( (typeof handler != 'undefined') && handler != null) {
          var success = !sender.hasError(null) && sender.isComplete();
          handler(id, success);
        }
      });

      // let login manager know it's about to run gmae
      loginManager.onGameRun(id);

      // pause all other activities
      this._pauseAll();
    },

    _pauseAll: function() {
      for (i=0;i<this.games.length;i++) {
        this.pause(this.games[i].id);
      }
    },

    _checkActionAllowed: function(id, action) {
      var s = this.gamestatus;
      var allowed = {
        play: [s.READY_TO_RUN],
        install: [s.NOT_INSTALLED],
        patch: [s.PATCHABLE],
        repair: [s.READY_TO_RUN],
        pause: [s.INSTALLING, s.PATCHING, s.REPAIRING],
        resume: [s.PAUSED]
      };

      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        var status = found[0].status;
        if (allowed.hasOwnProperty(action)) {
          var alloweds = allowed[action];

          for (var i=0;i<alloweds.length;i++) {
            if (alloweds[i] == status) {
              // matched
              return true;
            }
          }
        }
      }

      console.log('requested {0}, but not allowed because current state is {1}'.format(action, status));
      return false;
    },

    // *****************************************************************************************
    // shortcut related
    // *****************************************************************************************

    createShortcut: function(id) {
      // id: target game_id
      var game = null;
      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        game = found[0];
      }

      // confirm we have target game
      if (game == null) {
        console.log('could not create shortcut because game with id={0} does not exit'.format(id));
        return false;
      }

      // gather information about target game
      var executable = app.expandString("{ModulePath}launcher.exe".format());
      var parameter = game.name.toLowerCase();
      var name = game.name;

      // get environment
      var env = app.getConfig('Environment', '');
      if (env == 'production') env = '';
      if (env != '') env = ' ' + env;

      // apply name modifier
      name = name + env;

      // call platform and return what it retuns
      return platform.createShortcut(executable, parameter, 0, app.expandString("{UserDesktop}"), name);
    },

    removeShortcut: function(id) {
      // id: target game_id
      var game = null;
      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        game = found[0];
      }

      // confirm we have target game
      if (game == null) {
        console.log('could not remove shortcut because game with id={0} does not exit'.format(id));
        return false;
      }

      // gather information about target game
      var name = game.name;

      // get environment
      var env = app.getConfig('Environment', '');
      if (env == 'production') env = '';
      if (env != '') env = ' ' + env;

      // apply name modifier
      name = name + env;

      // call platform and return what it retuns
      return platform.removeShortcut(app.expandString("{UserDesktop}"), name);
    },

    // *****************************************************************************************
    // register uninstall info
    // *****************************************************************************************
    setupUninstall: function(id) {
      // id: target game_id
      var game = null;
      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        game = found[0];
      }

      // confirm we have target game
      if (game == null) {
        console.log('could not register uninstall info because game with id={0} does not exit'.format(id));
        return false;
      }

      // confirm we have uninstall info available
      if ( ((typeof game.uninstallInfo) == 'undefined') || game.uninstallInfo == null) {
        console.log('could not register uninstall info because no uninstall info available.');
      }

      // gather information about target game
      var path = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\EME_GAME_{0}".format(game.name.toLowerCase());

      var uninstallString = app.expandString("{ModulePath}{ModuleFile} uninstall_{0}".format(game.name.toLowerCase()));
      // try {
      //   var fromMeta = JSON.parse(game.uninstallInfo);
      // } catch (e) {
      //   console.log('could not parse uninstall info: {0}'.format(game.uninstallInfo));
      //   console.dir(game.uninstallInfo);
      //   return false;
      // }
      var uninstallInfo = game.uninstallInfo;
      var displayIcon = app.expandString("{ModulePath}{0}".format(uninstallInfo.DisplayIcon));
      // replace '/' with '\\'
      while ( (next = displayIcon.replace("/", "\\")) != displayIcon ) {displayIcon = next;}

      var keyValues = {
        DisplayIcon: displayIcon,
        DisplayName: uninstallInfo.DisplayName,
        EstimatedSize: uninstallInfo.EstimatedSize,
        InstallDate: this._getDateString(),
        NoModify: 1,
        NoRepair: 1,
        QuietUninstallString: uninstallString,
        UninstallString: uninstallString,
        Publisher: uninstallInfo.Publisher
      };

      console.dir(keyValues);

      // register
      for (var key in keyValues) {
        value = keyValues[key];
        if (typeof value == 'number') {
          platform.setRegistryInt32("default", "default", "user", path, key, value);
        } else {
          platform.setRegistryString("default", "default", "user", path, key, value);
        }
      }
    },

    uninstall: function(id) {
      // id: target game_id
      var game = null;
      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        game = found[0];
      }

      // confirm we have target game
      if (game == null) {
        console.log('could not uninstall because game with id={0} does not exit'.format(id));
        return false;
      }

      // delete game folder
      var path = app.expandString("{ModulePath}{0}".format(game.name.toLowerCase()));
      var rtn = platform.directoryErase(path);

      // delete registry keys
      if (rtn == 0) {
        var path = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\EME_GAME_{0}".format(game.name.toLowerCase());
        rtn = platform.registryDeleteKey('default', 'user', path);
      }

      // delete shortcut
      if (rtn) {
        rtn = this.removeShortcut(id);
      }

      // refresh game status
      workflow.runTask('syncCheck' + task.id, function(a,b){});

      return rtn;
    },

    _getDateString: function() {
      var me = new Date();
      var mm = (me.getMonth() + 1).toString(); // getMonth() is zero-based
      var dd = me.getDate().toString();

      return [me.getFullYear(), mm.length===2 ? '' : '0', mm, dd.length===2 ? '' : '0', dd].join(''); // padding
    },

    setStage: function(id, stageName) {
      var game = null;
      var found = $filter('filter')(this.games, {id: id}, true);
      if (found && found.length > 0) {
        game = found[0];
      }

      if (game == null) {
        console.log('could not find game with id=' + id);
        return null;
      }
      
      var stages = game.stages;

      // search for the stage
      for (i=0; i< game.stages.length; i++) {
        stage = game.stages[i]
        if (stageName == stage.name) {
          this._setStage(game, stage);
        }
      }
    },

    _setStage: function(game, stage) {

      // step 1: set url attribute for the target tasks
      for (i=0;i<stage.urlChanges.length;i++) {
        var taskName = stage.urlChanges[i] + game.id;
        if (workflow.tasks.tasks.hasOwnProperty(taskName)) {
          workflow.tasks.tasks[taskName].url = stage.url;
        }
      }

      // step 2: set launcher attribute
      var launchTaskName = 'launch' + game.id;
      if (workflow.tasks.tasks.hasOwnProperty(launchTaskName)) {
        for (i=0;i<Object.keys(stage.launch).length; i++) {
          key = Object.keys(stage.launch)[i];
          value = stage.launch[key];
          workflow.tasks.tasks[launchTaskName][key] = value; 
        }
      }

      // step 3: set checkExecution attribute
      var checkExecutionTaskName = 'checkExecution' + game.id;
      if (workflow.tasks.tasks.hasOwnProperty(checkExecutionTaskName)) {
        for (i=0;i<Object.keys(stage.checkExecution).length; i++) {
          key = Object.keys(stage.checkExecution)[i];
          value = stage.checkExecution[key];
          workflow.tasks.tasks[checkExecutionTaskName][key] = value; 
        }
      }

      // step 4: run syncCheck
      workflow.runTask('syncCheck' + game.id, function(a,b) {});
    }
  };

  return patchManager;
}]);