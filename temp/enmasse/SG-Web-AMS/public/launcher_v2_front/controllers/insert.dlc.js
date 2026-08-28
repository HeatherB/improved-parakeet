launcherApp.controller('DLCCtrl', ['$scope', '$state', 'steamManager', 'patchManager',
  function ($scope, $state, steamManager, patchManager) {
    //
    // DLC related BEGINS
    //

    // steamManager should have been initialized at document ready event
    $scope.steamUserId = steamManager.getSteamUserID();

    //
    // keeps running while game runs checking new DLC is ready to go
    DlcInstalledChecker = function() {
      var self = this;

      self.checker_interval = null;
      self.dlc_info_list = [];
      self.dlc_installed_callback = null;
      self.dlc_uninstalled_callback = null;

      self.clear = function () {
        self.dlc_info_list = [];
      };

      self.add = function (dlc_data, installed) {
        self.dlc_info_list.push({dlc_data:dlc_data, installed:installed});
      };

      self.start = function() {
        self.stop();
        self.checker_interval = setInterval(function () { self.checkDlcInstalled() }, 1000);
      };

      self.stop = function() {
        if (self.checker_interval) {
          clearInterval(self.checker_interval);
          self.checker_interval = null;
        }
      };

      self.checkDlcInstalled = function() {
        if ($scope.steamUserId) {
          for (var i = 0; i < self.dlc_info_list.length; i++) {
            var dlc_info = self.dlc_info_list[i];
            if (steamSupport.steam_is_dlc_installed(dlc_info.dlc_data.dlc_id) == "true") {
              if (dlc_info.installed == false) {
                dlc_info.installed = true;
                if (self.dlc_installed_callback)
                  self.dlc_installed_callback(dlc_info.dlc_data);
              }
            }
            else {
              if (dlc_info.installed == true) {
                dlc_info.installed = false;
                if (self.dlc_uninstalled_callback)
                  self.dlc_uninstalled_callback(dlc_info.dlc_data);
              }
            }
          }
        }
      };
    };
    $scope.dlcInstalledChecker = new DlcInstalledChecker();

    //
    // activate DLCs in AMS BEGINS
    $scope._steamActivateDLC = function(dlc_id_list, nextOperation) {
      //_updateStatusText("Activating DLCs ...");
      gameID = patchManager.getGameFromSteam(steamManager.getSteamAppID()).id;

      steamManager.activateSteamDLC(dlc_id_list, gameID).then(
        function() {
          console.log("activated {0} DLCs.".format(dlc_id_list.length));
          //_updateStatusText("Success in activating DLCs");
          setTimeout(nextOperation, 1000);
        },
        function(code) {
          console.log("error on activate_steam_dlc: " + code);
          //_updateStatusText("Fail to activate DLCs");
          setTimeout(nextOperation, 1000);
        }
      );

      // loginIFrame.jQuery.ajax({
      //   type: 'POST',
      //   url: '/launcher/' + loginIFrame.GAME_ID + '/activate_steam_dlc',
      //   async: true,
      //   timeout: 10000,
      //   data: {
      //     dlc_id_list: dlc_id_list
      //   },
      //   success: function(data) {
      //     setTimeout(function() {
      //       if (data["result-message"] == "ok") {
      //         console.log("Success in activate_steam_dlc");
      //         _updateStatusText("Success in activating DLCs");
      //         setTimeout(nextOperation, 1000);
      //       }
      //       else {
      //         console.log("Fail to execute activate_steam_dlc: {0}".format(data["result-message"]));
      //         _updateStatusText("Fail to activate DLCs");
      //         setTimeout(nextOperation, 1000);
      //       }
      //     }, 1000);
      //   }
      // }).fail(function(xhr, status, error) {
      //   console.log("Fail to execute activate_steam_dlc: {0}".format(error));
      //   _updateStatusText("Fail to activate DLCs");
      //   setTimeout(nextOperation, 1000);
      // });
    };
    // activate DLCs in AMS ENDS
    //

    //
    // check and get list of DLCs that require processing BEGINS
    $scope._steamCheckDLCActivated = function(dlc_list, nextOperation) {
      console.log("DLC checker started.");

      var dlc_id_list;
      steamManager.checkSteamDLCActivated(
        dlc_list,
        function(notActivatedList) {
          dlc_id_list = notActivatedList;

          console.log("got {0} DLCs to be activated.".format(dlc_id_list.length));
          $scope._steamActivateDLC(dlc_id_list, nextOperation);
        },
        function() {
          console.log("no pending DLCs.");
          nextOperation();
        },
        function(code) {
          console.log("error on checking DLCs: {0}.".format(code));
          console.log("stopped.");

          //_updateStatusText("Fail to check dlc activated");
          nextOperation();
        }
      );

      // loginIFrame.jQuery.ajax({
      //     type: 'POST',
      //     url: '/launcher/' + loginIFrame.GAME_ID + '/check_steam_dlc_activated',
      //     async: true,
      //     timeout: 10000,
      //     data: {
      //         dlc_list: dlc_list
      //     },
      //     success: function(data) {
      //         if (data["result-message"] == "ok") {
      //             console.log("Success in check_steam_dlc_installed");
      //             console.log("Stop checking DLC activated");
      //             _updateStatusText("");

      //             var dlc_names = "";
      //             var dlc_id_list = [];
      //             for(var i = 0; i < data.dlc_list.length; i++) {
      //                 var dlc = data.dlc_list[i];
      //                 console.log(dlc);
      //                 if (dlc.activated == false && dlc.will_be_activated == false) {
      //                     dlc_names += "<br/> {0}. {1}".format(i+1, dlc.name)
      //                     dlc_id_list.push(dlc.dlc_id);
      //                 }
      //             }

      //             if (dlc_id_list.length > 0) {
      //                 console.log("{0} dlcs are to be activated".format(dlc_id_list.length));
      //                 _steamActivateDLC(dlc_id_list, nextOperation);

      //                 // $("<div>You have following DLCs to be activated." + dlc_names + "</div>").dialog({
      //                 //     minWidth: 500,
      //                 //     dialogClass: "no-close",        // hide close button
      //                 //     buttons: {
      //                 //         "OK": function () {
      //                 //             $(this).dialog("close");
      //                 //             // activate dlc
      //                 //             _steamActivateDLC(dlc_id_list, nextOperation);
      //                 //         }
      //                 //     },
      //                 //     title: "Activating DLC",
      //                 //     draggable: false,
      //                 //     close: function(event, ui) {
      //                 //         nextOperation();
      //                 //     }
      //                 // });
      //             }
      //             else {
      //                 console.log("no dlc is to be activated");
      //                 nextOperation();
      //             }
      //         }
      //         else {
      //             console.log("Fail to execute check_steam_dlc_activated: {0}".format(data['result-message']));
      //             _updateStatusText("Fail to check dlc activated");
      //             nextOperation();
      //         }
      //     }
      // }).fail(function(xhr, status, error) {
      //     console.log("Fail to execute check_steam_dlc_activated: {0}".format(error));
      //     console.log("Stop checking DLC activated");

      //     _updateStatusText("Fail to check dlc activated");
      //     nextOperation();
      // });
    };
    // check and get list of DLCs that require processing ENDS
    //

    //
    // check if user has active DLC in Steam side BEGINS
    $scope._steamCheckDLC = function(nextOperation) {
        if ($scope.steamUserId) {
            var count = parseInt(steamSupport.steam_get_dlc_count());
            var installed_dlc_list = [];

            console.log("start checking DLC installed, count={0}".format(count));

            $scope.dlcInstalledChecker.clear();
            for (var index = 0; index < count; index ++) {
                var dlc_data = steamSupport.steam_get_dlc_data(index);
                if (dlc_data != "false") {
                    if (steamSupport.steam_is_dlc_installed(dlc_data.dlc_id) == "true") {
                        installed_dlc_list.push(dlc_data);
                        $scope.dlcInstalledChecker.add(dlc_data, true);
                        console.log("DLC '{0}' installed".format(dlc_data.name));
                    }
                    else {
                        $scope.dlcInstalledChecker.add(dlc_data, false);
                        console.log("DLC '{0}' not installed".format(dlc_data.name));
                    }
                }
            }

            console.log("stop checking DLC installed");

            $scope.dlcInstalledChecker.dlc_installed_callback = function(dlc_data) {
                console.log("DLC {0} INSTALLED".format(dlc_data.dlc_id));
                //var old_status = _getStatusText();
                $scope._steamCheckDLCActivated([dlc_data], function() {
                    //_updateStatusText(old_status);
                });
            };

            $scope.dlcInstalledChecker.dlc_uninstalled_callback = function(dlc_data) {
                console.log("DLC {0} UNINSTALLED".format(dlc_data.dlc_id));
            };

            var nextOperationEx = function () {
                // start to check whether there is a new dlc installed
                $scope.dlcInstalledChecker.start();

                // execute next operation
                nextOperation();
            };

            if (installed_dlc_list.length > 0) {
                // Query AMS
                //_updateStatusText("Checking DLC activated");

                $scope._steamCheckDLCActivated(installed_dlc_list, nextOperationEx);
            }
            else {
                nextOperationEx();
            }
        }
        else {
            nextOperation();
        }
    };
    // check if user has active DLC in Steam side ENDS
    //


    //
    // DLC related ENDS
    //


    //
    //
    $scope.start = function() {
      // check and process DLCs
      $scope._steamCheckDLC(function() {});
    };

    //
    //
    $scope.start();
  }
]);