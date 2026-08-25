import templateResults from '../templates/playerList.html';
import errorTemplate from   '../templates/errorMessage.html';
import ajaxPost from '../util/ajaxPost';
import Loading from "./Loading";
import config from '../config';

export default class GetMatchDetails {
  constructor($container, objOptions) {
    this.init($container, objOptions)
  }
  init($container, objOptions) {
    let self = this;
    this.options = Object.assign({
      api           : null,
      apiPropNames  : null,
      template      : templateResults,
      templateError : errorTemplate,
    }, objOptions);
    this.options.dateOptions = {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };
    this.ui = {
      $container  : $container,
      $loader     : $container,
      $errorMount : $('.js-errorMessage'),
    }
    let gameId = ( window.wp_object.gameId ) ? window.wp_object.gameId : null;
    let game = ( window.wp_object.game ) ? window.wp_object.game : null;
    let profileId = ( window.wp_object.profileId ) ? window.wp_object.profileId : null;
    this.data = {
      homeUrl     : window.wp_object.homeUrl,
      apiRequest  : {
        gameId      : gameId,
        game        : game,
        profileId   : profileId,
      },
    }
    this.loader = new Loading({
      container : $('body'),
    })
    this.loader.show();
    this._getMatchDetail();
  }
  _getMatchDetail() {
    let self = this;
    if( this.data.apiRequest.gameId ) {
      let xhrs = [
        ajaxPost({
          url   : this.options.api,
          data  : JSON.stringify(this.data.apiRequest),
        }),
      ];
      this._ajaxPromise(xhrs, null, null);
    } else {
      this._showNoResults();
    }
  }
  _ajaxPromise(arr, cb = null, loader = null) {
    var self = this;
    self.callback = cb;
    //console.log("Get match details before when")
    $.when.apply($,arr)
      .done(function(res, textStatus, xhr) {
        if(textStatus == 'nocontent') {
          self._showNoResults();
        } else if ( textStatus == '' ){
          //alert("no textstatus");
        } else {
          if(res) {
            if(res.hasOwnProperty(self.options.apiPropNames.results)) {
              self.data.matchSummary = res['matchSummary'];
              self.data.results = res[self.options.apiPropNames.results];
              self.data['game'] = self.data.apiRequest.game;
              let date = new Date(self.data.matchSummary.dateTime);
              self.data.matchSummary.matchDate = date.toLocaleDateString('en-US', self.options.dateOptions);
              self._renderResults();
              self._renderSummary();
              if(typeof cb === 'function') {
                self.callback();
              }
            }
            if(res['matchSummary'].errorMessage != '' && res['matchSummary'].errorMessage ) {
              self._showError();
            }
          }
        }
      }).fail(function(xhr, textStatus, errorThrown){
        self.data.matchSummary.errorMessage = textStatus;
        self._showError();
    })
  }
  _renderResults() {
    if( this.data.matchSummary.errorMessage != '' && this.data.matchSummary.errorMessage ) {
      this._showError();
    }
    this.ui.$errorMount.addClass('hide');
    this.ui.$container.empty();
    this.data.matchReplayUrl = config.api.getAge2MatchReplay;
    let $html = $(this.options.template(this.data));
    this.ui.$container.html($html);
    this.loader.hide();
  }
  _renderSummary() {
      let self = this;
      let timePlayingMP = self.data.matchSummary.matchLength;
      let minutes, hours, minutesRemainder;
      if(self.data.game == 'age2') {
        $('.stats-match-header__value.total').css("display","none");
        if(timePlayingMP > 60) {
          hours = Math.round(minutes / 60);
          minutes = Math.round(minutes % 60);
          $('.js-matchLength-value-hours').html(hours + 'hrs');
          $('.js-matchLength-value-mins').html(minutes + 'min');
        } else {
          minutes = Math.round(timePlayingMP);
          $('.js-matchLength-value-hours').css('display','none');
          $('.js-matchLength-value-mins').html(minutes + 'min');
        }
      } else {
        if (timePlayingMP) {
          minutes = Math.floor(timePlayingMP / 60);
          hours = Math.floor(minutes / 60);
          minutesRemainder = minutes % 60;
        } else {
          hours = 'N/A';
          minutesRemainder = 'N/A';
        }
        $('.js-matchLength-value-hours').html(hours + 'hrs');
        $('.js-matchLength-value-mins').html(minutesRemainder + 'min');
        $('.stats-match-header__value.hrs_mins').css("display","inline-block");
        $('.stats-match-header__value.total').css("display","none");
      }

    $('.js-matchMap-value').html(self.data.matchSummary.mapTypeName)
    $('.js-matchDate-value').html(self.data.matchSummary.matchDate)
  }
  _showError() {
    this.ui.$errorMount.empty();
    let $html = $(this.options.templateError(this.data))
    this.ui.$errorMount.html($html);
    this.ui.$errorMount.removeClass('hide');
    this.loader.hide();
  }
  _showNoResults() {
    this.ui.$container.html('No results')
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