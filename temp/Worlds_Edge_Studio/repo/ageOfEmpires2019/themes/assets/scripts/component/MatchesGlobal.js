import ajaxGet from '../util/ajaxGet';
import Loading from "./Loading";
import config from "../config";
import templateResults from '../templates/statsGlobalMatches.html';
import templateResultsM from '../templates/statsGlobalMatchesMobile.html';
import templatMatchSummary from '../templates/matchSummary.html';
import TweenMax from "gsap";
import ajaxPost from '../util/ajaxPost';

// See this class initialization in:
// /routes/pageTemplatePageStatsGameBlade.js
export default class MatchesGlobal {
  constructor($container, objOptions){
    this.init($container, objOptions);
  }

  init($container, objOptions) {
    let self = this;
    this.options = Object.assign({
      apiPropNames            : null,                                             // object of all api property names
      resultsTemplate         : templateResults,                                  // template for rendering results
      resultsTemplateM        : templateResultsM,                                 // mobile template for rendering results
      templateMatchSummary    : templatMatchSummary,
      dataAttrSort            : 'sort',                                           // data attr on sorting buttons for its category
      numStartIndex           : 1,
      numCountMax             : 15,
      numMaxPages             : 3,
      userId                  : null,
      playerId                : null,
      gamertag                : null,
      game                    : null,
      gameType                : null,
      playerNumber            : null,
      selectorResults         : '#global_matches',                                  // container element of results
      selectorResultItem      : '.search-results__row',                                // element of individual result
      selectorNoResults       : '.no-results',                                         // no results message
      selectorError           : '.error-results',                                      // error message
      selectorBtnSort         : '.sort-trigger',                                  // buttons for sorting columns
      //filtersCallback         : config.events.onClansSearch + '.' + Date.now(), // custom event fired from filters component on submit
      sortCategory            : 'dateTime',                                       // [dateTime|civilization|map|length|wins]
      customEventName         : config.events.onClansSearchResults,               // custom event when new results are loaded
      counter                 : null,
    }, objOptions);


    this.options.dateOptions = {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    };

    this.ui = {
      window                  : $(window),
      container               : $container,
      mount                   : $('#global-matches'),
      $matchesMount           : $('.js-match-summary-mount'),
      pagination              : $('.js-pageNav-lb'),
      totalCount              : $('.js-total'),
      noResults               : $container.find(this.options.selectorNoResults),
      error                   : $container.find(this.options.selectorError),
      win_outer_width         : $(window).outerWidth(),
      endWidth                : $(window).outerWidth(),
    }

    this.constant = {
      animSpeed               : 0.5,                // (s) TweenMax animation speed
      animEase                : 'Quad.easeOut',     // TweenMax animation ease
      animInDistance          : 50,                 // (px) x pos to start from when animating item into list
      animOutDistance         : -200,                // (px) x pos to end at when animating item out of list
      animDistance            : 50,
      animDelay               : 0.1,                // (s) animation delay between items
      pagination              : null,               // placeholder for pagination component
      sortAsc                 : 'ASC',            // sort value for ascending results
      sortDesc                : 'DESC',           // sort value for descending results
      loaderList              : new Loading({       // global loading icon for results list
        container             : this.ui.container,  // element to add loader into
      }),
      loaderFullPage          : new Loading(),      // global loading icon for full page takeover (player status changes)
      api: {
        matches: this.options.api,
        matchDetails: config.api.getAge2MatchDetail,
      },
    };

    this.classes = {
      loading            : 'not-loaded',     // class set on results when animating in
      hidden             : 'hide',           // class removed from error & no results messages
      sortAsc            : 'is-active-asc',  // class on sort buttons in template to determine their sort state
    };

    // Define our data object.
    // This will hold API responses as well as data to send to the API for new requests.
    // All properties are defined below.
    this.data = {
      homeUrl : window.wp_object.homeUrl,
      matchType: 3,
    };

    // Define our search results data object.
    // This gets passed to pagination as well as to the API when requesting new data.
    this.data.apiRequest = {
      [this.options.apiPropNames.userHandle]      : this.options.gamertag,                      // null or text input value (gamertag)
      [this.options.apiPropNames.player]          : this.options.player,
      [this.options.apiPropNames.gameId]          : this.options.gameId,
      [this.options.apiPropNames.game]            : this.options.game,
      //[this.options.apiPropNames.sortCategory]    : this.options.sortCategory,              // sort category for results (gamertag, skill, activity)
      [this.options.apiPropNames.sortCategory]    : null,                                     // sort category for results (clanName, etc)
      [this.options.apiPropNames.sortOrder]       : null,                                     // sort order for results ('ASC', 'DESC')
      [this.options.apiPropNames.startIndex]      : this.options.numStartIndex,               // pagination start index
      [this.options.apiPropNames.countMax]        : this.options.numCountMax,                 // page size limit
      //[this.options.apiPropNames.gameId]          : window.wp_object.clan_ID,
    };

    // Placeholder for our results data.
    // This gets passed to the template to render results.
    this.data.results = [];

    this.data.matchType = 3;
    this.data.page = this.data.apiRequest[this.options.apiPropNames.startIndex];

    this.MatchesLoader = new Loading({
      container:  $('.js-globalmatchesLoader'),
    })

    this._addEventListeners();
    this._getMatches();
  }


  _getMatches() {
    let self = this;
    self.MatchesLoader.show();


    let xhrs = [
      ajaxGet({
        url:  this.constant.api.matches + "?matchType=" + this.data.matchType,
      }),
    ];
    let renderResults = [
      self._renderResults,
    ];
    this._ajaxPromise(xhrs, renderResults);
  }

  _renderResults() {
    let self = this;
    /* check if mobile viewport or larger */
    if($(window).width() >= 1024) {
      this._renderDesktopResults();
    } else {
      this._renderMobileResults();
    }
  }

  _renderDesktopResults() {
    let self = this;
    this.ui.mount.empty();
    this.data.results.board = this.data.matchType;
    let $html = $(this.options.resultsTemplate(this.data.results));
    if(!this.data.results.hasOwnProperty('matchList')) {
      $('#glob-match').hide();
      return;
    }
    this.ui.mount.html($html);
    self._updateMatchesLabel(this.data.matchType);
    let $items = $html.find(this.options.selectorResultItem).addClass(this.classes.loading);
    this._animItems($items);
    if(self.matchesLoader) {
          self.matchesLoader.hide();
        }
  }

  _renderMobileResults() {
    let self = this;
    this.ui.mount.empty();
    this.data.results.board = this.data.matchType;
    let $html = $(this.options.resultsTemplateM(this.data.results));
    if(!this.data.results.hasOwnProperty('matchList')) {
      $('#glob-match').hide();
      return;
    }
    this.ui.mount.html($html);
    self._updateMatchesLabel(this.data.matchType);
    let $items = $html.find(this.options.selectorResultItem).addClass(this.classes.loading);
    this._animItems($items);
    if(self.matchesLoader) {
          self.matchesLoader.hide();
        }
  }

  /**
   * Animate each result item into view
   */
  _animItems($items) {
    $items.each((i, el) => {
      let $curItem = $(el);

      // Animate item into view
      TweenMax.fromTo($curItem, this.constant.animSpeed, {
        autoAlpha : 0,
        x         : this.constant.animDistance,
      }, {
        autoAlpha : 1,
        x         : 0,
        delay     : this.constant.animDelay * i,
        ease      : this.constant.animEase,
        onComplete: () => {
          $curItem.removeAttr('style');
        },
      });

      // Remove hidden class on item
      if ($curItem.hasClass(this.classes.loading)) {
        $curItem.removeClass(this.classes.loading);
      }

      // Remove overflow hidden
      setTimeout(function(){$('.hideOverflow').removeClass('hideOverflow');},2500);
    });
  }

  _ajaxPromise(arr, cb = null, loader = null) {
    let self = this;
    self.ajaxCallback = cb;
    $.when.apply($,arr)
      .done(function(response, textStatus, xhr) {
        if (textStatus === 'nocontent') {
          self._showNoResults();
          delete self.data.results;
          self._showNoResults();
        } else {
          if (response) {

            self.data.results = response;
            if (self.data.results.length <= 0) {
              self._showNoResults();
            } else {
              response[self.options.apiPropNames.list].forEach(function (d) {
                  let date = new Date(d.dateTime);
                  d.dateTime = date.toLocaleString('en-US', self.options.dateOptions);
              });
              self.data.results[self.options.apiPropNames.list] = response[self.options.apiPropNames.list];

              self._renderResults();
            }
          }
        }
      }).fail(function(){
        $('#glob-match').hide();
        if(self.matchesLoader) {
          self.matchesLoader.hide();
        }

    })
  }


  _showNoResults() {
    //this.constant.loaderList.hide();
    //this._killTooltip();
    let $html = $(this.options.resultsTemplate(this.data));
    this.ui.mount.html($html);
    this.matchesLoader.hide();
  }

  _showNothing() {
    this.constant.loaderList.hide();
    this.ui.results.empty();
  }


  _addEventListeners() {
    let self = this;

    $(window).resize(function() {
      self.ui.endWidth = $(window).outerWidth();

        if(self.ui.win_outer_width > 1000 && self.ui.endWidth < 1000) {
          self._renderResults();
        } else if(self.ui.win_outer_width < 1000 && self.ui.endWidth > 1000) {
          self._renderResults();
        }

      self.ui.win_outer_width = self.ui.endWidth;
    });

    $('#global-matches').on('click', '.search-results__row', function(e) {
      if(e.target.nodeName != "A") {
        self._onViewMore(e);
      }
    });

    // Game Mode Select
    $('#game_mode_select').on('change',function(){
      self.data.matchType = $(this).val();
      self._getMatches();
    });
  }

  _updateMatchesLabel(matchesID) {
    let matchesLabel = '';
    switch(matchesID) {
      case "1":
        matchesLabel = '1v1 Deathmatch';
        break;
      case "2":
        matchesLabel = 'Team Deathmatch';
        break;
      case "3":
        matchesLabel = '1v1 RandomMap';
        break;
      case "4":
        matchesLabel = 'Team RandomMap';
        break;
      default:
        matchesLabel = '1v1 RandomMap';
    }
    $('.globalmatches-label').html(matchesLabel);
  }

 _onViewMore(e) {
      let self = this;
      e.preventDefault();
      let gameId = $(e.currentTarget).attr('data-gameId');
      let profileId = $(e.currentTarget).attr('data-profileId');
      this.data = {};
      this.matchDetails = {
          profileId     : profileId,
          gameId        : gameId,
      };
      this.matchInquiryLoader = new Loading({
          container:  $('body'),
      })
      this.matchInquiryLoader.show();
      this._matchDetailSummary(e,profileId);
  }

  _showNoMatchDetails() {
      console.log("error")
  }

  _matchDetailSummary(e,profileId) {
      let self = this;
      self.data.homeUrl = window.wp_object.homeUrl;
      self.data.gameId = window.wp_object.gameId;
      self.data.game = "age2";
      self.data.profileId = profileId;
      self.data.matchReplayUrl = config.api.getAge2MatchReplay;
      let xhrs = [
        ajaxPost({
            url   : this.constant.api.matchDetails,//config.api.getMatchDetail,
            data  : JSON.stringify(self.matchDetails),
        }),
      ];
      this._matchDetailsPromise(xhrs, null, null)
  }

  _renderMatchDetailsResults() {
      let $html = $(this.options.templateMatchSummary(this.data));
      this.ui.$matchesMount.html($html)
      $('#match-details-modal').foundation('open');
      this.matchInquiryLoader.hide();
  }

  _matchDetailsPromise(arr, cb = null, loader = null) {
      let self = this;
      self.ajaxCallback = cb;
      $.when.apply($,arr)
        .done(function(response, textStatus, xhr) {
            if (textStatus === 'nocontent') {
              self._showNoMatchDetails();
            } else {
                if (response) {
                    if( response.hasOwnProperty('matchSummary') && response.hasOwnProperty('playerList')) {
                        self.data.results = response.playerList;
                        self.data.matchSummary = response.matchSummary;
                        self.data.playerList = response.playerList;
                        self._renderMatchDetailsResults();
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
