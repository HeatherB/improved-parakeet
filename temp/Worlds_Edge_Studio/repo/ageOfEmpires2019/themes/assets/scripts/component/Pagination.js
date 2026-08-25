/**
 * Pagination
 *
 * @description
 * Display pagination widget for a set of results.
 * Pagination does not load/update content itself.
 * Clicking page buttons triggers custom event that results component can subscribe to and update content.
 */

import _ from 'underscore';
import config from '../config';
import templatePagination from '../templates/pagination.html';

export default class Pagination {
  constructor($container, objOptions) {
    this.init($container, objOptions);
  }

  init($container, objOptions) {
    this.options = Object.assign({
      numMaxPages      : 3,                        // max number of buttons to display (excluding first/last)
      numPageStart     : 1,                          // page index to start on (base 1)
      numPageSize      : 10,                         // max items per page
      numTotalItems    : 100,                        // total results (needs to be set by content on init)
      selectorButtons  : 'button',                   // selector for page buttons
      dataAttrBtnIndex : 'page',                     // data attribute on buttons of its index value
      template         : templatePagination,         // template for rendering pagination
      customEventName  : config.events.onPagination, // custom event when pagination buttons are selected
    }, objOptions);

    this.state = {
      numMaxPages      : this.options.numMaxPages,                 // max number of buttons to display (excluding first/last)
      numSidePages     : Math.floor(this.options.numMaxPages / 2), // num buttons before/after selected page
      numCurPage       : this.options.numPageStart,                // selected page
      numPageStart     : null,                                     // first button in group displayed
      numPageEnd       : null,                                     // last button in group displayed
      numTotalPages    : Math.ceil(this.options.numTotalItems / this.options.numPageSize), // end of all results button
      arrPageRange     : null,                                     // underscore array of page indexes to display
      numItemStart     : null,                                     // first result item in current page
      numItemEnd       : null,                                     // last result item in current page
      numTotalItems    : this.options.numTotalItems,               // total results count
      showFirstNav     : null,                                     // should we show page 1?
      showLastNav      : null,                                     // should we show last page?
    };

    this.ui = {
      container        : $container,
      buttons          : null,
    };

    if (this.options.numTotalItems) {
      this._initialize();
    } else {
      this.kill();
    }
  }

  /**
   * Kill this instance of pagination
   */
  kill() {
    this.ui.container.empty();
    this._unBindEvents();
  }

  /**
   * Public method to update pagination to specific page index
   */
  updateToPage(index) {
    this.state.numCurPage = index;

    this.kill();
    this._setTemplateData();
  }

  _initialize() {
    this._setTemplateData();
  }

  /**
   * Set our data to build pagination
   */
  _setTemplateData() {
    if (this.state.numCurPage >= this.state.numTotalPages) {
      this.state.numCurPage = this.state.numTotalPages;
    }

    // Prevent first page from being being negative
    this.state.numPageStart = this.state.numCurPage - this.state.numSidePages;
    if (this.state.numPageStart <= 1) {
      this.state.numPageStart = 1;
    }

    // Prevent last page from exceeding total
    this.state.numPageEnd = this.state.numCurPage + this.state.numSidePages;
    if (this.state.numPageEnd > this.state.numTotalPages) {
      this.state.numPageEnd = this.state.numTotalPages;
    }

    // Show all pages if there are less than max option
    if (this.state.numTotalPages <= this.options.numMaxPages + 1) {
      this.state.arrPageRange = _.range(1, this.state.numTotalPages + 1);
      this.state.showFirstNav = false;
      this.state.showLastNav = false;
    } else {
    // Otherwise, figure out what pages to show...

      // If we're near the beginning of all pages, show the last page
      if (this.state.numPageStart <= this.state.numSidePages) {
        this.state.arrPageRange = _.range(this.state.numPageStart, this.state.numPageStart + this.options.numMaxPages);
        this.state.showLastNav = true;

        // Don't show the first page if it is within the beginning of our group
        if (this.state.numPageStart === 1) {
          this.state.showFirstNav = false;
        } else {
          this.state.showFirstNav = true;
        }
      }

      // If we're near the end of all pages, show the first page
      else if (this.state.numPageEnd >= this.state.numTotalPages) {
        this.state.arrPageRange = _.range(this.state.numTotalPages - this.options.numMaxPages, this.state.numTotalPages + 1);
        this.state.showFirstNav = true;
        this.state.showLastNav = false;
      }

      // If we're in the middle, show the first and last pages
      else {
        this.state.arrPageRange = _.range(this.state.numPageStart, this.state.numPageStart + this.state.numMaxPages);
        this.state.showFirstNav = true;
        this.state.showLastNav = true;
      }
    }

    // Set the index of first and last result item on the page
    this.state.numItemStart = (this.state.numCurPage - 1) * this.options.numPageSize + 1;
    this.state.numItemEnd = this.state.numItemStart + this.options.numPageSize - 1;

    // Prevent the last item from exceeding the total results
    if (this.state.numItemEnd > this.state.numTotalItems) {
      this.state.numItemEnd = this.state.numTotalItems;
    }

    this._buildPagination();
  }

  /**
   * Create/render markup using template and bind events
   */
  _buildPagination() {
    let html = this.options.template(this.state);

    this.ui.container.html(html);
    this.ui.buttons = this.ui.container.find(this.options.selectorButtons);

    this._bindEvents();
  }

  /**
   * Update state of pagination and trigger custom event to refresh content in other components
   */
  _onPaginationClick(e) {
    e.preventDefault();

    let $target = $(e.currentTarget);

    this.state.numCurPage = $target.data(this.options.dataAttrBtnIndex);

    $.event.trigger(this.options.customEventName, this.state.numCurPage);

    this.kill();
    this._setTemplateData();
  }

  /**
   * Bind events for all interactions
   */
  _bindEvents() {
    this.ui.container.on('click', this.options.selectorButtons, $.proxy(this._onPaginationClick, this));
  }

  /**
   * Unbind events for all interactions
   */
  _unBindEvents() {
    this.ui.container.off();
  }
}
