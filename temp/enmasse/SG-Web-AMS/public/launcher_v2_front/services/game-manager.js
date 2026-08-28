
launcherApp.factory('gameManager', ['$q', '$http', 'systemManager', 'oauthManager', function ($q, $http, systemManager, oauthManager) {
  var baseURL = app.getConfig("APIBaseURL", "");
  var gameManager = {};

  gameManager.apiBaseURL = app.getConfig("APIBaseURL", "");

  gameManager.games = null;
  gameManager.betaAccess = null;
  gameManager.curIndex = null;

  gameManager.initialize = function() {

    // fetch all current games
    this.allGames();

    // initialize game index
    var _index = window.settings.get(systemManager.getSettingKey('lastTabIndex'));
    if (typeof _index == 'number') {
      gameManager.curIndex = _index;
    } else {
      gameManager.curIndex = 0;
    }
  };

  gameManager.allGames = function() {
    var me = this;
    var deferred = $q.defer();

    if (me.games != null) {
      deferred.resolve(me.games);
      return deferred.promise;
    }

    if(debug.game || debug.all){
      console.log("BASE URL: " + baseURL);
    }

    $http({
      method: 'GET',
      url: baseURL + '/launcher_v2/games.json',
      dataType: 'json',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(
      function(response) {
        if (response.data.success) {
          me.games = response.data.info.custom;
          console.log('response.data.info.custom ' , response.data.info.custom);
          // check curGame is within the range
          if (me.curIndex < 0 || me.Index >= me.games.length) {
            me.curIndex = 0;
          }
          //me.curGame = me.games[me.curIndex];

          deferred.resolve(me.games);
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
  };

  gameManager.userBetaAccess = function() {
    var me = this;
    var deferred = $q.defer();

    if (me.betaAccess != null) {
      deferred.resolve(true);
      return deferred.promise;
    }

    if (me.games == null) {
      // gameManager doesn't have game information
      deferred.reject('C0019');
      return deferred.promise;
    }

    oauthManager.sendRequest({
      method: 'POST',
      url: me.apiBaseURL + '/launcher_v2/user_beta_access',
      dataType: 'json',
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        games: me.games,
      }
    }).then(
      function(response) {
        if (response.data.success) {
          console.log("user_beta_access succeeded");
          console.dir(response.data);
          
          beta_access = response.data.info.custom
          for (i=0;i<me.games.length;i++) {
            var access = beta_access[me.games[i].name];
            console.log('access: ' + access);
            if (typeof access != "undefined")
              me.games[i].beta_access = access;
          }
          console.dir(me.games);
          deferred.resolve(true);
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
  }
  /*
  var fetchGames = function(){
    if(debug.game || debug.all){
      console.log("BASE URL: " + baseURL);
    }
    $.get(baseURL + '/launcher_v2/games.json', function(data){
      if(debug.game || debug.all){
        console.log("DATA FROM CALL:");
        console.log(data);
      }
      if(data.games){
        games = data.games;
        if(curGame == null){
          curGame = games[0];
        }
      }
      if(data.error && games == []){
        // TODO: display error message.
        console.log('error in fetchGames');
        console.dir(data);
      }
      // TODO: select game saved in localStorage if any.
    });
  };
  */
  //fetchGames();


  gameManager.selectGame = function(index){
    // TODO: check if valid game_id
    //this.curGame = this.games[index];
    this.curIndex = index;

    // save index to persistent storage
    window.settings.set(systemManager.getSettingKey('lastTabIndex'), index);
  };

  gameManager.currentGame = function() {
    if (this.curIndex != null && this.games != null) {
      if (this.curIndex < this.games.length) {
        return this.games[this.curIndex];
      }
    }
    return null;
    //return this.curGame;
  };

  gameManager.currentIndex = function() {
    return this.curIndex;
  };

  gameManager.getIndexFromID = function(game_id) {
    for (i = 0; i < this.games.length; i++) {
      if (this.games[i].id == game_id) {
        return i;
      }
    }

    return null;
  }

  gameManager.getGameWithName = function(game_name) {
    for (i = 0; i < this.games.length; i++) {
      if (this.games[i].game.toLowerCase() == game_name.toLowerCase()) {
        console.log('matched: ' + game_name);
        return this.games[i];
      }
    }

    return null;
  };



  return gameManager;
}]);
