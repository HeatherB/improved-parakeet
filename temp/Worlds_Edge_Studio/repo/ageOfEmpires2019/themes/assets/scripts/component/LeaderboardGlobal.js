import ajaxGet from '../util/ajaxGet';
import Pagination from './Pagination';
import Loading from "./Loading";
import config from "../config";
import templateResults from '../templates/statsGlobalLeader.html';
import templateResultsM from '../templates/statsGlobalLeaderMobile.html';
import TweenMax from "gsap";

export default class LeaderboardGlobal {
  constructor($container, objOptions){
    this.init($container, objOptions);
  }

  init($container, objOptions) {
    let self = this;

    this.options = Object.assign({
      apiPropNames            : null,                                             // object of all api property names
      resultsTemplate         : templateResults,                                  // template for rendering results
      resultsTemplateM        : templateResultsM,                                  // template for rendering results for mobile display
      dataAttrSort            : 'sort',                                           // data attr on sorting buttons for its category
      numStartIndex           : 1,
      numCountMax             : 15,
      numMaxPages             : 3,
      showPagination          : true,
      paginationCallback      : config.events.onPagination + '.' + Date.now(),    // custom event fired from pagination component on click
      userId                  : null,
      playerId                : null,
      gamertag                : null,
      game                    : null,
      gameType                : null,
      playerNumber            : null,
      selectorResults         : '#global-leaderboard',                                  // container element of results
      selectorResultItem      : '.search-results__row',                                // element of individual result
      selectorNoResults       : '.no-results',                                         // no results message
      selectorError           : '.error-results',                                      // error message
      selectorBtnSort         : '.sort-trigger',                                  // buttons for sorting columns
      //filtersCallback         : config.events.onClansSearch + '.' + Date.now(), // custom event fired from filters component on submit
      sortCategory            : 'dateTime',                                       // [dateTime|civilization|map|length|wins]
      customEventName         : config.events.onClansSearchResults,               // custom event when new results are loaded
      newPagination           : true,
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
      mount                   : $('#global-leaderboard'),
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
        leaderboard: this.options.api,
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
    // wp_object global JS variable is created in src/setup.php.

    this.data = {
      homeUrl : window.wp_object.homeUrl,
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

    this.data.board = this.options.leaderboardQueryStringData;
    this.data.page = this.data.apiRequest[this.options.apiPropNames.startIndex];
    this.data.rankCount = ( this.options.numCountMax * (this.data.page - 1) );

    this.LeaderboardLoader = new Loading({
      container:  $('.js-leaderboardLoader'),
    })

    this._addEventListeners();
    this._getLeaders();
  }
  kill() {
    this._killPagination();
  }

  _getLeaders() {
    let self = this;
    self.LeaderboardLoader.show();


    let xhrs = [
      ajaxGet({
        url:  this.constant.api.leaderboard + "?board=" + this.data.board + "&page=" + this.data.page,
      }),
    ];
    let renderResults = [
      self._renderResults,
    ];
    this._ajaxPromise(xhrs, renderResults);
  }

  _renderResults() {
    let self = this;

    if($(window).width() >= 1024) {
      this._renderDesktopResults();
    } else {
      this._renderMobileResults();
    }
  }

  _renderDesktopResults() {
    let self = this;
    self.data.rankCount = ( self.options.numCountMax * (self.data.page - 1) );
    this.ui.mount.empty();
    this.data.results.board = self.data.board;
    if(!this.data.results.hasOwnProperty('items')) {
      $('#glob-leads').hide();
      return;
    }
    let $html = $(this.options.resultsTemplate(this.data.results));
    this.ui.mount.html($html);
    let $items = $html.find(this.options.selectorResultItem).addClass(this.classes.loading);
    this._animItems($items);
    if(self.LeaderboardLoader) {
      self.LeaderboardLoader.hide();
    }
  }

  _renderMobileResults() {
    let self = this;
    self.data.rankCount = ( self.options.numCountMax * (self.data.page - 1) );
    this.ui.mount.empty();
    this.data.results.board = self.data.board;
    if(!this.data.results.hasOwnProperty('items')) {
      $('#glob-leads').hide();
      return;
    }
    let $html = $(this.options.resultsTemplateM(this.data.results));
    this.ui.mount.html($html);
    let $items = $html.find(this.options.selectorResultItem).addClass(this.classes.loading);
    this._animItems($items);
    if(self.LeaderboardLoader) {
      self.LeaderboardLoader.hide();
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
            self.options.newPagination = false;
            if (self.data.results.length <= 0) {
              self._showNoResults();
            } else {
              self._renderResults();
              self._renderPagination();
            }
          }
        }
      }).fail(function(){
        $('#glob-leads').hide();
      if(self.LeaderboardLoader) {
        self.LeaderboardLoader.hide();
      }
    })
  }

  _renderPagination() {
    let self = this;
    if (this.options.showPagination && !this.constant.pagination) {
      this.constant.pagination = new Pagination(this.ui.pagination, {
        numPageStart  : this.data.apiRequest[this.options.apiPropNames.startIndex],
        numPageSize   : this.data.apiRequest[this.options.apiPropNames.countMax],
        numMaxPages   : this.options.numMaxPages,
        numTotalItems : this.data.results.count,
      });
    }
  }

  _killPagination() {
    if (this.constant.pagination) {
      this.constant.pagination.kill();
      this.constant.pagination = null;
    }
  }

  _showNoResults() {
    //this.constant.loaderList.hide();
    this._killPagination();
    //this._killTooltip();
    let $html = $(this.options.resultsTemplate(this.data));
    this.ui.mount.html($html);
    this.leaderboardLoader.hide();
  }

  _showNothing() {
    this.constant.loaderList.hide();
    this._killPagination();
    this.ui.results.empty();
  }

  _onPaginationCallback(e, numPage) {
    this.data.apiRequest[this.options.apiPropNames.startIndex] = numPage;
    this.data.page = numPage;
    this._getLeaders();
  }

  _removeEventListeners() {
    // this.ui.container.off('click');
    this.ui.window.off(this.options.paginationCallback);
  }

  _addEventListeners() {
    let self = this;
    this.ui.window.on(this.options.paginationCallback, this._onPaginationCallback.bind(this));

    $(window).resize(function() {
      self.ui.endWidth = $(window).outerWidth();

        if(self.ui.win_outer_width > 1000 && self.ui.endWidth < 1000) {
          self._renderResults();
        } else if(self.ui.win_outer_width < 1000 && self.ui.endWidth > 1000) {
          self._renderResults();
        }

      self.ui.win_outer_width = self.ui.endWidth;
    });


    // Game Mode Select
    $('#game_mode_select').on('change',function(){
      /*$('.leaderboard-label').html($(this).val());*/
      self._updateLeaderboardLabel($(this).val());
      self.data.apiRequest[self.options.apiPropNames.startIndex] = 1;
      self._killPagination();
      self.data.page = 1;
      self.data.board = $(this).val();
      self._getLeaders();
    });
  }

  _updateLeaderboardLabel(leaderboardID) {
    let leaderboardLabel = '';

    switch(this.options.game) {
      case 'ageiide':
        switch(leaderboardID) {
          case "1":
            leaderboardLabel = '1v1 Deathmatch';
            break;
          case "2":
            leaderboardLabel = 'Team Deathmatch';
            break;
          case "3":
            leaderboardLabel = '1v1 RandomMap';
            break;
          case "4":
            leaderboardLabel = 'Team RandomMap';
            break;
          default:
            leaderboardLabel = 'LEADERBOARDS';
        }
        break;
      case 'ageiiide':
        switch(leaderboardID) {
          case "1":
            leaderboardLabel = '1v1 Supremacy';
            break;
          case "2":
            leaderboardLabel = 'Team Supremacy';
            break;
          case "3":
            leaderboardLabel = 'Treaty';
            break;
          case "4":
            leaderboardLabel = 'Deathmatch';
            break;
          default:
            leaderboardLabel = 'LEADERBOARDS';
          }
          break;
      default:
        leaderboardLabel = 'LEADERBOARDS';
    }

    $('.leaderboard-label').html(leaderboardLabel);
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
