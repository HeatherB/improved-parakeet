/**
 * ClansPlayersList
 *
 * @description
 * Used on clan detail page for members, applicants and blocked players lists.
 * Render a paginated list of players that can be searched/sorted.
 * Results update based on callback fired from Pagination with new page index to request.
 * Search/Sort results make a new request for results and rebuild the pagination.
 */

import Foundation from 'foundation';
import TweenMax from 'gsap';
import config from '../config';
import Loading from '../component/Loading';
import ajaxGet from '../util/ajaxGet';
// import ajaxPost from '../util/ajaxPost';
import Tooltip from '../component/Tooltip';
import Pagination from '../component/Pagination';
import templateResults from '../templates/clansPlayersList.html';
import templateFilters from '../templates/clansPlayersFilters.html';

export default class ClansPlayersList {
  constructor($container, objOptions) {
    this.init($container, objOptions);
  }

  init($container, objOptions) {
    this.options = Object.assign({
      numMaxPages           : 3,                                // max number of pagination buttons to display (excluding first/last)
      numStartIndex         : 1,                                  // current item index to request (1 based)
      numCountMax           : 10,                                 // max items to display per page
      sortCategory          : 'gamertag',                         // default sort category
      selectorFilters       : '.clans-players-list__filters',     // container of search form
      selectorForm          : '.clans-players-list__form',        // search form
      selectorTerm          : '#q',                               // input for search term
      selectorClear         : '.clear-search',                     // clear search button
      selectorSort          : '#sortCategory',                    // select menu for sort category
      selectorResults       : '.results-container',               // container element of results
      selectorResultItem    : '.search-results__row',             // element of individual result
      selectorAnimItem      : '.search-results__animate',         // child elements to animate when removing row
      selectorAnimLabel     : '.clan-player-role',                // player status label to animate on promote/demote
      selectorToolip        : '.tooltip-menu',                    // container for tooltips (overwrite with $container id .tooltip-menu)
      selectorStatus        : '.search-results__label',           // element of player status (officer, member, etc)
      selectorPromoteOfficer: null,                               // (#confirm-promote-officer) button in modal warning to confirm promoting officer to founder (only set this for members list)
      dataAttrBtnAction     : 'clan-player-action',               // data attr name for promote, demote, etc buttons. used for click events and type of action to take
      dataAttrPlayerId      : 'player-id',                        // data attr name on individual results for getting the player id
      selectorNoResults     : '.no-results',                      // no results message
      selectorErrorList     : '.error-results',                   // error message for list results
      selectorErrorModal    : '#error-player-list',               // error modal for player actions
      selectorErrorModalMsg : '#error-player-list__msg',          // error message inside modal for player actions
      apiUrlList            : config.api.clansMembersList,        // api url for players list
      apiUrlStatus          : config.api.clansAction,             // api url for player status changes
      apiPropNames          : null,                               // object of all api property names
      filtersTemplate       : templateFilters,                    // template for rendering search filters
      resultsTemplate       : templateResults,                    // template for rendering results
      selectorPagination    : '.clans-players-list__pagination',  // selector of pagination
      showPagination        : true,                               // should we create a pagination component?
      selectorTotal         : '.clans-players-list__count span',  // element to display total players count
      paginationCallback    : config.events.onPagination + '.' + Date.now(), // custom event fired from pagination component on click
    }, objOptions);

    this.ui = {
      window                : $(window),
      container             : $container,
      filters               : $container.find(this.options.selectorFilters),
      filtersForm           : null,
      inputTerm             : null,
      selectSort            : this.options.selectorSort,
      clearSearch           : this.options.selectorClear,
      form                  : this.options.selectorForm,
      totalCount            : $container.find(this.options.selectorTotal),
      results               : $container.find(this.options.selectorResults),
      noResults             : $container.find(this.options.selectorNoResults),
      errorList             : $container.find(this.options.selectorErrorList),
      errorModal            : $(this.options.selectorErrorModal),
      errorModalMsg         : $(this.options.selectorErrorModalMsg),
      pagination            : $container.find(this.options.selectorPagination),
      curPlayer             : null,
      btnPromoteOfficer     : $(this.options.selectorPromoteOfficer),
      memberCount           : $('#memberCount'),
      blockedList           : $('#clans-blocked-list'),
      applicantList         : $('#clans-applicants-list'),
      membersList           : $('#clans-members-list'),
    };

    this.constant = {
      animSpeed             : 0.5,                // (s) TweenMax animation speed
      animEase              : 'Quad.easeOut',     // TweenMax animation ease
      animInDistance        : 50,                 // (px) x pos to start from when animating item into list
      animOutDistance       : -200,               // (px) x pos to end at when animating item out of list
      animDelay             : 0.1,                // (s) animation delay between items
      getAjaxContent        : ajaxGet,            // global utility for ajax requests
      tooltip               : null,               // placeholder for toolitp component
      pagination            : null,               // placeholder for pagination component
      loaderList            : new Loading({       // global loading icon for results list
        container           : this.ui.container,  // element to add loader into
      }),
      loaderFullPage        : new Loading(),      // global loading icon for full page takeover (player status changes)
    };

    this.classes = {
      founder               : 'is-founder',
      officer               : 'is-officer',
      member                : 'is-member',
      loading               : 'not-loaded',       // class set on results when animating in
      hidden                : 'hide',             // class removed from error & no results messages
    };

    // Define our data object.
    // This will hold API responses as well as data to send to the API for new requests.
    // All properties are defined below.
    this.data = {};

    // Define our search results data object.
    // This gets passed to pagination as well as to the API when requesting new data.
    this.data.apiRequest = {
      [this.options.apiPropNames.term]         : null,                       // null or text input value (gamertag)
      [this.options.apiPropNames.sortCategory] : this.options.sortCategory,  // sort category for results (gamertag, skill, activity)
      [this.options.apiPropNames.startIndex]   : this.options.numStartIndex, // pagination start index
      [this.options.apiPropNames.countMax]     : this.options.numCountMax,   // page size limit
      [this.options.apiPropNames.clanId]       : window.wp_object.clan_ID, 
    };

    // Placeholder for our results data.
    // This gets passed to the template to render results.
    this.data.results = [];

    // Placeholder for total results returned for a given search.
    // This gets passed to the pagination component when instantiated.
    this.data.total = null;

    // Placeholder for player status data.
    // This gets passed to the API when updating a player's status (promote, demote, etc).
    this.data.playerStatus = {
      [this.options.apiPropNames.playerStatus] : null,
      [this.options.apiPropNames.playerId]     : null,
      [this.options.apiPropNames.clanId]       : window.wp_object.clan_ID,
    };

    this._renderFilters();
    this._addEventListeners();
    this._getSearchResults();
  }

  /**
   * Get the values for all search input/selects and fetch new data
   */
  _getFilterData() {
    this.data.apiRequest[this.options.apiPropNames.term]         = this.ui.inputTerm.val();
    this.data.apiRequest[this.options.apiPropNames.sortCategory] = this.ui.selectSort.val();

    this._getSearchResults();
  }

  /**
   * Make API call to get the results.
   * Merge results with this.data object.
   * Then render correct state depending on data returned.
   */
  _getSearchResults() {
    //console.log('Request: ' + JSON.stringify(this.data.apiRequest));
    this.constant.loaderList.show();
    let xhr = this.constant.getAjaxContent({
      url  : this.options.apiUrlList,
      data : this.data.apiRequest,
    });
    Promise.resolve(xhr).then((response) => {
      //console.log('Search Response ', JSON.stringify(response));

      if (response) {
        this.data.results = response;

        if (response.hasOwnProperty(this.options.apiPropNames.results)) {
          this.data.results = response[this.options.apiPropNames.results];
        }

        if (response.hasOwnProperty(this.options.apiPropNames.total)) {
          this.data.total = response[this.options.apiPropNames.total];
        }

        // console.warn('search merged response: ', this.data);
        if (this.data.results.length <= 0) {
        
         if(this.data.apiRequest.q == null || this.data.apiRequest.q == ''){
           this._showNothing();
         } else {
            this._showNoResults();
         }
        } else {
          this._renderResults();
          this._renderPagination();
          this._updateTotal();
        }
      } else {
        this._showError();
      }
    }).catch((response) => {
      //console.log('search results error: ', response);
      this._showError();
    });
  }

  /**
   * Display our search form and define the elements
   */
  _renderFilters() {
    let $html = $(this.options.filtersTemplate());
    this.ui.filters.html($html);

    this.ui.filtersForm = this.ui.filters.find(this.options.selectorForm);
    this.ui.inputTerm   = this.ui.filters.find(this.options.selectorTerm);
    this.ui.selectSort  = this.ui.filters.find(this.options.selectorSort);
  }

  /**
   * Display our player status action menus and
   * re-init Foundation reveal (modal) to get them to work properly.
   */
  _renderTooltips() {
    this.constant.tooltip = new Tooltip({
      selectorContainer: this.options.selectorToolip,
    });
    Foundation.reInit('reveal');
  }

  /**
   * Create our pagination component
   */
  _renderPagination() {
    if (this.options.showPagination && !this.constant.pagination) {
      this.constant.pagination = new Pagination(this.ui.pagination, {
        numPageStart  : this.data.apiRequest[this.options.apiPropNames.startIndex],
        numPageSize   : this.data.apiRequest[this.options.apiPropNames.countMax],
        numMaxPages   : this.options.numMaxPages,
        numTotalItems : this.data.total,
      });
    }
  }

  /**
   * Display the results
   */
  _renderResults() {
    this._killTooltip();
    this.constant.loaderList.hide();
    let $html = $(this.options.resultsTemplate(this.data));
    this.ui.results.html($html);

    let $items = $html.find(this.options.selectorResultItem).addClass(this.classes.loading);
    this._animResultsIn($items);

    this.ui.errorList.addClass(this.classes.hidden);
    this.ui.noResults.addClass(this.classes.hidden);

    this._renderTooltips();
  }

  /**
   * Animate each result item into view
   */
  _animResultsIn($items) {
      $items.each((i, el) => {
        var $curItem = $(el);

        // Animate item into view
        TweenMax.fromTo($curItem, this.constant.animSpeed, {
          autoAlpha : 0,
          x         : this.constant.animInDistance,
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

  /**
   * Hide/remove all content and show error message
   */
  _showError() {
    this.constant.loaderList.hide();
    this._killPagination();
    this._killTooltip();
    this.ui.results.empty();
    this.ui.noResults.addClass(this.classes.hidden);
    this.ui.errorList.removeClass(this.classes.hidden);
  }

  /**
   * Hide/remove all content and show no results message
   */
  _showNoResults() {
    this.constant.loaderList.hide();
    this._killPagination();
    this._killTooltip();
    this.ui.results.empty();
    this.ui.errorList.addClass(this.classes.hidden);
    this.ui.noResults.removeClass(this.classes.hidden);
  }
  
  _showNothing() {
    this.constant.loaderList.hide();
    this._killPagination();
    this._killTooltip();
    this.ui.results.empty();
    this.ui.results.parents('.clans-players-list').hide();
    this.ui.errorList.addClass(this.classes.hidden);
    this.ui.noResults.removeClass(this.classes.hidden);
  }

  /**
   * Update the display of total players
   */
  _updateTotal() {
    this.ui.totalCount.text(this.data.total);
    this.ui.memberCount.text(this.data.total);
  }

  /**
   * Remove our pagination component
   */
  _killPagination() {
    if (this.constant.pagination) {
      this.constant.pagination.kill();
      this.constant.pagination = null;
    }
  }

  /**
   * Remove our tooltip component
   */
  _killTooltip() {
    if (this.constant.tooltip) {
        this.constant.tooltip.kill();
        this.constant.tooltip = null;
    }
  }

  /**
   * Update the search results when pagination is clicked
   */
  _onPaginationCallback(e, numPage) {
    this.data.apiRequest[this.options.apiPropNames.startIndex] = numPage;
    this._getSearchResults();
  }

  /**
   * When search term is submitted or filter changes,
   * display the search results and update the pagination.
   */
  _onSearchSort(e) {
    e.preventDefault();
    //console.log('Update search results');
    this.data.apiRequest[this.options.apiPropNames.startIndex] = this.options.numStartIndex;
    this.data.apiRequest[this.options.apiPropNames.countMax]   = this.options.numCountMax;

    this._getFilterData();
    this._killPagination();
  }
  
  _clearSearch(e){
    e.preventDefault();
    $(this.ui.form)[0].reset();
    $(this.ui.form).trigger('submit');
    
  }

  /**
   * When promoting, demoting, etc,
   * Get the player ID and action to make the API request
   */
  _onPlayerAction(e) {
    e.preventDefault();
    let $curTarget = $(e.currentTarget);
    let curAction = $curTarget.data(this.options.dataAttrBtnAction);
    this.ui.curPlayer = $curTarget.parents('[data-'+this.options.dataAttrPlayerId+']');
    let playerId = this.ui.curPlayer.data(this.options.dataAttrPlayerId);

    this.data.playerStatus[this.options.apiPropNames.playerStatus] = curAction;
    this.data.playerStatus[this.options.apiPropNames.playerId]     = playerId;

    if (curAction !== this.options.apiPropNames.promoteOfficer) {
      this._closeTooltip();
      this._sendPlayerStatus();
    }
  }

  /**
   * Promoting officer happens in a modal instead of the results list
   * so this API request needs its own trigger method
   */
  _onConfirmPromoteOfficer(e) {
    e.preventDefault();
    this._sendPlayerStatus();
  }

  /**
   * Make API request for the current player ID and action
   */
  _sendPlayerStatus() {
    this.constant.loaderList.show();

    let xhr = this.constant.getAjaxContent({
      url  : this.options.apiUrlStatus,
      data : this.data.playerStatus,
    });

    Promise.resolve(xhr).then((response) => {
      //console.log('search original response: ', this.data.playerStatus);
      let success  = false;
      let errorMsg;

      if (response) {
        if (response.hasOwnProperty(this.options.apiPropNames.responseStatus)) {
          success = response[this.options.apiPropNames.responseStatus];
        }

        if (response.hasOwnProperty(this.options.apiPropNames.responseError)) {
          //errorMsg = response[this.options.apiPropNames.responseError];
          errorMsg = response['error'];
        }

        if (success) {
          this._updatePlayerStatus();
        } else {
          this._showPlayerStatusError(errorMsg);
        }
      } else {
        this._showPlayerStatusError();
      }
    }).catch((response) => {
      //console.log('player status error: ', response);
      this._showPlayerStatusError();
    });
  }

  /**
   * Process the success response for each action type
   */
  _updatePlayerStatus() {
    this.constant.loaderList.hide();

    let curStatus = this.data.playerStatus[this.options.apiPropNames.playerStatus];

    switch(curStatus) {
      case this.options.apiPropNames.approve:
        this._updateCount(-1);
        this._animPlayerOut(this.ui.curPlayer, this._removePlayer.bind(this));
        this.ui.applicantList.find('button').click();
        this.ui.membersList.find('button').click();
        break;

      case this.options.apiPropNames.deny:
        this._updateCount(-1);
        this._animPlayerOut(this.ui.curPlayer, this._removePlayer.bind(this));
        this.ui.applicantList.find('button').click();
        break;

      case this.options.apiPropNames.block:
        this._updateCount(-1);
        this._animPlayerOut(this.ui.curPlayer, this._removePlayer.bind(this));
        this.ui.blockedList.show();
        this.ui.blockedList.find('button').click();
        break;

      case this.options.apiPropNames.promoteMember:
        this._demotePromotePlayer(this.options.apiPropNames.promoteMember);
        break;

      case this.options.apiPropNames.promoteOfficer:
        this._refreshView();
        break;

      case this.options.apiPropNames.demote:
        this._demotePromotePlayer(this.options.apiPropNames.demote);
        break;

      case this.options.apiPropNames.kick:
        this._updateCount(-1);
        this._animPlayerOut(this.ui.curPlayer, this._removePlayer.bind(this));
        break;

      case this.options.apiPropNames.unblock:
        this._updateCount(-1);
        this._animPlayerOut(this.ui.curPlayer, this._removePlayer.bind(this));
        this.ui.blockedList.find('button').click();
        
        break;
    }
  }

  /**
   * Display API error response in a modal
   */
  _showPlayerStatusError(strErrorMsg) {
    this.constant.loaderList.hide();

    if (strErrorMsg) {
      this.ui.errorModalMsg.text(strErrorMsg);
    }

    this.ui.errorModal.foundation('open');
  }

  /**
   * Refresh the page so we can reset the view with current user status/permissions
   */
  _refreshView() {
    this.constant.loaderFullPage.show();
    window.location.reload(true);
  }

  /**
   * Update the static count above each list
   */
  _updateCount(numDirection) {
    let curCount = parseInt(this.ui.totalCount.text());
    curCount += numDirection;
    this.ui.totalCount.text(curCount);
  }

  /**
   * Animate a player out of the list
   */
  _animPlayerOut($player, callback) {
    let $animItems = $player.find(this.options.selectorAnimItem);

    TweenMax.to($player, this.constant.animSpeed, {
      autoAlpha : 0,
      x         : this.constant.animOutDistance,
      ease      : this.constant.animEase,
    });

    TweenMax.to($animItems, this.constant.animSpeed, {
      height        : 0,
      paddingBottom : 0,
      paddingTop    : 0,
      ease          : this.constant.animEase,
      onStart       : () => {
        $animItems.css({
          overflow  : 'hidden',
        });
      },
      onComplete    :() => {
        if (typeof callback === 'function') {
          callback();
        }
      },
    });
  }

  /**
   * Close actions tooltip menu
   */
  _closeTooltip() {
    if (this.constant.tooltip) {
      this.constant.tooltip.closeCurrent();
    }
  }

  /**
   * Remove current player from DOM
   */
  _removePlayer() {
    this.ui.curPlayer.remove();
  }

  /**
   * Set promote/demote status and animate label changes
   */
  _demotePromotePlayer(strStatus) {
    let status  = strStatus;
    let demote  = this.options.apiPropNames.demote;
    let promote = this.options.apiPropNames.promoteMember;
    let $player = this.ui.curPlayer;
    let $oldLabel;
    let $newLabel;

    if (status === demote) {
      $oldLabel = $player.find('.' + this.classes.officer);
      $newLabel = $player.find('.' + this.classes.member);
      this._animLabelsInOut($newLabel, $oldLabel);
      $player.removeClass(this.classes.officer);
      $player.addClass(this.classes.member);
    }

    if (status === promote) {
      $oldLabel = $player.find('.' + this.classes.member);
      $newLabel = $player.find('.' + this.classes.officer);
      this._animLabelsInOut($newLabel);
      $player.removeClass(this.classes.member);
      $player.addClass(this.classes.officer);
    }
  }

  /**
   * Animate founder/officer labels in/out of view on promote/demote
   */
  _animLabelsInOut($newLabel, $oldLabel) {
    // If we had a label, animate it out
    if ($oldLabel) {
      TweenMax.to($oldLabel, this.constant.animSpeed, {
        autoAlpha : 0,
        x         : -this.constant.animInDistance,
        ease      : this.constant.animEase,
        onStart   : () => {
          // Prevent label from being set to display none until animated out
          $oldLabel.css('display', 'inline-block');
        },
        onComplete: () => {
          $oldLabel.removeAttr('style');
        },
      });
    }

    // Animate new label in
    TweenMax.fromTo($newLabel, this.constant.animSpeed, {
      autoAlpha : 0,
      x         : this.constant.animInDistance,
    }, {
      autoAlpha : 1,
      x         : 0,
      ease      : this.constant.animEase,
      onComplete: () => {
        $newLabel.removeAttr('style');
      },
    });
  }


  _removeEventListeners() {
    this.ui.container.off('click');
    this.ui.window.off(this.options.paginationCallback);
  }

  _addEventListeners() {
    this.ui.container.on('submit', this.options.selectorForm, this._onSearchSort.bind(this));
    this.ui.container.on('click', '[data-'+this.options.dataAttrBtnAction+']', this._onPlayerAction.bind(this));
    this.ui.btnPromoteOfficer.on('click', this._onConfirmPromoteOfficer.bind(this));
    this.ui.selectSort.on('change', this._onSearchSort.bind(this));
    this.ui.container.on('click', this.ui.clearSearch, this._clearSearch.bind(this));
    this.ui.window.on(this.options.paginationCallback, this._onPaginationCallback.bind(this));
  }
}
