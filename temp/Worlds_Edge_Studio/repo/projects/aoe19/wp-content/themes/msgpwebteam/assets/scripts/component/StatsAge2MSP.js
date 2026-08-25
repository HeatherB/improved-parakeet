import ajaxGet from '../util/ajaxGet';
import ajaxPost from '../util/ajaxPost';
import DonutChart from './StatsCircle';
import Loading from "./Loading";
import config from "../config";
import templateNoResults from '../templates/statsShowNoResults.html';
import templateMapProgress from '../templates/statsMapProgress.html';
import templateCivProgress from '../templates/statsAge2CivProgress.html';
import templateMyStatsNav from '../templates/myStatsNav.html';
import ProgressAnim from '../component/ProgressAnim';
import AreaChart from "./ChartArea";


export default class StatsAge2MSP {
  constructor(options = {}, gameDetail) {
    this._initLoaders();
    this.init(options);
    this.gameDetail = gameDetail;
  }

  init(options) {
    let self = this;

    this.options = Object.assign({
      api                 : null,
      apiPropNames        : null,
      noResultsTemplate   : templateNoResults,
      myStatsNavTemplate  : templateMyStatsNav,
      mapProgressTemplate : templateMapProgress,
      civProgressTemplate : templateCivProgress,
      gamertag            : null,
      gameType            : 'mp',
      game                : this.gameDetail,
      player              : null,
      gameId              : null,
      profileId           : null,
      homeUrl             : window.wp_object.homeUrl,
      renderHeader        : true,
      matchType           : null,
    }, options);

    this.ui = {
      mounts: {
        statsMain               : '.stats-main',
        header                  : '.js-myStatsNav-mount',
        campaign                : '.campaign-results-container',
        msp                     : '.stats-msp',
        toggleVisibility        : '.stats-toggle-visibility',
        noResults               : '.stats-showNoResults',
        areaChart               : '#chart-area',
        progressCirlceChart     : '#chart-wins',
        unitsCircleChart        : '#chart-units',
        buildingsCircleChart    : '#chart-buildings',
        civsPlayedChart         : '#chart-civs',
        mapsWinsChart           : '#chart-maps',
        civsWinsChart           : '#chart-civs-wins',
        donutChart              : '#chart-victorytype',
        progressBars            : $('.progress-bar'),
      },
    }

    this.data = {
      gameType    : this.options.gameType,
      homeUrl     : this.options.homeUrl,
      game        : this.options.game,
      player      : this.options.player,
      gameId      : this.options.gameId,
      profileId   : this.options.profileId,
      gamertag    : this.options.gamertag,
      careerStats : this.options.careerStats,
      mpMatches   : this.options.mpMatches,
      matchType   : this.options.matchType,
      apiRequest  : {
        [this.options.apiPropNames.profileId] : this.options.profileId,
        [this.options.apiPropNames.userHandle] : this.options.gamertag,
        [this.options.apiPropNames.player] : this.options.player,
        [this.options.apiPropNames.gameId] : this.options.gameId,
        [this.options.apiPropNames.matchType] : this.options.matchType,
        [this.options.apiPropNames.careerStats] : this.options.careerStats,
        [this.options.apiPropNames.mpMatches] : this.options.mpMatches,
      },
    }

    this._addEventListeners();
    this.loader.show();

    $('progress.progress-bar__bar').attr('data-max', '');
    $('progress.progress-bar__bar').attr('max', '');
    $('progress.progress-bar__bar').attr('value', 0);
    $('.progress-bar').attr('data-progress', '');

    this.messages = {
      noStatsMessage    : "No stats available for this game mode - go play!",
    }
    let xhrs = [
      ajaxPost({
        url: self.options.api,
        data: JSON.stringify(this.data.apiRequest),
      }),
    ];
    //console.log('init function');
    this._ajaxPromise(xhrs, this._renderCharts, null);
  }

  _initLoaders() {
    this.loader = new Loading({
      container: $('body'),
    });
  }

  _renderCharts() {
    let self = this;
    self.loader.show();
    let chartFunctions = [
      self._renderHeader(),
      self._progressCirlceChart(),
      self._renderMapsPlayedChart(),
      self._renderStaticStats(),
      self._hideLoader(),
    ];
    //console.log('render charts call');
    this._ajaxPromise(chartFunctions, null, null)
  }

  _hideLoader() {
    let self = this;
    self.loader.hide();
  }

  _renderStaticStats() {
    let self = this;
    let keys = [
      "averageMatchLength",
      "averageNumberVillagers",
      "buildingsRaised",
      "cpusDefeated",
      "playersDefeated",
      "timePlayingMP",
      "totalMPMatches",
      "totalWins",
      "winStreak",
      "longestStreak",
      "unitsKilled",
      "villagersCreated",
      "wondersBuilt",
      "currentRank",
    ];
    this._userELO();
    this._playerStanding();
    return;
  }

  _renderHeader() {
    if ( this.options.renderHeader == true ) {
      let $html = $(this.options.myStatsNavTemplate(this.data));
      $(this.ui.mounts.header).html($html);
    }
    else {
      return;
    }
    return;
  }

  _winStreak() {
    let self = this;
    let winStreak = self.data.results.currentWinStreak;
    $('.js-winStreak').html(winStreak);
    return;
  }

  _wondersBuilt() {
    let self = this;
    let wondersBuilt = self.data.careerStats.wondersBuilt;
    wondersBuilt = self._number_format(wondersBuilt,0,'.',',');
    $('.js-wondersBuilt').html(wondersBuilt);
    return;
  }

  /* more mode stts */
  _userELO() {
    let self = this;
    let userELO = self.data.user.elo;
    $('.js-userELO').html(userELO);
    return;
  }

  _playerStanding() {
    let self = this;
    let playerStanding = Math.round((100 * self.data.user.playerStanding));
    if(playerStanding == 0) {
      $('.js-playerStanding').html('Top 1%');
    } else {
       $('.js-playerStanding').html('Top ' + playerStanding + '%');
    }

    return;
  }

  _highScoreTotal() {
    let self = this;
    let highScoreTotal = self.data.careerStats.highScoreTotal;
    $('.js-highScoreTotal').html(highScoreTotal);
    return;
  }
  _castlesBuilt() {
    let self = this;
    let castlesBuilt = self.data.careerStats.castlesBuilt;
    $('.js-castlesBuilt').html(castlesBuilt);
    return;
  }
  _trebsBuilt() {
    let self = this;
    let trebsBuilt = self.data.careerStats.trebsBuilt;
    $('.js-trebsBuilt').html(trebsBuilt);
    return;
  }
  _farmsBuilt() {
    let self = this;
    let farmsBuilt = self.data.careerStats.farmsBuilt;
    $('.js-farmsBuilt').html(farmsBuilt);
    return;
  }

  _donutChart() {
    let self = this;
    let victoriesArr = [];
    victoriesArr.push({name: 'Technology', value: self.data.careerStats.highScoreTechnology});
    victoriesArr.push({name: 'Economy', value: self.data.careerStats.highScoreEconomy});
    victoriesArr.push({name: 'Military', value: self.data.careerStats.highScoreMilitary});

     let data = victoriesArr.filter(function (item) {
     if(item.value  != 0) {
        return {
          name: item.id,
          value: item.summary,
        }
      }
    })

    if(data.length) {
      $('.showNoVictories').html('');
      new DonutChart({
        radius: 105,
        border: 45,
        padding: 5,
        type: 'donut',
      }, {
        parent: '#chart-victorytype',
        inset: '.chart-inset--victorytype',
      }, {
        data: data,
      });

      return;
    } else {
      $('.showNoVictories').html('You have not yet achieved a victory.');
    }
  }

  _progressCirlceChart() {
    let self = this;
    let totalWins = self.data.results.totalWins;
    let totalMPMatches = self.data.results.totalMatches;
    let endPercent = totalWins / totalMPMatches;
    endPercent = endPercent.toFixed(2);
    let data = {};
    data.name = "Total Wins";
    data.value = endPercent;
    $('.winsnumber').html(totalWins);
    $('.matchesnumber').html(totalMPMatches);
    new DonutChart({
      radius: 105,
      border: 45,
      padding: 5,
      type: 'progress',
    }, {
      parent: '#chart-wins',
      inset: '.chart-inset--wins',
    }, {
      data: data,
    });

    return;
  }

  _unitsCircleChart() {
    let self = this;

    let unitsKilled = self.data.careerStats.unitsKilled;
    let unitsKilled_formatted = self._number_format(unitsKilled,0,'.',',');

    let unitsLost = self.data.careerStats.unitsLost;

    let totalUnits = unitsKilled + unitsLost;

    let endPercent = unitsKilled / totalUnits;
    endPercent = endPercent.toFixed(2);
    let data = {};
    data.name = "Units";
    data.value = endPercent;
    $('.js-unitsKilled').html(unitsKilled);
    $('.js-unitsLost').html(unitsLost);
    new DonutChart({
      radius: 105,
      border: 45,
      padding: 5,
      type: 'progress',
    }, {
      parent: '#chart-units',
      inset: '.chart-inset--units',
    }, {
      data: data,
    });

    return;
  }

  _buildingsCircleChart() {
    let self = this;
    let buildingsLost = self.data.careerStats.buildingsLost;

    let buildingsRaised = self.data.careerStats.buildingsRaised;


    let totalBuildings = buildingsRaised + buildingsLost;

    let endPercent = buildingsRaised / totalBuildings;
    endPercent = endPercent.toFixed(2);
    let data = {};
    data.name = "Buildings";
    data.value = endPercent;
    $('.js-buildingsLost').html(buildingsLost);
    $('.js-buildingsRaised').html(buildingsRaised);
    new DonutChart({
      radius: 105,
      border: 45,
      padding: 5,
      type: 'progress',
    }, {
      parent: '#chart-buildings',
      inset: '.chart-inset--buildings',
    }, {
      data: data,
    });

    return;
  }

 _renderCivsPlayedChart() {
    let self = this;
    let min = Infinity, max = -Infinity, x;
    let maxWins = 0;
    let maxDefeats = 0;

    if(self.data.careerStats.hasOwnProperty('civilizations')){
      let civs = self.data.careerStats.civilizations;

      if($('#chart-civs-wins .bargraph-table__label-cell').length) {
        return
      }

      $('#chart-civs-wins .bargraph-table__label-cell');

      /*for (let i = 0; i < civs.length; i++ ) {
        console.log('civs[i].winCount ', civs[i].winCount);
        maxWins += civs[i].winCount;
        maxDefeats += civs[i].defeatCount;
      }
      console.log('maxWins ', maxWins);*/

      /* remove the random civ from tally results */
      let civsLoseRandom = civs.filter(civ => civ.name !== 'Random');

      /* use highest number as total */
     /* let highestWinArr = civsLoseRandom.map((civ) => civ.winCount);
      let highestWin = Math.max(...highestWinArr);

      let highestConArr = civsLoseRandom.map((civ) => civ.defeatCount);
      let highestCon = Math.max(...highestConArr);*/

      /* sum all of type for total */
      let highestWin = civsLoseRandom.reduce((sum, civ) => sum + civ.winCount, 0);
      let highestCon = civsLoseRandom.reduce((sum, civ) => sum + civ.defeatCount, 0);

      for (let i = 0; i < civs.length; i++ ) {
        /*console.log('civs[i].winCount ', civs[i].winCount);
        console.log('civs[i].defeatCount ', civs[i].defeatCount);*/
        let $html = $(self.options.civProgressTemplate({
          name: civs[i].name,
          /*wins: Math.trunc((civs[i].winCount * 100) / highestWin),
          conquers: Math.trunc((civs[i].defeatCount * 100) / highestCon),*/
          wins:civs[i].winCount,
          conquers:civs[i].defeatCount,
          winCount: civs[i].winCount,
          conquersCount: civs[i].defeatCount,
          /*played: maxWins + maxDefeats, */
          maxWins: highestWin,
          maxDefeats: highestCon}));
        $(self.ui.mounts.civsWinsChart).find('tbody').append($html);
      }
    }
    return
  }

  _renderMapsPlayedChart() {
    let self = this;
    let min = Infinity, max = -Infinity, x;

    if(self.data.results.hasOwnProperty('mapGamesPlayed')) {
      let maps = self.data.results.mapGamesPlayed;
      let wins = self.data.results.mapGamesWon;

      $('#chart-maps .bargraph-table__stat-cell').html('');
      for (x in maps) {
        if (maps[x].value > max) max = maps[x].value;
      }

      for (let i = 0; i < maps.length; i++) {
        let $html = $(self.options.mapProgressTemplate({
          name: maps[i].name,
          played: maps[i].value,
          won: wins[i].value,
          max: max,
        }));
        $(self.ui.mounts.mapsWinsChart).find('tbody').append($html);
      }
      if ($('.progress-bar').length) {
        $('.progress-bar').each((i, el) => {
          new ProgressAnim($(el), {});
        });
      }
    } else if(self.data.results.hasOwnProperty('maps')) {
      let maps = self.data.results.maps;

      $('#chart-maps .bargraph-table__stat-cell').html('');
      for (x in maps) {
        if (maps[x].playCount > max) max = maps[x].playCount;
      }

      for (let i = 0; i < maps.length; i++) {
        let $html = $(self.options.mapProgressTemplate({
          name: maps[i].name,
          played: maps[i].playCount,
          won: maps[i].winCount,
          max: max,
        }));
        $(self.ui.mounts.mapsWinsChart).find('tbody').append($html);
      }
      if ($('.progress-bar').length) {
        $('.progress-bar').each((i, el) => {
          new ProgressAnim($(el), {});
        });
      }
    }
    return;
  }

  _showNoResults() {
    let self = this;
    let mainMount = $(this.ui.mounts.statsMain);
    let noResultsMount = $(this.ui.mounts.noResults);
    noResultsMount.empty();
    noResultsMount.html(this.options.noResultsTemplate(this.messages));

    /* reset career stats pieces */
    $('.winsnumber').html('N/A');
    $('.matchesnumber').html('N/A');
    $('.js-userELO').html('N/A');
    $('.js-playerStanding').html('N/A');
    $('.js-winStreak').html('N/A');
    let data = {};
    data.name = "Total Wins";
    data.value = 0;
    new DonutChart({
      radius: 105,
      border: 45,
      padding: 5,
      type: 'progress',
    }, {
      parent: '#chart-wins',
      inset: '.chart-inset--wins',
    }, {
      data: data,
    });
    self._hideLoader();
  }

  _removeEventListeners() {
      this.ui.window.off(this.options.paginationCallback);
  }

  _addEventListeners() {
    let self = this;

      // Game Mode Select
      $('#game_mode_select_top').on('change',function(){
        self.data.apiRequest.matchType = $(this).val();
        let xhrs = [
          ajaxPost({
            url: self.options.api,
            data: JSON.stringify(self.data.apiRequest),
          }),
        ];
       //console.log('select toggle');
        self._ajaxPromise(xhrs, self._renderCharts, null);
      });
  }

  _ajaxPromise(arr, cb = null, loader = null) {
    var self = this;
    self.callback = cb;
    $.when.apply($,arr)
      .done(function(res, textStatus, xhr) {
        if(textStatus == 'nocontent') {
          //console.log('no results');
          self._showNoResults();
        } else {
          if(res) {
            //console.log('yes, res');
            if( res.hasOwnProperty(self.options.apiPropNames.user) ) {
              self.data.user = res[self.options.apiPropNames.user];
             if (!res.hasOwnProperty(self.options.apiPropNames.results) || res.mpStatList.totalMatches < 1) {
                self._renderHeader();
                self._showNoResults();
                /*$(self.ui.mounts.toggleVisibility).addClass('hide');*/
                /* we never hide this view for age 2 mp, we show in-place messages */
                $(self.ui.mounts.toggleVisibility).removeClass('hide');
              }
            }
            if(res.hasOwnProperty(self.options.apiPropNames.results) && res.mpStatList.totalMatches > 0) {
              $(self.ui.mounts.toggleVisibility).removeClass('hide');
              $(self.ui.mounts.campaign).html('');
              $(self.ui.mounts.campaign).addClass('hide');
              $(self.ui.mounts.msp).removeClass('hide');
              $(self.ui.mounts.noResults).html('');
              self.data.results = res[self.options.apiPropNames.results];
              if(typeof cb === 'function') {
                self.callback();
              }
            }
            if(res.hasOwnProperty(self.options.apiPropNames.careerStats) && res.mpStatList.totalMatches > 0) {
             self.data.careerStats = res[self.options.apiPropNames.careerStats];
             self._winStreak();
             self._wondersBuilt();
             self._castlesBuilt();
             self._trebsBuilt();
             self._farmsBuilt();
             self._highScoreTotal();
             self._unitsCircleChart();
             self._buildingsCircleChart();
             self._donutChart();
             self._renderCivsPlayedChart();
            }
            if(res.hasOwnProperty(self.options.apiPropNames.mpMatches) ) {
              self.data.mpMatches = res[self.options.apiPropNames.mpMatches];
            }
          }
        }
      }).fail(function(){
        //console.log('fail');
      //console.log("ajax failed");
      self._showNoResults();
    })
  }

  _number_format(number, decimals, dec_point, thousands_sep) {
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      toFixedFix = function (n, prec) {
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        var k = Math.pow(10, prec);
        return Math.round(n * k) / k;
      },
      s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
}
