//
// root controller is starting controller
//
launcherApp.controller('startCtrl', ['$scope', '$state', 'patchManager', 'steamManager', 'oauthManager', 'systemManager', 'gameManager', 'ngDialog',
  function ($scope, $state, patchManager, steamManager, oauthManager, systemManager, gameManager, ngDialog) {

    $scope.updating = false;
    $scope.showContents = false;
    $scope.progress = 0;

    // message to display
    $scope.messageDisplay = "";

    //
    $scope.moveToMain = function() {
      // let steamManager tell us it's steam version or not
      if (steamManager.isSteamRunning())
        $state.go('steam');
      else
        $state.go('regular');
    };

    //
    $scope.checkPatch = function() {
      // initialize patchManager
      $scope.messageDisplay = "Checking New Patches.";
      $scope.updateUI();
      $scope.moveToMain();
      patchManager.initialize().then(
        function() { /*$scope.moveToMain();*/ },
        function(reason) {
          console.log('launcher initialization failed.');
          alert("Launcher could not start.\n\nreason: " + reason);
          app.closeAll();
        }
      );
    };

    $scope.allowLogin = function() {
      $state.go('.signin');
    };

    $scope.setSize = function(width, height) {
      $scope.$parent.setSize(width, height);

      // remember size for checking we're on latest launcher binary
      // if not, we're not showing progress window
      $scope.width = width;
      $scope.height = height;
    };

    $scope.getVersion();


    //
    // document ready BEGINS
    //
    $(document).ready(function() {
      console.log('document ready');

      // just checking what interop has loaded
      notificationCenter.addObserver("Interop", "DidLoad", function(sender, info) {
        console.log('interop didload: ' + info.name);
      });

      // catch workflow::didLoad event and create steamSupport object
      var loadWorkflowObs = notificationCenter.addObserver("Workflow", "DidLoad", function(sender, info) {
        loadWorkflowObs.release();
        console.log('workflow did load');

        // check launcher update
        $scope.messageDisplay = "Checking launcher update."
        patchManager.updateLauncher(
          function() {
            // launcher will update
            console.log('launcher will be updated.');

            // set background opaque
            //document.body.style.background = 'transparent';

            // show text and progress
            // old version launcher executable has fixed size (1100 * ???) and won't change
            // in that case, let's hide progress window.
            console.log('stored size = ({0}, {1})'.format($scope.width, $scope.height));
            console.log('current size = ({0}, {1})'.format(systemManager.getWindowWidth(), systemManager.getWindowHeight()));
            if (systemManager.getWindowWidth() == $scope.width && systemManager.getWindowHeight() == $scope.height) {
              console.log('launcher binary is up to date, so now showing update dialog.');
              $scope.showContents = true;
              $scope.updateUI();
            } else {
              console.log('launcher binary not support variable size, so hide update dialog.');
            }

            // set update flag to true
            $scope.updating = true;

            patchManager.setLauncherStatusHandler("startCtrl", function (oldState, newState, progress) {
              if (progress != null && typeof progress != 'undefined') {
                $scope.messageDisplay = "Updating launcher... {0} %".format(progress);
                var elem = document.getElementById("myBar");
                elem.style.width = progress + '%';

                /*
                $scope.progress = progress;
                $scope.progressText = progress + "%";
                */
              }
              if (newState == 'ready') {
                $scope.messageDisplay = 'Launcher will be restarted.';
                $scope.updating = false;
              }
              $scope.updateUI();
            });
          },
          function() {
            // launcher is up to date
            console.log('launcher is up to date.');

            // initialize steamManager
            $scope.messageDisplay = "Initializing.";
            steamManager.initialize();

            // initialize gameManager
            gameManager.initialize();

            // check if patches for games are available
            $scope.checkPatch();
          },
          function(error_code) {
            //
            console.log('error. quiting...');
            alert('Launcher has encountered unspecified error(C0007). Please try another time.');
            app.closeAll();
          }
        );
      });
    });
    //
    // document ready ENDS
    //
  }
]);