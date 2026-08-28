// global define
var debug  = { 'all': false, 'patch': false, 'game': true };

// Disable selection on whole window
document.onselectstart = function() { return false; };

// Disable dragging on the whole window
document.ondragstart = function() { return false; };

//
// BRIDGE BEGINS (this part should be here for Direct3 to work correctly)
//
(function() {
    notificationCenter.addObserver("WebGetAuthenticateView", "Bind", function(sender, view) {
        view.rootElement = $("#webAuthenticateModal");
        view.serverElement = view.rootElement.find(".server");
        view.portElement = view.rootElement.find(".port");
        view.realmElement = view.rootElement.find(".realm");
        view.usernameElement = view.rootElement.find("input[name=username]");
        view.passwordElement = view.rootElement.find("input[name=password]");
        view.errorElement = view.rootElement.find("h2");
        view.cancelElement = view.rootElement.find(".modalCancel");
    });

    notificationCenter.addObserver("SkinWindowView", "Bind", function(sender, view) {
        view.rootElement = $("body");
        view.errorElement = $("#statusText span");
    });

    notificationCenter.addObserver("OptionsView", "Bind", function(sender, view) {
        view.rootElement = $("#settings");
        view.protocolsElement = view.rootElement.find("select[name=downloadMethod]");
        view.maxUploadRateElement = view.rootElement.find("select[name=maxUploadSpeed]");
        view.maxDownloadRateElement = view.rootElement.find("select[name=maxDownloadSpeed]");
    });

    notificationCenter.addObserver("DebugOptionsView", "Bind", function(sender, view) {
        view.rootElement = $("#support");
        view.fileElement = $("#debugFile");
        view.consoleElement = $("#debugConsole");
    });

    notificationCenter.addObserver("DownloadView", "Bind", function(task, view) {
        view.rootElement = $("#footer");
        view.statusElement = view.rootElement.find(".downloadStatus");
        view.deliveryMethodElement = view.rootElement.find(".downloadP2PEnabled");
        view.timeEstElement = view.rootElement.find(".downloadTimeRemaining");
        view.bytesLeftElement = view.rootElement.find(".downloadBytesRemaining");
        view.transferSpeedElement = view.rootElement.find(".downloadTotalDownloadSpeed");
        view.progressBarElement = view.rootElement.find(".downloadProgress");
        view.progressElement = view.rootElement.find(".downloadPercent");
        view.pauseElement = view.rootElement.find(".downloadPauseResume");
        view.resumeElement = view.rootElement.find(".downloadPauseResume");
    });

    notificationCenter.addObserver("PatchView", "Bind", function(task, view) {
        view.rootElement = $("#footer");
        view.statusElement = view.rootElement.find(".patchStatus");
        view.timeEstElement = view.rootElement.find(".patchTimeRemaining");
        view.bytesLeftElement = view.rootElement.find(".patchBytesRemaining");
        view.transferSpeedElement = view.rootElement.find(".patchWriteSpeed");
        view.progressBarElement = view.rootElement.find(".patchProgress");
        view.progressElement = view.rootElement.find(".patchPercent");
        view.patchesLeftElement = view.rootElement.find(".patchesLeft");
        view.titleElement = view.rootElement.find(".patchTitle");
        view.repairElement = $("#repairModal .modalOk");
        view.launchElement = $("#buttonLaunch");

        // Assume the allowPartial denotes a launcher task - don't allow the state to be set for the launch button
        if (hasOwnProperty(task.args, "allowPartial") && task.args.allowPartial === false) {
            notificationCenter.addInstanceObserver("PatchController", "Complete", task.controller, function(controller) {
                view.rootElementClass.apply(null);
            });
        }
    });

    notificationCenter.addObserver("PerformanceView", "Bind", function(sender, view) {
        view.incomingAvgSpeedElement = $("#incomingSpeed .avgSpeed");
        view.outgoingAvgSpeedElement = $("#outgoingSpeed .avgSpeed");
        view.incomingCurSpeedElement = $("#incomingSpeed .curSpeed");
        view.outgoingCurSpeedElement = $("#outgoingSpeed .curSpeed");
        view.incomingMaxSpeedElement = $("#incomingSpeed .maxSpeed");
        view.outgoingMaxSpeedElement = $("#outgoingSpeed .maxSpeed");
        view.graphElement = $("#downloadGraph");
    });

    notificationCenter.addObserver("Download", "WillBrowseForFolder", function(sender, info) {
        info.folder = skinWindow.browseForFolder(host.getLanguageString("Download_BrowseForFolder"), info.folder);
    });
} ());
//
// BRIDGE ENDS
//


//
// facebook BEGINS
//
// set facebook initialize function
// window.fbAsyncInit = function() {
//   console.log('Facebook JS SDK initialized.');
//   FB.init({
//     appId      : app.getConfig('FacebookAppID', '589750687728241'),
//     cookie     : true,  // enable cookies to allow the server to access
//                         // the session
//     xfbml      : true,  // parse social plugins on this page
//     version    : 'v2.5' // use graph api version 2.5
//   });
// };

// //
// // load the SDK asynchronously
// (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s); js.id = id;
//   js.src = "//connect.facebook.net/en_US/sdk.js";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));
//
// facebook ENDS
//

// define application
var launcherApp = angular.module('launcherApp', ['ui.router', 'ngDialog', 'ngAnimate', 'anim-in-out'])
.factory('$FB',['$window', '$q', function($window, $q){
  // data stored here exists only once per app
  var loaded = $q.defer();

  return {
    init: function(){
      $window.fbAsyncInit = function() {
        console.log('Facebook JS SDK initialized.');
        FB.init({
          appId: app.getConfig('FacebookAppID', '589750687728241'),
          cookie: true,
          version: 'v2.5',
          xfbml: true
        });
        loaded.resolve($window.FB);
      };
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "js/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    },
    getFB: function(){
      return loaded.promise;
    }
  };
}])
.config(function ($stateProvider, $urlRouterProvider) {

  //
  // route rule BEGINS

  // for unmatched default url
  //$urlRouterProvider.otherwise("/start");

  $stateProvider

    // regular launcher
    .state('regular', {
      url: '/regular',
      templateUrl: 'views/regular.main.html',
      controller: 'regularMainCtrl',
      resolve: {
        FB: ['$FB', function($FB){
          return $FB.getFB();
        }]
      }
    })

    .state('regular.games', {
      url: '/regular/games',
      templateUrl: 'views/regular.games.html',
      controller: 'regularGameCtrl'
    })

    .state('regular.signin', {
      url: '/regular/signin',
      templateUrl: 'views/regular.signin.html',
      params: { instantResize: false },
      controller: 'regularSignInCtrl'
    })

    .state('regular.signup', {
      url: '/regular/signup',
      templateUrl: 'views/regular.signup.html',
      controller: 'regularSignUpCtrl'
    })

    .state('regular.activation', {
      url: '/regular/activation',
      templateUrl: 'views/regular.activation.html',
      controller: 'regularActivationCtrl'
    })

    .state('regular.qna', {
      url: '/regular/qna',
      templateUrl: 'views/regular.qna.html',
      controller: 'regularQnACtrl'
    })

    .state('regular.armor', {
      url: '/regular/armor',
      templateUrl: 'views/regular.armor.html',
      controller: 'regularArmorCtrl'
    })

    .state('regular.terms', {
      url: '/regular/terms',
      templateUrl: 'views/regular.terms.html',
      controller: 'regularTermsCtrl'
    })

    // -------- games -------- //
    .state('regular.games.ava', {
      url: '/regular/games/ava',
      templateUrl: 'views/regular.ava.html',
      params: { instantResize: false },
      controller: 'regularAVACtrl'
    })

    .state('regular.games.tera', {
      url: '/regular/games/tera',
      templateUrl: 'views/regular.tera.html',
      params: { instantResize: false },
      controller: 'regularTERACtrl'
    })

    .state('regular.games.zmr', {
      url: '/regular/games/zmr',
      templateUrl: 'views/regular.zmr.html',
      params: { instantResize: false },
      controller: 'regularZMRCtrl'
    })

    .state('regular.games.kritika', {
      url: '/regular/games/kritika',
      templateUrl: 'views/regular.kritika.html',
      params: { instantResize: false },
      controller: 'regularKRITIKACtrl'
    })

    // -------- games -------- //

    // steam launcher
    .state('steam', {
      url: '/steam',
      templateUrl: 'views/steam.main.html',
      controller: 'steamMainCtrl',
      resolve: {
        FB: ['$FB', function($FB){
          return $FB.getFB();
        }]
      }
    })

    .state('steam.account_setup_guide', {
      url: '/steam/account_setup_guide',
      templateUrl: 'views/steam.account_setup_guide.html',
      params: { instantResize: false },
      controller: 'steamAccountSetupGuideCtrl'
    })

    .state('steam.signin', {
      url: '/steam/signin',
      templateUrl: 'views/steam.signin.html',
      controller: 'steamSignInCtrl'
    })

    .state('steam.signup', {
      url: '/steam/signup',
      templateUrl: 'views/steam.signup.html',
      controller: 'steamSignUpCtrl'
    })

    .state('steam.security_measure_guide', {
      url: '/steam/security_measure_guide',
      templateUrl: 'views/steam.security_measure_guide.html',
      params: {
        goNext: null,
        instantResize: false
      },
      controller: 'steamSecurityMeasureGuideCtrl'
    })

    .state('steam.activation', {
      url: '/steam/activation',
      templateUrl: 'views/steam.activation.html',
      controller: 'steamActivationCtrl'
    })

    .state('steam.qna', {
      url: '/steam/qna',
      templateUrl: 'views/steam.qna.html',
      controller: 'steamQnACtrl'
    })

    .state('steam.armor', {
      url: '/steam/armor',
      templateUrl: 'views/steam.armor.html',
      controller: 'steamArmorCtrl'
    })

    .state('steam.terms', {
      url: '/steam/terms',
      templateUrl: 'views/steam.terms.html',
      controller: 'steamTermsCtrl'
    })

    .state('steam.games', {
      url: '/steam/games',
      templateUrl: 'views/steam.games.html',
      params: { instantResize: false },
      controller: 'steamGameCtrl'
    })

    // -------- games -------- //
    .state('steam.games.ava', {
      url: '/steam/games/ava',
      templateUrl: 'views/steam.ava.html',
      controller: 'steamAVACtrl'
    })

    .state('steam.games.zmr', {
      url: '/steam/games/zmr',
      templateUrl: 'views/steam.zmr.html',
      controller: 'steamZMRCtrl'
    })

    .state('steam.games.kritika', {
      url: '/steam/games/kritika',
      templateUrl: 'views/steam.kritika.html',
      controller: 'steamKRITIKACtrl'
    });
    // -------- games -------- //

  // route rule ENDS
  //

  //present some routes as modals
})

.config(["ngDialogProvider", function (ngDialogProvider) {
  ngDialogProvider.setDefaults({
    className: "ngdialog-theme-default",
    plain: false,
    showClose: true,
    closeByDocument: true,
    closeByEscape: true,
    overlay: false,
    preCloseCallback: function () {
    }
  });
}])

// create lowercase
.filter('makeLowerCase', function() {
  return function(string) {
    return angular.lowercase(string);
  };
})

// decode html entities
.filter('plaintext', ['$sce', function($sce) {
    var div = document.createElement('div');
    return function(text) {
        div.innerHTML = text;
        return $sce.trustAsHtml(div.textContent);
    };
}])

.filter("trust", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  };
}])

.directive('onKeyEnter', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('keydown keypress', function(event) {
        if (event.which === 13) {
          var attrValue = $parse(attrs.onKeyEnter);
          (typeof attrValue === 'function') ? attrValue(scope) : angular.noop();
          event.preventDefault();
        }
      });
      scope.$on('$destroy', function() {
        element.unbind('keydown keypress')
      })
    }
  };
    }])

.directive('slider', ['systemManager', function(systemManager) {
  return {
    restrict: 'EA', // restrict A for attribute use, E for element, C for class, M for comment
    replace: true, // replace DOM markup with template
    transclude: true, // allow exisitng DOM content to be copied into directive
    scope: {
      images: '=',
    },

    link: function(scope, elem, attrs) {

      scope.currentIndex = 0; // initially the index is the first slide

      scope.openWeb = function(url, target) {
        systemManager.openExternalBrowserWithSession(url, target);
      };

      scope.openWebNoSession = function(url, target) {
        console.log('should open');
        systemManager.openExternalBrowser(url, target);
      };

      scope.init = function() {
        console.log('scope shows as ' + scope.images);

        scope.images[scope.currentIndex].visible = true; // set current slide to visible

        if(scope.images.length < 1) {
          //console.log('hide the nav');
          scope.hideNav = "display:none;"
        }
      };

      scope.next = function() {
        scope.currentIndex < scope.images.length -1 ? scope.currentIndex++ : scope.currentIndex = 0;
      };

      scope.prev = function() {
        scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
      };

      scope.$watch('currentIndex', function() {
        if (typeof scope.currentIndex == 'undefined') return;

        scope.images.forEach(function(image) {
          image.visible = false; // set all slides to invisible
        });
        scope.images[scope.currentIndex].visible = true; // set current slide to visible
      });
    },
    templateUrl:'templates/templateSlide.html'
  }
}])

.run(function($rootScope, $FB) {
  $rootScope
    .$on('$viewContentLoading',
      function(event, viewConfig){
    });

  $rootScope
    .$on('$viewContentLoaded',
      function(event, viewConfig){
    });

  $FB.init();
});



