import StatsMSP from '../component/StatsMSP';
// Age II DE
import StatsAge2MSP from '../component/StatsAge2MSP';
import CampaignProgress from '../component/CampaignProgress';
import ProgressAnim from '../component/ProgressAnim';
import config from '../config.js';
import ajaxPost from '../util/ajaxPost';
import MPMatchList from '../component/MPMatchList';
import MPStatsList from '../component/MPStatsList';
import templateModal from '../templates/modalError.html';
import Loading from "../component/Loading";
import ClearInputField from "../util/ClearInputField";
import templateNoResults from '../templates/statsShowNoResults.html';

export default {
  init() {
    let gamertag = window.wp_object.gamertag;
    let gameType = ( window.wp_object.gameType ) ? window.wp_object.gameType : 'mp';
    let game = ( window.wp_object.game ) ? window.wp_object.game : window.wp_object.slug;

    this.leaderboard = null;

    if(game !== null || game !== '') {
      switch(game) {
        case 'ageiide':
          this.leaderboard = `${config.api.baseStatsApi}/AgeII/GetRLLeaderboard`;
          break;
        case 'ageiiide':
          this.leaderboard = `${config.api.baseStatsApi}/AgeIII/GetRLLeaderboard`;
          break;
      }
    }

    let player = window.wp_object.player;
    let gameId = window.wp_object.gameId;
    let profileId = window.wp_object.profileId;
    let matchType = '3';


    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('matchType')) {
      matchType = this._getUrlParameter('matchType');
    }

    this.options = {
      modalTemplate     : templateModal,
      noResultsTemplate : templateNoResults,
    }
    this.constants = {
      game: {
        age: {
          api: {
            mp: config.api.MPFull,
            sp: config.api.SPFull,
            c: config.api.campaignStats,
            mpList: config.api.MPMatchList,
            spList: config.api.SPMatchList,
          },
        },
        age2: {
          api: {
            mp: config.api.Age2MPFull,
            sp: config.api.Age2SPFull,
            c: config.api.Age2campaignStats,
            mpList: config.api.Age2MPMatchList,
            spList: config.api.Age2SPMatchList,
          },
        },
      },
      leaderboard: this.leaderboard,
    }
    this.apiRequest = {
      gamertag  : null,
      gameType  : null,
      game      : 'age',
      player    : 0,
      gameId    : 0,
      profileId : null,
      matchType : null,
    }
    this.apiPropNames = {
      results         : 'mpStatList',
      campaignResults : 'campaignProgress',
      matches         : 'matchList',
      user            : 'user',
      resultsMeta     : 'meta', // exisitng endpoints want this
      //resultsMeta     : 'totalMatches', // Age2 mp endpoint wants this, provided below
      startIndex      : 'page',
      countMax        : 'recordCount',
      total           : 'totalMatches',
      userId          : 'userId',
      gamertag        : 'gamertag',
      game            : 'game', // Age: DE or Age 2: DE
      player          : 'playerNumber', // Player Number for Age2 stats
      gameId          : 'gameId', // Game Id for Age2 stats | Match Details
      profileId       : 'profileId', // Relic Link Profile ID
      userHandle      : 'gamertag',
      sortCategory    : 'sortColumn',
      sortOrder       : 'sortDirection',
      matchType       : 'matchType',
      careerStats     : 'careerStats',
      mpMatches       : 'mpMatches',
      numCountMax     : 10,
    }
    this.apiLeaderboardPropNames = {
      results         : 'totalGames',
      resultsMeta     : 'meta',
      startIndex      : 'page',
      countMax        : 'recordCount',
      total           : 'totalMatches',
      userId          : 'userId',
      gamertag        : 'gamertag',
      userHandle      : 'gamertag',
      sortCategory    : 'sortColumn',
      sortOrder       : 'sortDirection',
      matchType       : 'matchType',
      numStartIndex   : 1,
      numMaxPages     : 3,
      numCountMax     : 15,
    }
    this.ui = {
      progressBars    : $('.progress-bar'),
      progressCircles : $('.progress-circle'),
      matchResults    : $('.results-container'),
      campaignResults : $('.campaign-results-container'),
      pagination      : $('.pagination-container'),
      modal           : $('#match-details-modal'),
      modalMount      : $('.js-match-summary-mount'),
      errorMount      : $('.stats-showNoResults'),
      mounts: {
        statsMain     : '.stats-main',
        noResults     : '.stats-showNoResults',
      },
    };
    this.renderHeader = true;
    this.loader = new Loading();

    this.messages = {
      noStatsMessage    : "No stats available for this game mode - go play!",
    }

    if ( this.apiRequest.gamertag != gamertag || this.apiRequest.gameType != gameType ) {
      this.apiRequest.gameType = ( gameType ) ? gameType : this.apiRequest.gameType;
      this.apiRequest.game = ( game ) ? game : this.apiRequest.game;
      this.apiRequest.gamertag = ( gamertag ) ? gamertag : this.apiRequest.gamertag;
      // Age 2 Lookup criteria
      this.apiRequest.player = ( player ) ? player : this.apiRequest.player;
      this.apiRequest.gameId = ( gameId ) ? gameId : this.apiRequest.gameId;
      this.apiRequest.profileId = ( profileId ) ? profileId : this.apiRequest.profileId;
      this.apiRequest.matchType = ( matchType ) ? matchType : this.apiRequest.matchType;
    }

    // Mark -- Condition for age2 must be done to avoid gamer tag validation
    if(this.apiRequest.game == 'age2' || this.apiRequest.game == 'age3'){

      this.apiPropNames.resultsMeta = 'totalMatches';

      if (this.apiRequest.gameType == 'c') {
        this._renderCampaignStats();
      } else if (this.apiRequest.gameType == 'sp') {
        this._renderMSPStats();
      } else if (this.apiRequest.gameType == 'mp') {
       this._renderMSPAge2Stats();
       this._updateSelector();

      }

    } else {
      if (this.apiRequest.gameType) {
        if (this.apiRequest.gameType == 'c') {
          this._renderCampaignStats();
        } else if (this.apiRequest.gameType == 'mp' || this.apiRequest.gameType == 'sp') {
          this._renderMSPStats();
        }
      }

    }
    this._addEventListeners();
  },

  _updateSelector() {
    $('#game_mode_select_top').find("option").prop('selected', false);
    $('#game_mode_select_top').find("option[value='" + this.apiRequest.matchType + "']").prop('selected', true);
  },

  _renderCampaignStats() {
        new CampaignProgress(this.ui.campaignResults, {
          api           : this.constants.game[this.apiRequest.game].api[this.apiRequest.gameType],
          apiPropNames  : this.apiPropNames,
          gamertag      : this.apiRequest.gamertag,
          modalTemplate : this.options.modalTemplate,
          player        : this.apiRequest.player,
          game          : this.apiRequest.game,
          gameId        : this.apiRequest.gameId,
          profileId     : this.apiRequest.profileId,
          renderHeader  : true,
        });
  },
  _renderMSPAge2Stats() {
    let self = this;

    new StatsAge2MSP({
      api           : self.constants.game[this.apiRequest.game].api[this.apiRequest.gameType],
      apiPropNames  : self.apiPropNames,
      gamertag      : self.apiRequest.gamertag,
      gameType      : self.apiRequest.gameType,
      player        : self.apiRequest.player,
      gameId        : self.apiRequest.gameId,
      game          : self.apiRequest.game,
      profileId     : self.apiRequest.profileId,
      matchType     : self.apiRequest.matchType,
      renderHeader  : true,
    }, this.apiRequest.game);
    if (self.ui.matchResults.length) {
        if( this.matchList ) {
          this.matchList = null;
        }
        this.matchList = new MPMatchList($(self.ui.matchResults), {
          gameType      : self.apiRequest.gameType,
          apiPropNames  : self.apiPropNames,
          gamertag      : self.apiRequest.gamertag,
          player        : self.apiRequest.player,
          gameId        : self.apiRequest.gameId,
          game          : self.apiRequest.game,
          profileId     : self.apiRequest.profileId,
          matchType     : self.apiRequest.matchType,
          newPagination : true,
          counter       : self.counter,
        });
      self.counter = self.counter + 1;
    }
  },
  _renderMSPStats() {
    let self = this;

    new StatsMSP({
      api           : self.constants.game[this.apiRequest.game].api[this.apiRequest.gameType],
      apiPropNames  : self.apiPropNames,
      gamertag      : self.apiRequest.gamertag,
      gameType      : self.apiRequest.gameType,
      player        : self.apiRequest.player,
      gameId        : self.apiRequest.gameId,
      game          : self.apiRequest.game,
      profileId     : self.apiRequest.profileId,
      renderHeader  : true,
    });
    if (self.ui.matchResults.length) {
        if( this.matchList ) {
          this.matchList = null;
        }
        this.matchList = new MPMatchList($(self.ui.matchResults), {
          gameType      : self.apiRequest.gameType,
          apiPropNames  : self.apiPropNames,
          gamertag      : self.apiRequest.gamertag,
          player        : self.apiRequest.player,
          gameId        : self.apiRequest.gameId,
          game          : self.apiRequest.game,
          profileId     : self.apiRequest.profileId,
          newPagination : true,
          counter       : self.counter,
        });
      self.counter = self.counter + 1;
    }
  },

  _getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  },

  _addEventListeners() {
    let self = this;

    // Change stats
    $('.stats-mystats-header').on('change','#game_select',function(){
      var newURL =  '';
      let finalURL = '';
      var currentURL = window.location.href;
      var gameSelection = 'game=' + $(this).val();
      let selectedGameType = self._getUrlParameter('gameType');

      if(currentURL.indexOf('game=') >= 0) {
        newURL = currentURL.replace(/(game=[^\?]+)(\?.*)?/, gameSelection);
      } else {
        if(currentURL.includes('&game')){
          newURL = currentURL + '&' + gameSelection;
        } else {
          newURL = currentURL + '?' + gameSelection;
        }
      }

      if(
        ($(this).val() == 'age2' || $(this).val() == 'age3') &&
        selectedGameType == 'sp'
      ){
        finalURL = newURL.replace('gameType=sp', 'gameType=mp');
      } else {
        finalURL = newURL;
      }

      window.location.href = finalURL;
    });

    /*search logged in gamer, may select game */
    $('.btn--search.gamertag-search').on('click',function(){
      let matchType = $('#game_mode_select_top').val();
      if(this.apiRequest.game == 'age2') {
        window.location.href = '/stats/?matchType=' + matchType + '&game=age2';
      } else if(this.apiRequest.game == 'age3') {
        window.location.href = '/stats/?matchType=' + matchType + '&game=age3';
      }
    });



    new ClearInputField($('#gamertagSearchBox'));
    $('#gamertag-search').on('submit', function(e) {
      e.preventDefault();
      self.apiRequest.gamertag = $('#q').val();
      if (self.apiRequest.gamertag == '' || !self.apiRequest.gamertag) {
        self._showNoResults();
      } else {
        let xhrs = [
          ajaxPost({
            url: config.api.validateGamertag,
            data: JSON.stringify({
              gamertag: self.apiRequest.gamertag,
            }),
          }),
        ];
        self._ajaxPromise(xhrs, null, null);
      }
    })
  },
  _validateGamertag(cb = null) {
    let self = this;
    let xhrs = [
      ajaxPost({
        url: config.api.validateGamertag,
        data: JSON.stringify({
          gamertag: self.apiRequest.gamertag,
        }),
      }),
    ];
    self._ajaxPromise(xhrs, cb, null);
  },
  _reRender() {
    if ( this.apiRequest.game && this.apiRequest.gamertag && this.apiRequest.gameType ) {
      if(
          (this.apiRequest.game == 'age2' || this.apiRequest.game == 'age3') &&
          this.apiRequest.gameType == 'mp'
        ){
          this.loader.show();
          this._renderMSPAge2Stats();
      } else if ( this.apiRequest.gameType == 'c' ) {
        this.loader.show();
        this._renderCampaignStats();
      } else if( this.apiRequest.gameType == 'mp' || this.apiRequest.gameType == 'sp' ) {
        this.loader.show();
        this._renderMSPStats();
      }
    }
  },
  _ajaxPromise(arr, cb = null, loader = null) {
    let self = this;
    self.callback = cb;
    $.when.apply($,arr)
      .done(function(res, textStatus, xhr) {
        if(textStatus == 'nocontent') {
          self._showNoResults();
        } else {
          if(res) {
            if (res == true) {
              if (typeof cb === 'function') {
                self.callback();
              } else {
                location.href = window.wp_object.homeUrl + '/stats/?gamertag=' + self.apiRequest.gamertag + '&gameType=' + self.apiRequest.gameType;
              }
            } else {
              self._showNoResults();
            }
          } else {
            self._showNoResults();
          }
        }
      }).fail(function(){
      //console.log("ajax failed");
    })
  },
  /*_showNoResults() {
    console.log('page temp show no results');
    let $html = $(this.options.modalTemplate({
      errorMessage: "No Results found",
    }))
    this.ui.modalMount.html($html);
    this.ui.modal.foundation('open');
  },*/

  _showNoResults() {
    let self = this;
    let mainMount = $(this.ui.mounts.statsMain);
    let noResultsMount = $(this.ui.mounts.noResults);
    noResultsMount.empty();
    noResultsMount.html(this.options.noResultsTemplate(this.messages));
  },
};
