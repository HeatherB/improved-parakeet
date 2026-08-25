import * as d3 from "d3";
import TweenMax from 'gsap';
import config from '../config';
import Loading from './Loading';
import templateResults from '../templates/mpMatch.html';
import templatMatchSummary from '../templates/matchSummary.html';
import ParseDate from '../util/parseDate';
import Pagination from './Pagination';
import ajaxPost from '../util/ajaxPost';

export default class MPMatchList {
    constructor($container, objOptions){
        this.init($container, objOptions);
    }

    init($container, objOptions) {
        let self = this;
        this.options = Object.assign({
            apiPropNames            : null,                                             // object of all api property names
            resultsTemplate         : templateResults,                                  // template for rendering results
            templateMatchSummary    : templatMatchSummary,
            api                     : null,
            apiTemp                 : window.wp_object.jsonurl + 'statsMPMatches.json',
            apiLive                 : config.api.MPMatchList,
            dataAttrSort            : 'sort',                                           // data attr on sorting buttons for its category
            numStartIndex           : 1,
            numCountMax             : 10,
            numMaxPages             : 3,
            showPagination          : true,
            paginationCallback      : config.events.onPagination + '.' + Date.now(),    // custom event fired from pagination component on click
            userId                  : null, //'2535442682337665',
            playerId                : null,
            gamertag                : null,
            game                    : null,
            gameType                : null,
            profileId               : null,
            playerNumber            : null,
            selectorResults         : '.results-container',                                  // container element of results
            selectorResultItem      : '.search-results__row',                                // element of individual result
            selectorNoResults       : '.no-results',                                         // no results message
            selectorError           : '.error-results',                                      // error message
            selectorBtnSort         : '.sort-trigger',                                  // buttons for sorting columns
            //filtersCallback         : config.events.onClansSearch + '.' + Date.now(), // custom event fired from filters component on submit
            sortCategory            : 'dateTime',                                       // [dateTime|civilization|map|length|wins]
            customEventName         : config.events.onClansSearchResults,               // custom event when new results are loaded
            newPagination           : true,
            counter                 : null,
            matchType               : null,
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
            mount                   : $('.results-container'),
            $matchesMount           : $('.js-match-summary-mount'),
            pagination              : $('.js-pageNav'),
            totalCount              : $('.js-total'),
            noResults               : $container.find(this.options.selectorNoResults),
            error                   : $container.find(this.options.selectorError),
            rmNoResults             : $('.no-results'),
        }

        this.constant = {
            animSpeed               : 0.5,                // (s) TweenMax animation speed
            animEase                : 'Quad.easeOut',     // TweenMax animation ease
            animInDistance          : 50,                 // (px) x pos to start from when animating item into list
            animOutDistance         : -200,               // (px) x pos to end at when animating item out of list
            animDelay               : 0.1,                // (s) animation delay between items
            pagination              : null,               // placeholder for pagination component
            sortAsc                 : 'ASC',            // sort value for ascending results
            sortDesc                : 'DESC',           // sort value for descending results
            loaderList              : new Loading({       // global loading icon for results list
                container           : this.ui.container,  // element to add loader into
            }),
            loaderFullPage          : new Loading(),      // global loading icon for full page takeover (player status changes)
            game: {
              age: {
                api: {
                  sp: config.api.SPMatchList,
                  mp: config.api.MPMatchList,
                  matchDetails: config.api.getMatchDetail,
                },
              },
              age2: {
                api: {
                  sp: config.api.Age2SPMatchList,
                  mp: config.api.Age2MPMatchList,
                  matchDetails: config.api.getAge2MatchDetail,
                },
              },
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
        };

        // Define our search results data object.
        // This gets passed to pagination as well as to the API when requesting new data.
        this.data.apiRequest = {
            [this.options.apiPropNames.userHandle]      : this.options.gamertag,                      // null or text input value (gamertag)
            [this.options.apiPropNames.player]          : this.options.player,
            [this.options.apiPropNames.gameId]          : this.options.gameId,
            [this.options.apiPropNames.game]            : this.options.game,
            [this.options.apiPropNames.profileId]       : this.options.profileId,
            //[this.options.apiPropNames.sortCategory]    : this.options.sortCategory,              // sort category for results (gamertag, skill, activity)
            [this.options.apiPropNames.sortCategory]    : null,                                     // sort category for results (clanName, etc)
            [this.options.apiPropNames.sortOrder]       : null,                                     // sort order for results ('ASC', 'DESC')
            [this.options.apiPropNames.startIndex]      : this.options.numStartIndex,               // pagination start index
            [this.options.apiPropNames.countMax]        : this.options.numCountMax,                 // page size limit
            [this.options.apiPropNames.matchType]       : this.options.matchType,
            //[this.options.apiPropNames.gameId]          : window.wp_object.clan_ID,
        };

        // Placeholder for our results data.
        // This gets passed to the template to render results.
        this.data.results = [];

        // Placeholder for total results returned for a given search.
        // This gets passed to the pagination component when instantiated.
        this.data.total = null;


        this.MPMatchesLoader = new Loading({
            container: $('.js-matchesLoader'),
        })

        this._addEventListeners();

        //let getMatches = [self._getMatches(1)];
        //this._ajaxPromise(getMatches, self.MPMatchesLoader)
        this._getMatches();
    }
    kill() {
        this._killPagination();
    }
    _getMatches() {
        let self = this;
        this.MPMatchesLoader.show();

        let xhrs = [
          ajaxPost({
              url:  this.constant.game[this.options.game].api[this.options.gameType],
              data: JSON.stringify(this.data.apiRequest),
          }),
        ];
        let renderResults = [
            self._renderResults,
        ];
        this._ajaxPromise(xhrs, renderResults);
    }
    _renderResults() {
        let self = this;
        this.ui.mount.empty();
        this.ui.rmNoResults.empty();
        let $html = $(this.options.resultsTemplate(this.data));
        this.ui.mount.html($html);
        let $items = $html.find(this.options.selectorResultItem).addClass(this.classes.loading);
        this._animItems($items);
        this.MPMatchesLoader.hide();
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
        });
    }

    _ajaxPromise(arr, cb = null, loader = null) {
        let self = this;
        self.ajaxCallback = cb;
        $.when.apply($,arr)
          .done(function(response, textStatus, xhr) {
              //console.log("AFTER SUCCESSS IN MPMATCHLIST")
              if (textStatus === 'nocontent') {
                  self._showNoResults();
                  delete self.data.results;
                  self._showNoResults();
              } else {
                  if (response) {
                      if (response.hasOwnProperty(self.options.apiPropNames.matches) && response[self.options.apiPropNames.matches] !== null) {
                          response[self.options.apiPropNames.matches].forEach(function (d) {
                              let date = new Date(d.dateTime);
                              d.dateTime = date.toLocaleString('en-US', self.options.dateOptions);
                          })
                          self.data.results = response[self.options.apiPropNames.matches];

                          self.data.total = response[self.options.apiPropNames.resultsMeta].totalMatches;
                          self.data.age2Total = response.totalMatches;
                          self.data.gamertag = self.options.playerId;
                          self.options.newPagination = false;
                      }

                      if (response[self.options.apiPropNames.resultsMeta].hasOwnProperty(self.options.apiPropNames.total)) {
                          self.data.total = response[self.options.apiPropNames.resultsMeta][self.options.apiPropNames.total];
                      }

                      // console.warn('search merged response: ', this.data);

                      if (self.data.results.length <= 0) {
                          //console.log('api thinks no results');
                          self._showNoResults();
                      } else {
                          self._renderResults();
                          self._renderPagination();
                          //self._updateTotal();
                      }
                  }
              }
              self.MPMatchesLoader.hide();
          }).fail(function(){
            self.MPMatchesLoader.hide();
            //console.log("ajax failed");
        })
    }

    _renderPagination() {
        let self = this;
        if(this.options.game == 'age2'){
            if (this.options.showPagination && !this.constant.pagination) {
                this.constant.pagination = new Pagination(this.ui.pagination, {
                    numPageStart  : this.data.apiRequest[this.options.apiPropNames.startIndex],
                    numPageSize   : this.data.apiRequest[this.options.apiPropNames.countMax],
                    numMaxPages   : this.options.numMaxPages,
                    numTotalItems : this.data.age2Total,
                });
            }
        }
        if (this.options.showPagination && !this.constant.pagination) {
            this.constant.pagination = new Pagination(this.ui.pagination, {
                numPageStart  : this.data.apiRequest[this.options.apiPropNames.startIndex],
                numPageSize   : this.data.apiRequest[this.options.apiPropNames.countMax],
                numMaxPages   : this.options.numMaxPages,
                numTotalItems : this.data.total,
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
        if(this.options.game == 'age2'){
            let $no_results_msg = "There are no recent matches for the selected game mode.";
            this.ui.rmNoResults.html($no_results_msg);
        }
        let $html = $(this.options.resultsTemplate(this.data));
        this.ui.mount.html($html);
        this.MPMatchesLoader.hide();
    }

    _showNothing() {
        this.constant.loaderList.hide();
        this._killPagination();
        this._killTooltip();
        this.ui.results.empty();
        this.ui.rmNoResults.empty();
    }

    /**
     * Update the display of total players
     */
    // _updateTotal() {
    //     this.ui.totalCount.text(this.data.total);
    // }

    _onPaginationCallback(e, numPage) {
        this.data.apiRequest[this.options.apiPropNames.startIndex] = numPage;
        this._getMatches();
    }

    _onSortClick(e) {
        e.preventDefault();

        let $trigger = $(e.currentTarget);
        let category = $trigger.data(this.options.dataAttrSort);
        let sortOrder = $trigger.hasClass(this.classes.sortAsc) ? this.constant.sortDesc : this.constant.sortAsc;

        this.data.apiRequest[this.options.apiPropNames.sortCategory] = category;
        this.data.apiRequest[this.options.apiPropNames.sortOrder]    = sortOrder;

        this._getMatches();
    }

    _onViewMore(e) {
        let self = this;
        e.preventDefault();
        let gameId = $(e.currentTarget).attr('data-gameId');
        this.data2 = {};
        this.matchDetails = {
            profileId     : window.wp_object.profileId,
            gameId        : gameId,
            //playerNumber  : self.options.playerNumber,
        };
        this.matchInquiryLoader = new Loading({
            container:  $('body'),
        })
        this.matchInquiryLoader.show();
        this._matchDetailSummary();
    }

    _removeEventListeners() {
        this.ui.window.off(this.options.paginationCallback);
    }

    _addEventListeners() {
      let self = this;
        this.ui.container.on('click', this.options.selectorBtnSort, this._onSortClick.bind(this));
        this.ui.container.on('click', '.search-results__row', this._onViewMore.bind(this))
        //this.ui.window.on(this.options.filtersCallback, this._onFiltersCallback.bind(this));
        this.ui.window.on(this.options.paginationCallback, this._onPaginationCallback.bind(this));

        // Game Mode Select
        $('#game_mode_select_bottom').on('change',function(){
          self._killPagination();
          self.data.apiRequest.matchType = $(this).val();
          self.data.apiRequest.page = 1;
          self._getMatches();
        });


    }
    _matchDetailSummary() {
        let self = this;
        self.data2.homeUrl = window.wp_object.homeUrl;
        self.data2.gameId = window.wp_object.gameId;
        self.data2.game = window.wp_object.game;
        self.data2.profileId = window.wp_object.profileId;
        self.data2.matchReplayUrl = config.api.getAge2MatchReplay;
        let xhrs = [
          ajaxPost({
              url   : this.constant.game[this.options.game].api.matchDetails,//config.api.getMatchDetail,
              data  : JSON.stringify(self.matchDetails),
          }),
        ];
        this._matchDetailsPromise(xhrs, null, null)
    }
    _renderMatchDetailsResults() {
        let $html = $(this.options.templateMatchSummary(this.data2));
        this.ui.$matchesMount.html($html)
        $('#match-details-modal').foundation('open');
        this.matchInquiryLoader.hide();

    }
    _showNoMatchDetails() {
        console.log("error")
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
                          self.data2.results = response.playerList;
                          self.data2.matchSummary = response.matchSummary;
                          self.data2.playerList = response.playerList;
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
