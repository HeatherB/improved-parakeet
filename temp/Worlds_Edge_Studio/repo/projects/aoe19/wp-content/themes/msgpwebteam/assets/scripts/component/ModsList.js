import TweenMax from 'gsap';
import config from '../config';
import ajaxGet from '../util/ajaxGet';
import ajaxPost from '../util/ajaxPost';
import convertQueryStringToObject from '../util/convertQueryStringToObject';
import ClearInputField from '../util/ClearInputField';
import Pagination from '../component/Pagination';
import Tooltip from '../component/Tooltip';
import Loading from '../component/Loading';
import modsFilters from '../templates/modsFilters.html';
import modsListing from '../templates/modsListing.html';

export default class ModsList {
  constructor(objOptions = {}) {
    this.init(objOptions);
  }

  init(objOptions) {
    let params = convertQueryStringToObject() || {};

    this.options = Object.assign({
      modsApiV4: config.apiV4, 
      modsListApi: config.api.modsFindAsUser,
      modsInstalledApi: config.api.modsInstalled,
      modsDeleteApi: config.api.modsDelete,
    }, objOptions);

    this.state = {
      initialDataFetch: true,
      popstateReload: false, //reload page on popstate?
    };

    this.ui = {
      $window: $(window),
      $filters: $('#mods-filters'),
      $paginav: $('.mods-list__pagination .pagination-container'),
      $listing: $('#mods-listing'),
      $modnav: $('.mods-nav'),
    };

    this.pagination = null;
    this.paginationCallback = config.events.onPagination + '.' + Date.now();
    this.start = 1; // 1 based, NOT 0 based
    this.count = 10;

    //params exposed as query string
    this.queryParams = {
      q: params.q || '',
      game: params.game || 2,
      modid: params.modid || 0,
      filter: params.filter || 0,
      status: params.status || '',
      sort: params.sort || 'popular',
      order: params.order || 'DESC',
    };
    //init widgets
    this.filterLoader = new Loading({
      container: this.ui.$filters,
    });
    this.listLoader = new Loading({
      container: this.ui.$listing,
    });
    this.tooltip = null;

    this._addEventListeners();
    this._fetchFilterData();
    this._fetchModsData();
  }

  _addEventListeners() {
    this.ui.$window.on(this.paginationCallback, this._onPaginationCallback.bind(this));

    this.ui.$listing.on('click', '.sort-trigger', (event) => {
      event.preventDefault();
      let $trigger = $(event.currentTarget);
      this.queryParams.sort = $trigger.data('sort');
      if ($trigger.data('sort') == 'creatorName') {
        this.queryParams.order = $trigger.hasClass('is-active-asc') ? 'DESC' : $trigger.hasClass('is-active-desc') ? 'ASC' : 'ASC';
      } else {
        this.queryParams.order = $trigger.hasClass('is-active-asc') ? 'DESC' : $trigger.hasClass('is-active-desc') ? 'ASC' : 'DESC';
      }
      this._fetchModsData();
    });
    // listen for mod deletion
    this.ui.$listing.on('click', '[data-mod-delete]', (event) => {
      event.preventDefault();
      const $el = $(event.currentTarget).closest('.search-results__row ');
      const modId = $el.data('mod-id');
      this._deleteMod(modId, $el);
    });
    // listen for mod report
    this.ui.$listing.on('click', '[data-mod-report]', (event) => {
      event.preventDefault();
      const modId = $(event.currentTarget).data('mod-id');
      this._reportMod(modId);
    });
    // listen for mod uninstall
    this.ui.$listing.on('click', '[data-mod-uninstall]', (event) => {
      event.preventDefault();
      const modId = $(event.currentTarget).data('mod-id');
      this._uninstallMod(modId);
    });
    // listen for mod update
    this.ui.$listing.on('click', '[data-mod-update]', (event) => {
      event.preventDefault();
      const modId = $(event.currentTarget).data('mod-id');
      this._updateMod(modId);
    });

    // Reload the page on back button since we are using pushState to update history.
    window.onpopstate = () => {
      if (this.state.popstateReload) {
          window.location.reload(true);
      }
    };
    // Prevent reload loop on initial render if browser fires popstate on page load.
    this.state.popstateReload = true;
  }

  _fetchFilterData() {
    this.filterLoader.show();
    let xhrs = [
      ajaxGet({ url: config.api.modsTypes }),
      ajaxGet({ url: config.api.games }),
    ];
    Promise.all(xhrs).then((response) => {
      if (response) {
        this._renderFilters(response);
      } else {
        this._error();
      }
      this.filterLoader.hide();
      
    }).catch(() => {
      this._error();
      this.filterLoader.hide();
    });
  }

  _renderFilters(response) {
    // console.log(response);
    let $gameId = 2;
    if (this.queryParams.game) {
      $gameId = this.queryParams.game;
    }    
    response[0] = $(response[0]).filter(function () { return $(this)[0].gameTitleId == $gameId; }).remove(); 
    let data = {
      modTypes: response[0],
      games: response[1],
    };
    this.ui.$filters.html(modsFilters(data));

    let $querySubmit =  $('#modsQuerySubmit');
    let $queryInput =  $('#modsQueryInput');
    let $typeSelect =  $('#modsTypeSelect');
    let $gameSelect =  $('#modsGameSelect');
    let $elSearchBox =  $('#modsSearchBox');

    if (this.queryParams.q) {
      $queryInput.val(this.queryParams.q);
    }

    if (this.queryParams.filter) {
      $typeSelect.val(this.queryParams.filter);
    }

    if (this.queryParams.status === 'Featured') {
      $typeSelect.val('Featured');
    }

    if (this.queryParams.game) {
      $gameSelect.val(this.queryParams.game);
    }
      if (window.location.pathname.includes('mods/installed')) {
          $gameSelect.find("option[value='1']").attr('disabled', 'disabled');
      //$gameSelect.val(2);
      //$gameSelect.attr('disabled','disabled');
    }

    $queryInput.on('keydown', (event) => {
      if (event.keyCode === '13' || event.keyCode === 13) {
        event.preventDefault();
        $querySubmit.click();
      }
    });

    $querySubmit.on('click', (event) => {
      event.preventDefault();
      let query = $queryInput.val();
      this.queryParams.q = query;
      this._killPagination();
      this._fetchModsData();
    });

    $typeSelect.on('change', () => {
      let val = $typeSelect.val();
      if (val === 'Featured') {
        this.queryParams.status = 'Featured';
        this.queryParams.filter = 0;
      } else {
        this.queryParams.status = '';
        this.queryParams.filter = Number(val);
      }
      this._killPagination();
      this._fetchModsData();
    });

    $gameSelect.on('change', () => {
      let val = $gameSelect.val();
      this.queryParams.game = Number(val);
      // Add data-game-id="game=1" attr, or something similar
      // in body tag which will be used in 
      // alter-buynow-links.js 
      $('body').attr('data-game-id', 'game=' + val);
      this._killPagination();
      this._fetchModsData();
      this._updateModTypes();
    });

    new ClearInputField($elSearchBox);
  }
  _updateModTypes() {
    let $gameId = 1;
    let $selectGame = $('#modsGameSelect');
    let $selectType = $('#modsTypeSelect');
    if ($selectGame && $selectGame.children("option:selected")) {
      $gameId = $selectGame.children("option:selected").val();
      
    }
    ajaxGet({ url: config.api.modsTypes }).done(function (data) {
      data = $(data).filter(function () { return $(this)[0].gameTitleId == $gameId; }).remove();
      $selectType.empty();
      $.each(data, function (idx, item) {
        $selectType.append('<option value="' + item.modTypeId + '">' + item.modTypeName + '</option>');
      });
      $selectType.prepend('<option value="0" selected="selected">All</option>');
    });
  }
  _fetchModsData() {
    this.listLoader.show();
    //params POSTed to api
    let postParams = Object.assign({
      start: this.start,
      count: this.count,
    }, this.queryParams);
      if (window.location.pathname.includes('mods/installed')) {
          if (postParams.game == 1) {
              return;
          }
      }
      let apiUrl = this.options.modsListApi;
      if (window.location.pathname.includes('mods/installed')) {
          apiUrl = this.options.modsInstalledApi;
          if (postParams.game == 4) {
              apiUrl = this.options.modsApiV4.modsInstalled;
          }
      } else {
          if (postParams.game == 4) {
              apiUrl = this.options.modsApiV4.modsFind;
          }
      }
      
    let xhr = ajaxPost({
        url: apiUrl,
      data: JSON.stringify(postParams),
      statusCode: {
        401: function () {
          $('#sign-in-steam').foundation('open');
        },
      },
    });

    Promise.resolve(xhr).then((response) => {
      if (response) {
        this._renderPaginav(response);
        this._renderModsList(response);
      } else {
        this._error();
      }
      this.listLoader.hide();
    }).catch(() => {
      this._error();
      this.listLoader.hide();
    });

    if (this.state.initialDataFetch) {
      this.state.initialDataFetch = false;
    } else {
      this._updateQueryStr();
    }
  }

  _updateQueryStr() {
    let loc = location.href.split('?')[0];
    let str = $.param(this.queryParams); //convert params to string
    let pushUrl = `${loc}?${str}`;

    history.pushState(null, null, pushUrl);
  }

  _renderPaginav(response) {
    if (!this.pagination) {
      this.pagination = new Pagination(this.ui.$paginav, {
        numPageSize   : this.count,
        numTotalItems : response.totalCount,
      });
    }
  }

  /**
   * Update the search results when pagination is clicked
   */
  _onPaginationCallback(e, numPage) {
    this.start = numPage;
    this._fetchModsData();
  }

  _killPagination() {
    if (this.pagination) {
      this.pagination.kill();
      this.pagination = null;
    }
  }

  _renderModsList(response) {
    let delay = 50;

    if (this.tooltip) {
        this.tooltip.kill();
        this.tooltip = null;
    }

    this.ui.$listing.html(modsListing(response));

    this.ui.$listing.find('.search-results__row.not-loaded').each(function(index) {
      let $item = $(this);
      $item.delay(delay*index).queue(function() {
        $item.removeClass('not-loaded').dequeue();
      });
    });

    this.tooltip = new Tooltip({});
  }

  _deleteMod(modId, $el) {
    let self = this;
    const params = {
      id: modId,
      boolValue: true,
    }
    let xhr = ajaxPost({
      url: self.options.modsDeleteApi,
      data: JSON.stringify(params),
    });

    function modError() {
      // TODO: Add error state to mod listing when gear action is taken
      self.listLoader.hide();
      console.error('mod failed to delete');
    }

    self.listLoader.show();

    Promise.resolve(xhr).then((response) => {
      if (response && response.resultKey && response.resultKey === 'Deleted' && response.resultValue === 'true') {
        TweenMax.to($el, .3, {autoAlpha: 0, x: '-50px', ease: 'Quad.easeOut', onComplete: () => {
          $el.remove();
        }});
        self.listLoader.hide();
      } else {
        modError()
      }
    }).catch(() => {
      modError();
    });
  }

  _reportMod(modId) {
    alert(`You have clicked Report for mod ${modId} -- functionality is pending.`);
  }

  _uninstallMod(modId) {
    alert(`You have clicked Uninstall for mod ${modId} -- functionality is pending.`);
  }

  _updateMod(modId) {
    alert(`You have clicked Update for mod ${modId} -- functionality is pending.`);
  }

  _error() {
    //handle error
  }
}
