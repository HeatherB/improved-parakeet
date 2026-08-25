/**
 * ClansFlag
 *
 * @description
 * Flag as inappropriate functionality for a clan
 */

import Loading from '../component/Loading';
import ajaxGet from '../util/ajaxGet';
// import ajaxPost from '../util/ajaxPost';

export default class ClansFlag {
  constructor(objOptions) {
    this.init(objOptions);
  }

  init(objOptions) {
    this.options = Object.assign({
      selectorTrigger       : null,                            // element to bind action to
      selectorLabelSet      : '.flag-clan-set',                // button element for flag as inappropriate text
      selectorLabelCancel   : '.flag-clan-cancel',             // button element for cancel flag text
      selectorAlertFlagged  : '#alert_flagged',                // Flag Alert
      selectorErrorModal    : null,                            // error modal
      selectorErrorModalMsg : null,                            // error message inside modal
      apiUrl                : null,                            // api url
      apiPropNames          : null,                            // object of all api property names
      isFlagged             : window.wp_object.clanIsFlagged,  // has the user already flagged the clan as inappropriate?
      isLoggedIn            : window.wp_object.user_logged_in.status, //Is User Logged in
    }, objOptions);

    this.ui = {
      trigger               : $(this.options.selectorTrigger),
      labelSet              : null,
      labelCancel           : null,
      alertFlagged          : $(this.options.selectorAlertFlagged),
      errorModal            : $(this.options.selectorErrorModal),
      errorModalMsg         : $(this.options.selectorErrorModalMsg),
    };

    this.constant = {
      getAjaxContent        : ajaxGet,       // global utility for ajax requests
      loader                : new Loading(), // global loading icon
    };

    this.state = {
      isFlagged             : this.options.isFlagged, // current flagged state
    };

    // Define our data object.
    // This will hold API responses as well as data to send to the API for new requests.
    // All properties are defined below.
    this.data = {};

    // Define our request data object.
    // This gets passed to the API when requesting a new action.
    this.data.apiRequest = {
      [this.options.apiPropNames.flag]         : null,
      [this.options.apiPropNames.playerId]     : window.wp_object.playerId,
      [this.options.apiPropNames.clanId]       : window.wp_object.clan_ID,
    };

    if (this.ui.trigger.length) {
      this._initState();
    }
  }

  /**
   * Set the intial state of the button and the flagged state to send to API
   */
  _initState() {
    this.ui.labelSet    = this.ui.trigger.find(this.options.selectorLabelSet);
    this.ui.labelCancel = this.ui.trigger.find(this.options.selectorLabelCancel);

    // If user has already flagged the clan,
    // set the next API call to cancel the flag and show the cancel label
    if (this.state.isFlagged) {
      this.state.isFlagged = true;
      this.data.apiRequest[this.options.apiPropNames.flag] = false;
      this.ui.labelSet.hide();
      this.ui.alertFlagged.removeClass('hide');
      this.ui.alertFlagged.show();
      this.ui.labelCancel.removeClass('hide');
      this.ui.labelCancel.show();
    } else {
      this.state.isFlagged = false;
      this.data.apiRequest[this.options.apiPropNames.flag] = true;
      this.ui.labelSet.show();
      this.ui.labelCancel.hide();
    }

    this._addEventListeners();
  }

  /**
   * Trigger a new request
   */
  _onTrigger(e) {
    e.preventDefault();
    if(this.options.isLoggedIn){
      this._sendAction();
    }
  }

  /**
   * Make API request for this action
   */
  _sendAction() {
    this.constant.loader.show();

    let xhr = this.constant.getAjaxContent({
      url  : this.options.apiUrl,
      data : this.data.apiRequest,
    });

    Promise.resolve(xhr).then((response) => {
      //console.log('Flag original response: ', this.data.apiRequest);
      let success = false;
      let errorMsg;

      if (response) {
        if (response.hasOwnProperty(this.options.apiPropNames.responseStatus)) {
          success = response[this.options.apiPropNames.responseStatus];
        }

        if (response.hasOwnProperty(this.options.apiPropNames.responseError)) {
          errorMsg = response[this.options.apiPropNames.responseError];
        }

        if (success) {
          this.constant.loader.hide();
          this._toggleFlagState();
        } else {
          this._showError(errorMsg);
        }
      } else {
        this._showError();
      }
    }).catch((response) => {
      //console.log('clan action error: ', response);
      this._showError();
    });
  }

  /**
   * Open error modal and display message from API response
   */
  _showError(strErrorMsg) {
    this.constant.loader.hide();

    if (strErrorMsg) {
      this.ui.errorModalMsg.text(strErrorMsg);
    }

    this.ui.errorModal.foundation('open');
  }

  /**
   * Toggle the flagged state and update the button label
   */
  _toggleFlagState() {

    if (this.state.isFlagged) {
      this.state.isFlagged = false;
      this.data.apiRequest[this.options.apiPropNames.flag] = true;
      this.ui.labelSet.show();
      this.ui.alertFlagged.hide();
      this.ui.labelCancel.hide();
    } else {
      this.state.isFlagged = true;
      this.data.apiRequest[this.options.apiPropNames.flag] = false;
      this.ui.labelSet.hide();
      this.ui.alertFlagged.removeClass('hide');
      this.ui.alertFlagged.show();
      this.ui.labelCancel.removeClass('hide');
      this.ui.labelCancel.show();
    }
  }

  _addEventListeners() {
    this.ui.trigger.on('click', this._onTrigger.bind(this));
  }
}
