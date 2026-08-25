import ajaxGet from '../util/ajaxGet';
import ajaxPost from '../util/ajaxPost';
import DonutChart from './StatsCircle';
import Loading from "./Loading";
import config from "../config";
import templateNoResults from '../templates/statsShowNoResults.html';
import templateMapProgress from '../templates/statsMapProgress.html';
import templateCivProgress from '../templates/statsCivProgress.html';
import templateMyStatsNav from '../templates/myStatsNav.html';
import ProgressAnim from '../component/ProgressAnim';
import AreaChart from "./ChartArea";


export default class StatsMSP {
  constructor(options = {}) {
    this._initLoaders();
    this.init(options);
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
      game                : 'age',
      player              : null,
      gameId              : null,
      profileId           : null,
      homeUrl             : window.wp_object.homeUrl,
      renderHeader        : true,
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
      apiRequest  : {
        [this.options.apiPropNames.profileId] : this.options.profileId,
        [this.options.apiPropNames.userHandle] : this.options.gamertag,
        [this.options.apiPropNames.player] : this.options.player,
        [this.options.apiPropNames.gameId] : this.options.gameId,
      },
    }

    $('progress.progress-bar__bar').attr('data-max', '');
    $('progress.progress-bar__bar').attr('max', '');
    $('progress.progress-bar__bar').attr('value', 0);
    $('.progress-bar').attr('data-progress', '');

    this.messages = {
      noStatsMessage    : "No stats available - go play!",
    }
    let xhrs = [
      ajaxPost({
        url: self.options.api,
        data: JSON.stringify(this.data.apiRequest),
      }),
    ];
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
    this._renderStaticStats();
    let chartFunctions = [
      self._renderHeader(),
      self._donutChart(),
      self._progressCirlceChart(),
      self._renderCivsPlayedChart(),
      self._renderMapsPlayedChart(),
      self._renderStaticStats(),
      self._hideLoader(),
    ];
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

    this._timePlayingMP();
    this._averageMatchLength();
    this._unitsKilled();
    this._playersDefeated();
    this._villagersCreated();
    this._wondersBuilt();
    this._winStreak();
    this._longestStreak();
    this._renderAreaChart();
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

  _timePlayingMP() {
    let self = this;
    let timePlayingMP = self.data.results.timePlayingMP;
    let minutes, hours, minutesRemainder;
    if (timePlayingMP) {
      minutes = Math.floor(timePlayingMP / 60);
      hours = Math.floor(minutes / 60);
      minutesRemainder = minutes % 60;
    } else {
      hours = 'N/A';
      minutesRemainder = 'N/A';
    }
    $('.js-hours-timePlayingMP').html(hours)
    $('.js-minutes-timePlayingMP').html(minutesRemainder);
    return;
  }

  _renderAreaChart() {
    let self = this;
    let data = {};
    data.timeToAge = self.data.results.timeToAge;
    data.timeInAge = self.data.results.timeInAge;
    new AreaChart({},{
      mount: '#chart-area',
    },{
      data: data,
    });
    return;
  }

  _averageMatchLength() {
    let self = this;
    let averageMatchLength = self.data.results.averageMatchLength;
    let minutes, hours, minutesRemainder;
    if (averageMatchLength) {
      minutes = Math.floor(averageMatchLength / 60);
      hours = Math.floor(minutes / 60);
      minutesRemainder = minutes % 60;
    } else {
      hours = 'N/A';
      minutesRemainder = 'N/A';
    }
    hours = (hours != 'N/A') ? self._number_format(hours,0,'.',',') : 'N/A';
    minutesRemainder = (hours != 'N/A') ? self._number_format(minutesRemainder,0,'.',',') : 'N/A';
    $('.js-hours-averageMatchLength').html(hours)
    $('.js-minutes-averageMatchLength').html(minutesRemainder)
    return;
  }

  _unitsKilled() {
    let self = this;
    let unitsKilled = self.data.results.unitsKilled;
    unitsKilled = self._number_format(unitsKilled,0,'.',',');
    $('.js-unitsKilled').html(unitsKilled);
    return;
  }

  _playersDefeated(){
    let self = this;
    let playersDefeated = self.options.gameType == 'mp' ? self.data.results.playersDefeated : self.data.results.cpusDefeated;
    playersDefeated = self._number_format(playersDefeated,0,'.',',');
    $('.js-playersDefeated').html(playersDefeated);
    return;
  }

  _villagersCreated() {
    let self = this;
    let villagersCreated = self.data.results.villagersCreated;
    let totalMPMatches = self.data.results.totalMPMatches;
    let avgVillagersCreated = villagersCreated / totalMPMatches;
    avgVillagersCreated = self._number_format(avgVillagersCreated,0,'.',',');
    $('.js-villagersCreated').html(avgVillagersCreated);
    return;
  }

  _winStreak() {
    let self = this;
    let winStreak = self.data.results.currentWinStreak;
    $('.js-winStreak').html(winStreak);
    return;
  }

  _longestStreak() {
    let self = this;
    let longStreak = self.data.results.longestWinStreak;
    $('.js-longestStreak').html(longStreak);
    return;
  }

  _wondersBuilt() {
    let self = this;
    let wondersBuilt = self.data.results.wondersBuilt;
    wondersBuilt = self._number_format(wondersBuilt,0,'.',',');
    $('.js-wondersBuilt').html(wondersBuilt);
    return;
  }

  /* career stats / lifetime stats */
  _careerTotalGames() {
    let self = this;
    let careerTotalGames = self.data.results.careerStats.totalGames;
    $('.js-careerTotalGames').html(careerTotalGames);
    return;
  }

  _careerTotalWins() {
    let self = this;
    let careerTotalWins = self.data.results.careerStats.totalWins;
    $('.js-careerTotalWins').html(careerTotalWins);
    return;
  }

  _careerHighScoreTotal() {
    let self = this;
    let careerHighScoreTotal = self.data.results.careerStats.highScoreTotal;
    $('.js-careerHighScoreTotal').html(careerHighScoreTotal);
    return;
  }

  _careerHighScoreMilitary() {
    let self = this;
    let careerHighScoreMilitary = self.data.results.careerStats.highScoreMilitary;
    $('.js-careerHighScoreMilitary').html(careerHighScoreMilitary);
    return;
  }

  _careerHighScoreEconomy() {
    let self = this;
    let careerHighScoreEconomy = self.data.results.careerStats.highScoreEconomy;
    $('.js-careerHighScoreEconomy').html(careerHighScoreEconomy);
    return;
  }

  _careerHighScoreTechnology() {
    let self = this;
    let careerHighScoreTechnology = self.data.results.careerStats.highScoreTechnology;
    $('.js-careerHighScoreTechnology').html(careerHighScoreTechnology);
    return;
  }

  _careerUnitsLost() {
    let self = this;
    let careerUnitsLost = self.data.results.careerStats.unitsLost;
    $('.js-careerUnitsLost').html(careerUnitsLost);
    return;
  }

  _careerBuildingsRaised() {
    let self = this;
    let careerBuildingsRaised = self.data.results.careerStats.buildingsRaised;
    $('.js-careerUnitsLost').html(careerBuildingsRaised);
    return;
  }

  _careerBuildingsLost() {
    let self = this;
    let careerBuildingsLost = self.data.results.careerStats.buildingsLost;
    $('.js-careerBuildingsLost').html(careerBuildingsLost);
    return;
  }

  _careerCastlesBuilt() {
    let self = this;
    let careerCastlesBuilt = self.data.results.careerStats.castlesBuilt;
    $('.js-careerCastlesBuilt').html(careerCastlesBuilt);
    return;
  }

  _careerTrebsBuilt() {
    let self = this;
    let careerTrebsBuilt = self.data.results.careerStats.trebsBuilt;
    $('.js-careerTrebsBuilt').html(careerTrebsBuilt);
    return;
  }

  _careerFarmsBuilt() {
    let self = this;
    let careerFarmsBuilt = self.data.results.careerStats.farmsBuilt;
    $('.js-careerFarmsBuilt').html(careerFarmsBuilt);
    return;
  }

  _donutChart() {
    let self = this;

    let data = self.data.results.victories.filter(function (item) {
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
    $('.winsnumber').html(totalWins)
    $('.matchesnumber').html(totalMPMatches)
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

  _renderCivsPlayedChart() {
    let self = this;
    let min = Infinity, max = -Infinity, x;
    
    if(self.data.results.hasOwnProperty('civilizationGamesPlayed')){
      let civs = self.data.results.civilizationGamesPlayed;
      let wins = self.data.results.civilizationGamesWon;

      // Check if there any wins and if there are 0 than create some losses in order to support AgeDE data
      if(wins.length < 1){
        for (let i = 0; i < civs.length; i++ ) {
          wins.push(0);
        }
      }

      $('#chart-civs-wins .bargraph-table__stat-cell').html('');
      for( x in civs ) {
        if( civs[x].value > max) max = civs[x].value;
      }

      for (let i = 0; i < civs.length; i++ ) {
        let $html = $(self.options.civProgressTemplate({name: civs[i].name,played: civs[i].value,won: wins[i].value,max: max}));
        $(self.ui.mounts.civsWinsChart).find('tbody').append($html);
      }
      if ($('.progress-bar').length) {
        $('.progress-bar').each((i, el) => {
          new ProgressAnim($(el), {});
        });
      }
    } else {
      let civs = self.data.results.civilizations;

      $('#chart-civs-wins .bargraph-table__stat-cell').html('');
      for( x in civs ) {
        if( civs[x].playCount > max) max = civs[x].playCount;
      }

      for (let i = 0; i < civs.length; i++ ) {
        let $html = $(self.options.civProgressTemplate({name: civs[i].name, played: civs[i].playCount, won: civs[i].winCount, max: max}));
        $(self.ui.mounts.civsWinsChart).find('tbody').append($html);
      }
      if ($('.progress-bar').length) {
        $('.progress-bar').each((i, el) => {
          new ProgressAnim($(el), {});
        });
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
  }

  _ajaxPromise(arr, cb = null, loader = null) {
    var self = this;
    self.callback = cb;
    $.when.apply($,arr)
      .done(function(res, textStatus, xhr) {
        if(textStatus == 'nocontent') {
          self._showNoResults();
        } else {
          if(res) {
            if( res.hasOwnProperty(self.options.apiPropNames.user) ) {
              self.data.user = res[self.options.apiPropNames.user];
              if(!res.mpStatList || !res.hasOwnProperty(self.options.apiPropNames.results) || (res.mpStatList && res.mpStatList.totalMatches < 1)) {
                self._renderHeader();
                self._showNoResults();
                $(self.ui.mounts.toggleVisibility).addClass('hide');
              }
            }
            if(res.hasOwnProperty(self.options.apiPropNames.results) && (res.mpStatList && res.mpStatList.totalMatches > 0)) {
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
          }
        }
      }).fail(function(){
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
