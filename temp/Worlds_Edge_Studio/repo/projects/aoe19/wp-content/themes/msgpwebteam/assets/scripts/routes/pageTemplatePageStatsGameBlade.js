import StatsGlobal from '../component/StatsGlobal';
import LeaderboardGlobal from '../component/LeaderboardGlobal';
import MatchesGlobal from '../component/MatchesGlobal';
import config from '../config.js';
import templateModal from '../templates/modalError.html'
import Loading from "../component/Loading";

export default {
  init() {

    let game = ( window.wp_object.game ) ? window.wp_object.game : window.wp_object.slug;
    this.matches = null;
    this.stats = null;
    this.leaderboard = null;
    this.leaderboardQueryStringData = null;
    this.game = null;

    if(game !== null || game !== '') {
      switch(game) {
        case 'ageiide':
          this.matches = `${config.api.baseStatsV2Api}/AgeII/GetGlobalMatches`;
          this.stats = `${config.api.baseStatsV2Api}/AgeII/GetGlobalStats`;
          this.leaderboard = `${config.api.baseStatsV2Api}/AgeII/GetRLLeaderboard`;
          this.leaderboardQueryStringData = 3;
          this.game = game;
          break;
        case 'ageiiide':
          this.leaderboard = `${config.api.baseStatsApi}/AgeIII/GetRLLeaderboard`;
          this.leaderboardQueryStringData = 1;
          this.game = game;
          break;
      }
    }

    this.options = {
      modalTemplate : templateModal,
    }
    this.apiRequest = {
      gamertag  : null,
      matchType : null,
      game      : null,
      isRanked  : true,
      gameMode  : "Death Match",
      matchSize : "1v1",
      mapSize   : "Large",
    }
    this.apiPropNames = {
      results         : 'totalGames',
      resultsMeta     : 'meta',
      startIndex      : 'page',
      countMax        : 'recordCount',
      total           : 'totalMatches',
      list            : 'matchList',
      userId          : 'userId',
      gamertag        : 'gamertag',
      userHandle      : 'gamertag',
      sortCategory    : 'sortColumn',
      sortOrder       : 'sortDirection',
      numStartIndex   : 1,
      numMaxPages     : 3,
      numCountMax     : 15,
      isRanked        : 'isRanked',
      gameMode        : 'gameMode',
      matchSize       : 'matchSize',
      mapSize         : 'mapSize',
      civStats        : 'civStats',
      mapStats        : 'mapStats',
    }
    this.ui = {
      progressBars    : $('.progress-bar'),
      progressCircles : $('.progress-circle'),
      matchResults    : $('.results-container'),
      campaignResults : $('.campaign-results-container'),
      modal           : $('#match-details-modal'),
      modalMount      : $('.js-match-summary-mount'),
      errorMount      : $('.stats-showNoResults'),
    };
    this.renderHeader = true;
    this.loader = new Loading();
    this._renderGlobalLeaderboard();
    this._renderGlobalStats();
    this._renderGlobalMatches();
    this._addEventListeners();
  },
  _addEventListeners(){
    let self = this;

    /*search logged in gamer, may select game */
    $('.btn--search.gamertag-search').on('click',function(){
      let matchType = $('#game_mode_select').val();
      window.location.href = '/stats/?matchType=' + matchType + '&profileId=' + window.wp_object.profileId + '&game=age2';
    });

    // Stat Mode Selection
    $('.stat_modes').on('click', function(e) {
      e.preventDefault();
      $('.stat_modes').removeClass('is-current');
      $(this).addClass('is-current');

      if($('#stats_ranked').hasClass('is-current')) {
        $('select[data-stat-mode="mp"]').hide();
        $('select[data-stat-mode="ranked"]').show();
        self.apiRequest.gameMode = $('#game_mode_ranked_select_civilizations').val();
        self.apiRequest.mapSize = $('#game_map_select_civilizations').val();
        self.apiRequest.matchSize = $('#game_size_select_civilizations').val();
        self.apiRequest.isRanked = true;
        self._renderGlobalStats();

      } else if($('#stats_mp').hasClass('is-current')) {
        $('select[data-stat-mode="ranked"]').hide();
        $('select[data-stat-mode="mp"]').show();
        self.apiRequest.gameMode = $('#game_mode_mp_select_civilizations').val();
        self.apiRequest.mapSize = $('#game_map_mp_select_civilizations').val();
        self.apiRequest.isRanked = false;
        self._renderGlobalStats();
      }
    });

    // Game Mode Ranked Select
    $('#game_mode_ranked_select_civilizations').on('change',function(){
      self.apiRequest.gameMode = $(this).val();
      self._renderGlobalStats();
    });

    // Game Mode Multiplayer Select
    $('#game_mode_mp_select_civilizations').on('change',function(){
      self.apiRequest.gameMode = $(this).val();
      self._renderGlobalStats();
    });

    // Game Map Ranked Select
    $('#game_map_select_civilizations').on('change',function(){
      self.apiRequest.mapSize = $(this).val();
      self._renderGlobalStats();
    });

    // Game Map Multiplayer Select
    $('#game_map_mp_select_civilizations').on('change',function(){
      self.apiRequest.mapSize = $(this).val();
      self._renderGlobalStats();
    });

    // Game Size Select
    $('#game_size_select_civilizations').on('change',function(){
      self.apiRequest.matchSize = $(this).val();
      self._renderGlobalStats();
    });

  },
  _renderGlobalStats() {
    let self = this;
    // Sometimes this.stats will be null
    // (like if a stats endpoint isn't ready for a stats page)
    // so instantiate MatchesGlobal class if this.matches has a value (see near top of this file).
    if(this.stats !== null) {
      new StatsGlobal({
        api             : this.stats,
        apiPropNames    : this.apiPropNames,
        isRanked        : this.apiRequest.isRanked,
        gameMode        : this.apiRequest.gameMode,
        matchSize       : this.apiRequest.matchSize,
        mapSize         : this.apiRequest.mapSize,
      });
    }
  },
  _renderGlobalLeaderboard() {
    let self = this;
    new LeaderboardGlobal($('#global_leaderboard'),{
      api                         : this.leaderboard,
      leaderboardQueryStringData  : this.leaderboardQueryStringData,
      apiPropNames                : this.apiPropNames,
      game                        : this.game,
    });
  },
  _renderGlobalMatches() {
    let self = this;
    // Sometimes this.matches will be null
    // (like if a matches endpoint isn't ready for a stats page)
    // so instantiate MatchesGlobal class if this.matches has a value (see near top of this file).
    if(this.matches !== null) {
      new MatchesGlobal($('#global_matches'),{
        api             : this.matches,
        apiPropNames    : this.apiPropNames,
      });
    }
  },
};
