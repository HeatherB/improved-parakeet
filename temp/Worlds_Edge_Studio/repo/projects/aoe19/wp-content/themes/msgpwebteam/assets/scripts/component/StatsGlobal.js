import ajaxGet from '../util/ajaxGet';
import ajaxPost from '../util/ajaxPost';
import DonutChart from './StatsDonut';
import Loading from "./Loading";
import config from "../config";
import templateNoResults from '../templates/statsShowNoResults.html';
import templateGlobalLeader from '../templates/statsGlobalLeader.html';
import templateGlobalCivProgress from '../templates/statsGlobalCivProgress.html';
import templateGlobalWinStreaks from '../templates/statsGlobalStreaks.html';
import templateGlobalWarLords from '../templates/statsGlobalWarLords.html';
import templateMapProgress from '../templates/statsMapTops.html';
import GlobalProgressAnim from '../component/GlobalProgressAnim';

export default class StatsGlobal {
  constructor(options = {}) {
    this._initLoaders();
    this.init(options);
  }

  init(options) {
    let self = this;//

    this.options = Object.assign({
      api                 : null,
      leaderboard         : null,
      apiPropNames        : null,
      noResultsTemplate   : templateNoResults,
      globalLeader        : templateGlobalLeader,
      globalCivProgress   : templateGlobalCivProgress,
      globalWinStreaks    : templateGlobalWinStreaks,
      globalWarLords      : templateGlobalWarLords,
      mapProgressTemplate : templateMapProgress,
    }, options);

    this.ui = {
      mounts: {
        statsMain               : '.stats-main',
        header                  : '.js-myStatsNav-mount',
        campaign                : '.campaign-results-container',
        msp                     : '.stats-msp',
        toggleVisibility        : '.stats-toggle-visibility',
        noResults               : '.stats-showNoResults',
        globalLeaderboard       : '#global_leaderboard',
        progressCirlceChart     : '#chart-wins',
        civsWinsChart           : '#chart-civs',
        donutChart              : '#chart-victorytype',
        progressBars            : $('.progress-bar'),
        winStreaks              : $('#global_win_streaks'),
        warLords                : '#global_warlords',
        mapsWinsChart           : '#chart-maps-top-play',
      },
    }

    this.data = {
      results: null,
      leaderboard: null,
      gameSize: null,
      gameModeRanked: null,
      gameModeMP: null,
      civStats: null,
      mapStats: null,
      isRanked: this.options.isRanked,
      gameMode: this.options.gameMode,
      matchSize: this.options.matchSize,
      mapSize: this.options.mapSize,
      apiRequest  : {
        [this.options.apiPropNames.isRanked] : this.options.isRanked,
        [this.options.apiPropNames.gameMode] : this.options.gameMode,
        [this.options.apiPropNames.matchSize] : this.options.matchSize,
        [this.options.apiPropNames.mapSize] : this.options.mapSize,
      },
    }

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
    let chartFunctions = [
      self._renderCivsPlayedLeaderboard(),
      self._renderTopMaps(),
      self._hideLoader(),
    ];
    this._ajaxPromise(chartFunctions, null, null)
  }

  _hideLoader() {
    let self = this;
    // self.loader.hide();
  }

  _showNoResults(){
    let self = this;
    console.log('no results');
  }

  _renderCivsPlayedLeaderboard() {
    let self = this;
    let civs = self.data.civStats;
    let totalUsage = 0;
    let min = Infinity, civMax = -Infinity, winMax = -Infinity, x;

    if(civs.length === 0) {
      $('#civs-and-maps').hide();
      return;
    }

    $(self.ui.mounts.civsWinsChart).find('tbody').empty();
    for (let i = 0; i < civs.length; i++ ) {
      let $html = $(self.options.globalCivProgress({
        name: civs[i].civilication,
        played: civs[i].popularity,
        won: 100,
        civMax: (civs[i].popularity * 100 / civs[i].popularity),
        winMax: (civs[i].victoryCount * 100 / civs[i].selectionCount).toFixed(2),
      }));
      $(self.ui.mounts.civsWinsChart).find('tbody').append($html);
    }
    return;
  }

  _renderTopMaps() {
    let self = this;
    let maps = self.data.mapStats;
    let min = Infinity, max = -Infinity, x;

    if(maps.length === 0) {
      $('#civs-and-maps').hide();
      return;
    }

    $(self.ui.mounts.mapsWinsChart).find('tbody').empty();
    for (x in maps) {
      if (maps[x].selectionCount > max) max = maps[x].selectionCount;
    }

    for (let i = 0; i < maps.length; i++) {
      let $html = $(self.options.mapProgressTemplate({
        name: maps[i].mapName,
        played: maps[i].playPercent.toFixed(2),
        won: (maps[i].selectionCount * 100 / maps[i].selectionCount),
        max: 100,
      }));
      $(self.ui.mounts.mapsWinsChart).find('tbody').append($html);
    }
    return;
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
            if(res.hasOwnProperty(self.options.apiPropNames.civStats)) {
              self.data.civStats = res.civStats;
              /*if(typeof cb === 'function') {
                self.callback();
              }*/
            }
            if(res.hasOwnProperty(self.options.apiPropNames.mapStats)) {
              self.data.mapStats = res.mapStats;
              if(typeof cb === 'function') {
                self.callback();
              }
            }
          }
        }
      }).fail(function(){
      //console.log("ajax failed");
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
