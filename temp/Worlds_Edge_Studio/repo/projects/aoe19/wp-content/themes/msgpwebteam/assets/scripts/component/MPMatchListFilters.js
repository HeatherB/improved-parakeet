/**
 * ClansSearchFilters
 * @description
 * Render search input and filters for clans.
 * Fire a custom event callback when form is submitted so ClansSearchResults can get new data.
 */

import TweenMax from 'gsap';
import config from '../config';
import Loading from '../component/Loading';
import ajaxGet from '../util/ajaxGet';
// import ajaxPost from '../util/ajaxPost';
import getUrlParam from '../util/getUrlParam';
import ClearInputField from '../util/ClearInputField';
import templateFilters from '../templates/clansFilters.html';

export default class ClansSearchFilters {
  constructor($container, objOptions) {
    this.init($container, objOptions);
  }

  init($container, objOptions) {
    this.options = Object.assign({
      selectorForm     : '.clans-filters__form',             // form element
      apiUrl           : config.api.clansSearchFilters,      // api url
      apiPropNames     : null,                               // object of all api property names
      template         : templateFilters,                    // template for rendering filters
      filtersCallback  : config.events.onClansSearch,        // custom event fired on form submit
      resultsCallback  : config.events.onClansSearchResults, // custom event fired when new results are loaded
    }, objOptions);

    this.ui = {
      window          : $(window),
      pageTitle       : $(document).find('title'),
      container       : $container,
      form            : null,
      inputTerm       : null,
      selectSkill     : null,
      selectDate      : null,
      selectActivity  : null,
      selectLanguage  : null,
      selectMembers   : null,
      inputSort       : null,
      inputOrder      : null,
      searchBox       : null,
    };

    this.constant = {
      animSpeed       : 0.5,               // (s) TweenMax animation speed
      animEase        : 'Quad.easeOut',    // TweenMax animation ease
      getUrlParam     : getUrlParam,       // global utility for getting query param value
      getAjaxContent  : ajaxGet,           // global utility for ajax requests
      loader          : new Loading({      // placeholder for global loading icon
        container     : this.ui.container, // element to add loader into
      }),
    };

    this.data = {
      [this.options.apiPropNames.term]         : null,  // null or text input value (clan name or tag)
      [this.options.apiPropNames.skill]        : null,  // null or select value ('beginner', 'intermediate', 'advanced')
      [this.options.apiPropNames.activity]     : null,  // null or select value ('daily', 'weekly', 'monthly')
      [this.options.apiPropNames.members]      : null,  // null or select value ('1-49', '50-100', etc)
      [this.options.apiPropNames.date]         : null,  // null or select value ('week', 'month', 'year')
      [this.options.apiPropNames.language]     : null,  // null or select value ('english' etc)
      [this.options.apiPropNames.sortCategory] : null,  // null or text input value (category name)
      [this.options.apiPropNames.sortOrder]    : null,  // null or text input value (ASC or DESC)
    };

    // Current values for each query param
    this.state = {
      curTerm         : null,
      curSkill        : null,
      curActivity     : null,
      curMembers      : null,
      curDate         : null,
      curLanguage     : null,
      curSort         : null,
      curOrder        : null,
      popstateReload  : false,  // Should we reload page on popstate?
    };

    this._getFilterData();
  }

  /**
   * Get the value of each query string param (or values from search results callback data)
   */
  _getUrlParams(objParams) {
    let params;

    // If we have callback data, use it
    if (objParams) {
      params = objParams;

      this.state.curTerm     = objParams[this.options.apiPropNames.term];
      this.state.curSkill    = objParams[this.options.apiPropNames.skill];
      this.state.curActivity = objParams[this.options.apiPropNames.activity];
      this.state.curMembers  = objParams[this.options.apiPropNames.members];
      this.state.curDate     = objParams[this.options.apiPropNames.date];
      this.state.curLanguage = objParams[this.options.apiPropNames.language];
      this.state.curSort     = objParams[this.options.apiPropNames.sortCategory];
      this.state.curOrder    = objParams[this.options.apiPropNames.sortOrder];
    } else {
      // Otherwise, get the url
      params = window.location.href;
      params = params.split('?')[1];

      this.state.curTerm     = this.constant.getUrlParam(this.options.apiPropNames.term, params);
      this.state.curSkill    = this.constant.getUrlParam(this.options.apiPropNames.skill, params);
      this.state.curActivity = this.constant.getUrlParam(this.options.apiPropNames.activity, params);
      this.state.curMembers  = this.constant.getUrlParam(this.options.apiPropNames.members, params);
      this.state.curDate     = this.constant.getUrlParam(this.options.apiPropNames.date, params);
      this.state.curLanguage = this.constant.getUrlParam(this.options.apiPropNames.language, params);
      this.state.curSort     = this.constant.getUrlParam(this.options.apiPropNames.sortCategory, params);
      this.state.curOrder    = this.constant.getUrlParam(this.options.apiPropNames.sortOrder, params);
    }

    if (this.state.curTerm) {
      this.state.curTerm = decodeURIComponent(this.state.curTerm.replace(/\+/g, " "));
    }

    this._setActiveStates();
  }

  /**
   * Set active state of all form fields
   */
  _setActiveStates() {
    this._setActiveInput(this.ui.inputTerm, this.state.curTerm);
    this._setActiveFilter(this.ui.selectSkill, this.state.curSkill);
    this._setActiveFilter(this.ui.selectActivity, this.state.curActivity);
    this._setActiveFilter(this.ui.selectMembers, this.state.curMembers);
    this._setActiveFilter(this.ui.selectDate, this.state.curDate);
    this._setActiveFilter(this.ui.selectLanguage, this.state.curLanguage);
    this._setActiveInput(this.ui.inputSort, this.state.curSort);
    this._setActiveInput(this.ui.inputOrder, this.state.curOrder);
  }

  /**
   * Define all our form elements
   */
  _getFormElements() {
    this.ui.form            = this.ui.container.find(this.options.selectorForm);
    this.ui.inputTerm       = this.ui.container.find('#' + [this.options.apiPropNames.term]);
    this.ui.selectSkill     = this.ui.container.find('#' + [this.options.apiPropNames.skill]);
    this.ui.selectDate      = this.ui.container.find('#' + [this.options.apiPropNames.date]);
    this.ui.selectActivity  = this.ui.container.find('#' + [this.options.apiPropNames.activity]);
    this.ui.selectLanguage  = this.ui.container.find('#' + [this.options.apiPropNames.language]);
    this.ui.selectMembers   = this.ui.container.find('#' + [this.options.apiPropNames.members]);
    this.ui.inputSort       = this.ui.container.find('#' + [this.options.apiPropNames.sortCategory]);
    this.ui.inputOrder      = this.ui.container.find('#' + [this.options.apiPropNames.sortOrder]);
    this.ui.searchBox       = this.ui.form.find('#clansSearchBox');

    new ClearInputField(this.ui.searchBox);

    this._addEventListeners();
    this._getUrlParams();
  }

  /**
   * Update input field with current value
   */
  _setActiveInput($input, value) {
    if ($input) {
      $input.val(value);
    }
  }

  /**
   * Set the active option for a given select menu
   */
  _setActiveFilter($filterSelect, selectValue) {
    let $options = $filterSelect.find('option');
    let curValue = selectValue;

    if (curValue) {
      $.each($options, (i, el) => {
        let $curOption = $(el);

        if ($curOption.val() === curValue) {
          $curOption.prop('selected', 'selected');
        }
      });
    }
  }

  /**
   * Make API call to get the filter options
   */
  _getFilterData() {
    this.constant.loader.show();

    let xhr = this.constant.getAjaxContent({
      url : this.options.apiUrl,
    });

    Promise.resolve(xhr).then((response) => {
      // console.log('filters response ',response);
      if (response) {
        Object.assign(this.data, response);
        this._renderItems();
      } else {
        this._showError();
      }
    }).catch((response) => {
      console.log('search filters error: ', response);
      this._showError();
    });
  }

  /**
   * Display the results
   */
  _renderItems() {
    this.constant.loader.hide();
    this.ui.container.empty();

    // Create the markup
    let html = this.options.template(this.data);
    let $filters = $(html);

    this.ui.container.append($filters);

    TweenMax.fromTo($filters, this.constant.animSpeed, {
      autoAlpha : 0,
    }, {
      autoAlpha : 1,
      ease      : this.constant.animEase,
      onComplete: () => {
        this._getFormElements();
      },
    });
  }

  /**
   * If API fails, we can still render the filters. They will just be empty.
   */
  _showError() {
    this._renderItems();
  }

  /**
   * Update query params in URL and trigger our custom event callback to update the results (ClansSearchResults)
   */
  _getFormData(doCallback = true) {
    var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?';

    for (let param in this.options.apiPropNames) {
      let $curItem = $('#' + this.options.apiPropNames[param]);
      let curValue = $curItem.val();

      if (typeof curValue === 'undefined') {
        curValue = '';
      }

      newUrl += this.options.apiPropNames[param] + '=' + curValue + '&';
    }

    // remove last &
    newUrl = newUrl.substring(0, newUrl.length - 1);

    history.pushState(this.state, this.ui.pageTitle.text(), newUrl);

    if (doCallback) {
      $.event.trigger(this.options.filtersCallback);
    }
  }

  /**
   * Prevent form submit and process manually
   */
  _onFormSubmit(e) {
    e.preventDefault();
    this._getFormData();
  }

  /**
   * Update layout when new search results are displayed (from pagination or sort)
   */
  _onResultsCallback(e, objParams) {
    this._getUrlParams(objParams);
    this._getFormData(false);
  }

  _addEventListeners() {
    this.ui.form.on('submit', this._onFormSubmit.bind(this));
    this.ui.window.on(this.options.resultsCallback, this._onResultsCallback.bind(this));

    // Reload the page on back button since we are using pushState to update history.
    window.onpopstate = () => {
      if (this.state.popstateReload) {
        window.location.reload(true);
      }
    };

    // Prevent reload loop on initial render if browser fires popstate on page load.
    this.state.popstateReload = true;
  }
}
