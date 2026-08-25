/**
 * ClansSearchResults
 *
 * @requires
 * ClansSearchFilters (assets/scripts/component/ClansSearchFilters.js)
 * Pagination (assets/scripts/component/Pagination.js)
 *
 * @description
 * Render clan search results for both the featured clan lists and full search results.
 * Results update based on callbacks fired from either Pagination or Filters.
 * Pagination callback passes the new page index to request.
 * Filters callback triggers a new lookup of query params to request.
 */

import TweenMax from 'gsap';
import config from '../config';
import Loading from '../component/Loading';
import ajaxGet from '../util/ajaxGet';
// import ajaxPost from '../util/ajaxPost';
import getUrlParam from '../util/getUrlParam';
import Pagination from '../component/Pagination';
import templateResults from '../templates/clansSearchResults.html';

export default class ClansSearchResults {
  constructor($container, objOptions) {
    this.init($container, objOptions);
  }

  init($container, objOptions) {
    this.options = Object.assign({
      isFeaturedResults  : false,                              // is this instance displaying featured results (vs full search results)?
      numStartIndex      : 1,                                  // current item index to request (1 based)
      numCountMax        : 10,                                 // max items to display per page
      sortCategory       : 'clanName',                         // default sort category
      sortOrder          : 'ASC',                              // default sort order (ASC, DESC)
      selectorResults    : '.results-container',               // container element of results
      selectorResultItem : '.search-results__row',             // element of individual result
      selectorNoResults  : '.no-results',                      // no results message
      selectorError      : '.error-results',                   // error message
      selectorBtnSort    : '.sort-trigger',                    // buttons for sorting columns
      dataAttrSort       : 'sort',                             // data attr on sorting buttons for its category
      selectorBtnParams  : '',                                 // featured list "see all" button that has search filters for this list
      apiUrl             : config.api.clansSearchResults,      // api url
      apiPropNames       : null,                               // object of all api property names
      resultsTemplate    : templateResults,                    // template for rendering results
      filtersCallback    : config.events.onClansSearch + '.' + Date.now(), // custom event fired from filters component on submit
      selectorPagination : '.pagination-container',            // selector of pagination
      showPagination     : true,                               // should we create a pagination component?
      paginationCallback : config.events.onPagination + '.' + Date.now(), // custom event fired from pagination component on click
      customEventName    : config.events.onClansSearchResults, // custom event when new results are loaded
    }, objOptions);


    this.ui = {
      window             : $(window),
      container          : $container,
      results            : $container.find(this.options.selectorResults),
      noResults          : $container.find(this.options.selectorNoResults),
      error              : $container.find(this.options.selectorError),
      btnParams          : $container.find(this.options.selectorBtnParams),
      btnSort            : null,  // column sorting buttons (defined after results are rendered)
      pagination         : $(this.options.selectorPagination),
    };

    this.constant = {
      animSpeed          : 0.5,              // (s) TweenMax animation speed
      animEase           : 'Quad.easeOut',   // TweenMax animation ease
      animDistance       : 50,               // (px) distance to slide events up when loading in
      animDelay          : 0.1,              // (s) animation delay between items
      sortAsc            : 'ASC',            // sort value for ascending results
      sortDesc           : 'DESC',           // sort value for descending results
      getUrlParam        : getUrlParam,      // global utility for getting query param value
      getAjaxContent     : ajaxGet,         // global utility for ajax requests
      pagination         : null,             // placeholder for pagination component
      loader             : new Loading({     // placeholder for global loading icon
        container        : this.ui.container,// element to add loader into
      }),
    };

    this.classes = {
      loading            : 'not-loaded',     // class set on results when animating in
      hidden             : 'hide',           // class removed from error & no results messages
      sortAsc            : 'is-active-asc',  // class on sort buttons in template to determine their sort state
    };

    this.state = {
      hasQueryParams     : window.location.search.length,  // do we have query params in the url (triggering full search results layout)?
    };

    // Define our data object.
    // This will hold API responses as well as data to send to the API for new requests.
    // All properties are defined below.
    this.data = {};

    // Define our query param data object.
    // This gets passed to the template to render column sort headers
    // as well as to the API when requesting new data.
    this.data.apiRequest = {
      [this.options.apiPropNames.term]         : null,  // null or text input value (clan name or tag)
      [this.options.apiPropNames.skill]        : null,  // null or select value ('beginner', 'intermediate', 'advanced')
      [this.options.apiPropNames.activity]     : null,  // null or select value ('daily', 'weekly', 'monthly')
      [this.options.apiPropNames.members]      : null,  // null or select value ('1-49', '50-100', etc)
      [this.options.apiPropNames.date]         : null,  // null or select value ('week', 'month', 'year')
      [this.options.apiPropNames.language]     : null,  // null or select value ('english' etc)
      [this.options.apiPropNames.searchby]     : null,
      [this.options.apiPropNames.sortCategory] : null,  // sort category for results (clanName, etc)
      [this.options.apiPropNames.sortOrder]    : null,  // sort order for results ('ASC', 'DESC')
      [this.options.apiPropNames.startIndex]   : this.options.numStartIndex, // pagination start index
      [this.options.apiPropNames.countMax]     : this.options.numCountMax,   // page size limit
    };

    // Placeholder for our results data.
    // This gets passed to the template to render results.
    this.data.results = [];

    // Placeholder for total results returned for a given search.
    // This gets passed to the pagination component when instantiated.
    this.data.total = null;

    this._addEventListeners();
    this._checkState();
  }

  /**
   * If we have query params in the url, remove this instance if it is featured results.
   * Otherwise, render the search results.
   */
  _checkState() {
    if (this.state.hasQueryParams) {
      if (this.options.isFeaturedResults) {
        this._killFeaturedResults();
      } else {
        this._getUrlParams();
      }
    } else {
      if (this.options.isFeaturedResults) {
        this._getUrlParams();
      }
    }
  }

  /**
   * Get the value of each query string param on the see all button href or page url and search with those filters
   */
  _getUrlParams() {
    let urlParams = null;

    if (this.options.isFeaturedResults) {
      urlParams = this.ui.btnParams.attr('href');
    } else {
      urlParams = window.location.href;
    }

    urlParams = urlParams.split('?')[1];

    this.data.apiRequest = {
      [this.options.apiPropNames.term]         : this.constant.getUrlParam(this.options.apiPropNames.term, urlParams),
      [this.options.apiPropNames.skill]        : this.constant.getUrlParam(this.options.apiPropNames.skill, urlParams),
      [this.options.apiPropNames.activity]     : this.constant.getUrlParam(this.options.apiPropNames.activity, urlParams),
      [this.options.apiPropNames.members]      : this.constant.getUrlParam(this.options.apiPropNames.members, urlParams),
      [this.options.apiPropNames.date]         : this.constant.getUrlParam(this.options.apiPropNames.date, urlParams),
      [this.options.apiPropNames.language]     : this.constant.getUrlParam(this.options.apiPropNames.language, urlParams),
      [this.options.apiPropNames.searchby]     : this.constant.getUrlParam(this.options.apiPropNames.searchby, urlParams),
      [this.options.apiPropNames.sortCategory] : this.constant.getUrlParam(this.options.apiPropNames.sortCategory, urlParams),
      [this.options.apiPropNames.sortOrder]    : this.constant.getUrlParam(this.options.apiPropNames.sortOrder, urlParams),
      [this.options.apiPropNames.startIndex]   : parseInt(this.constant.getUrlParam(this.options.apiPropNames.startIndex, urlParams), 10),
      [this.options.apiPropNames.countMax]     : parseInt(this.constant.getUrlParam(this.options.apiPropNames.countMax, urlParams), 10),
    };

    // Decode URL encoded term
    if (this.data.apiRequest[this.options.apiPropNames.term]) {
      this.data.apiRequest[this.options.apiPropNames.term] = decodeURIComponent(this.data.apiRequest[this.options.apiPropNames.term].replace(/\+/g, " "));
    }

    // Default to the first page of results if no page is provided
    if (!this.data.apiRequest[this.options.apiPropNames.startIndex] || this.data.apiRequest[this.options.apiPropNames.startIndex] === '0') {
      this.data.apiRequest[this.options.apiPropNames.startIndex] = 1;
    }

    // Default to the max items to display if not provided
    if (!this.data.apiRequest[this.options.apiPropNames.countMax]) {
      this.data.apiRequest[this.options.apiPropNames.countMax] = this.options.numCountMax;
    }

    // Default to the sort category option if not provided
    if (!this.data.apiRequest[this.options.apiPropNames.sortCategory]) {
      this.data.apiRequest[this.options.apiPropNames.sortCategory] = this.options.sortCategory;
    }

    // Default to the sort order option if not provided
    if (!this.data.apiRequest[this.options.apiPropNames.sortOrder]) {
      this.data.apiRequest[this.options.apiPropNames.sortOrder] = this.options.sortOrder;
    }

    this._getSearchResults();
  }

  /**
   * Make API call to get the results.
   * Merge results with this.data object.
   * Then render correct state depending on data returned.
   */
  _getSearchResults() {
    this.constant.loader.show();

    let xhr = this.constant.getAjaxContent({
      url  : this.options.apiUrl,
      data : this.data.apiRequest,
    });

    Promise.resolve(xhr).then((response) => {
      //console.log('Request: ' + JSON.stringify(this.data.apiRequest));
      //console.log('Response: ' + JSON.stringify(response));
      if (response) {
        if (response.hasOwnProperty(this.options.apiPropNames.results)) {
          this.data.results = response[this.options.apiPropNames.results];
        }

        if (response.hasOwnProperty(this.options.apiPropNames.total)) {
          this.data.total = response[this.options.apiPropNames.total];
        }
        if (this.data.results.length <= 0) {
          this._showNoResults();
        } else {
          this._renderResults();
          this._renderPagination();
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
   * Create our pagination component
   */
  _renderPagination() {
    if (this.options.showPagination && !this.constant.pagination) {
      this.constant.pagination = new Pagination(this.ui.pagination, {
        numPageStart  : this.data.apiRequest[this.options.apiPropNames.startIndex],
        numPageSize   : this.data.apiRequest[this.options.apiPropNames.countMax],
				numTotalItems : this.data.total,
			});
    }
  }

  /**
   * Display the results
   */
  _renderResults() {
    this.constant.loader.hide();

    let $html = $(this.options.resultsTemplate(this.data));
    this.ui.results.html($html);

    let $items = $html.find(this.options.selectorResultItem).addClass(this.classes.loading);
    this._animItems($items);

    this.ui.error.addClass(this.classes.hidden);
    this.ui.noResults.addClass(this.classes.hidden);

    if (!this.options.isFeaturedResults) {
      $.event.trigger(this.options.customEventName, this.data.apiRequest);
    }
  }

  /**
   * Animate each result item into view
   */
  _animItems($items) {
      $items.each((i, el) => {
        var $curItem = $(el);

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

  /**
   * Hide/remove all content and show error message
   */
  _showError() {
    this.constant.loader.hide();
    this._killPagination();
    this.ui.results.empty();
    this.ui.noResults.addClass(this.classes.hidden);
    this.ui.error.removeClass(this.classes.hidden);
  }

  /**
   * Hide/remove all content and show no results message
   */
  _showNoResults() {
    this.constant.loader.hide();
    this._killPagination();
    this.ui.results.empty();
    this.ui.error.addClass(this.classes.hidden);
    this.ui.noResults.removeClass(this.classes.hidden);
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
   * Update the search results when pagination is clicked
   */
  _onPaginationCallback(e, numPage) {
    this.data.apiRequest[this.options.apiPropNames.startIndex] = numPage;
    this._getSearchResults();
  }

  /**
   * When search filters are submitted,
   * kill this instance if it is featured results.
   * Otherwise, display the search results and update the pagination.
   */
  _onFiltersCallback() {
    if (this.options.isFeaturedResults) {
      this._killFeaturedResults();
    } else {
      this._getUrlParams();
      this._killPagination();
    }
  }

  /**
   * Kill this instance if it is featured results.
   */
  _killFeaturedResults() {
    TweenMax.to(this.ui.container, this.constant.animSpeed, {
      autoAlpha : 0,
      height    : 0,
      ease      : this.constant.animEase,
      onComplete: () => {
        this._removeEventListeners();
        this.ui.container.remove();
      },
    });
  }

  /**
   * Update the sort category and order, then get new results
   */
  _onSortClick(e) {
    e.preventDefault();

    let $trigger = $(e.currentTarget);
    let category = $trigger.data(this.options.dataAttrSort);
    let sortOrder = $trigger.hasClass(this.classes.sortAsc) ? this.constant.sortDesc : this.constant.sortAsc;

    this.data.apiRequest[this.options.apiPropNames.sortCategory] = category;
    this.data.apiRequest[this.options.apiPropNames.sortOrder]    = sortOrder;

    this._getSearchResults();
  }

  _removeEventListeners() {
    this.ui.container.off('click');
    this.ui.window.off(this.options.filtersCallback);
    this.ui.window.off(this.options.paginationCallback);
  }

  _addEventListeners() {
    this.ui.container.on('click', this.options.selectorBtnSort, this._onSortClick.bind(this));
    this.ui.window.on(this.options.filtersCallback, this._onFiltersCallback.bind(this));
    this.ui.window.on(this.options.paginationCallback, this._onPaginationCallback.bind(this));
  }
}
