/**
 * ClansAction
 *
 * @description
 * Utility for one-off actions like joining, leaving, deleting clans.
 */

import Loading from '../component/Loading';
import ajaxGet from '../util/ajaxGet';
// import ajaxPost from '../util/ajaxPost';

export default class ClansAction {
  constructor(objOptions) {
    this.init(objOptions);
  }

  init(objOptions) {
    this.options = Object.assign({
      selectorTrigger       : null,          // element to bind action to
      selectorErrorModal    : null,          // error modal
      selectorErrorModalMsg : null,          // error message inside modal
      selectorNewMotd       : $('#new_motd'),// New motd
      selectorMotdText      : $('.new_motd_text'),// New motd text
      dataAttrBtnAction     : 'clan-action', // data attr name on trigger used for type of action to send to api
      apiUrl                : null,          // api url
      apiPropNames          : null,          // object of all api property names
      isLoggedIn            : window.wp_object.user_logged_in.status, //Is User Logged in
      loadedOnce            : false, //Run only once
    }, objOptions);

    this.ui = {
      trigger               : $(this.options.selectorTrigger),
      errorModal            : $(this.options.selectorErrorModal),
      errorModalMsg         : $(this.options.selectorErrorModalMsg),
      newMotdModal          : $(this.options.selectorNewMotd),
      newMotdText           : $(this.options.selectorMotdText),
      newMotdSave           : $(this.options.selectorMotdSave),
      newMotd               : $('.new_motd'),
    };

    this.constant = {
      getAjaxContent        : ajaxGet,       // global utility for ajax requests
      loader                : new Loading(), // global loading icon
    };

    // Define our data object.
    // This will hold API responses as well as data to send to the API for new requests.
    // All properties are defined below.
    this.data = {};

    // Define our request data object.
    // This gets passed to the API when requesting a new action.
    this.data.apiRequest = {
      [this.options.apiPropNames.playerStatus] : null,
      [this.options.apiPropNames.playerId]     : window.wp_object.playerId,
      [this.options.apiPropNames.clanId]       : window.wp_object.clan_ID,
      [this.options.apiPropNames.message]      : null,
    };

    if (this.ui.trigger.length) {
      this._addEventListeners();
    }

  }

	
	//Get Content On load
	_getPinned() {
		if(!this.options.loadedOnce){
			this.data.apiRequest[this.options.apiPropNames.playerStatus] = 'pinned';

			$.ajax({
				dataType: "json",
				url: this.options.apiUrl,
				data: this.data.apiRequest,
				success: function(data) {
					$('.daily_message_description').text(data.pinned);
					$('.clans-daily-msg__date').text(data.date);
				},
			});
			
			this.options.loadedOnce = true;
		}
	}
  
  /**
   * Get the action name from the data attr on trigger and make our request
   */
  _onTrigger(e) {
    e.preventDefault();
    
    let $curTarget = $(e.currentTarget);
    let curAction = $curTarget.data(this.options.dataAttrBtnAction);

    this.data.apiRequest[this.options.apiPropNames.playerStatus] = curAction;
    this.data.apiRequest[this.options.apiPropNames.message] = this.ui.newMotdText.val();
    
    if(this.options.isLoggedIn){
      this._sendAction();
    }
  }
  
  _newMotd(e){
    this.ui.newMotdModal.foundation('open');
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

      let success = false;
      let deleted = false;
      let errorMsg;

      if (response) {
        
        if (response.hasOwnProperty(this.options.apiPropNames.responseStatus)) {
          success = response[this.options.apiPropNames.responseStatus];
          deleted = response['deleted'];
        }

        if (response.hasOwnProperty(this.options.apiPropNames.responseError)) {
          
          errorMsg = response[this.options.apiPropNames.responseError];
          errorMsg = response['error'];
        }
        if (success && deleted) {
          window.location.href = '/clans/';
        }
        else if (success) {
          this._refreshView();
        } else {
          this._showError(errorMsg);
        }
      } else {
        this._showError();
      }
    }).catch((response) => {
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
   * Refresh the page on success, so we can reset the view with current user status/permissions
   */
  _refreshView() {
    this.constant.loader.show();
    window.location.reload(true);
  }

  _addEventListeners() {
    this.ui.trigger.on('click', this._onTrigger.bind(this));
    this.ui.newMotd.on('click', this._newMotd.bind(this));
		$(this).ready(this._getPinned());
  }
}
