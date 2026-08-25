import * as Convert from 'xml-js';
import config from "../config";
import Loading from "./Loading";
import AzureMediaModal from '../component/AzureMediaModal';
import SteamLink from '../component/SteamLink';

export default class Profile {

  constructor() {
    this._initClasses();
    this._initLoaders();
    this._init();
  }

  _init() {

    this.ui = {
      optOutBtn: $('#opt_out_survey'),
      savePrefEmail: $('#save_pref_email'),
      modal: $('#insiders-profile'),
      videoModal: $('#video-modal'),
      signupModal: $('#insiders-signup-success'),
    }
    this.data = {
      DxDiag: {},
      PCSpecs: {},
    }
    this.status = {
      is_subscribed: false,
      is_verified: false,
    }
    this.subscriptionMatch = 'new_permissiontocontact';

    this._eventHandlers();
    this._getCountries();

    this._isInsiderBanned(this._checkParams('banned'));
    this._isInsiderSignup(this._checkParams('signup'));

  }

  _initClasses(){
    this.SteamLink = new SteamLink();
  }

  _initLoaders() {
    this.loader = new Loading({
      container: $('body'),
    });
  }

  _isInsiderSignup(check){
    if(check) {
      if($('[data-show_intro]') && $('[data-show_intro]').data('show_intro')) {
        var AzureMedia = new AzureMediaModal();
        this.ui.videoModal.foundation('open');
      } else {
        this.ui.signupModal.foundation('open');
      }
      window.history.pushState(null, null, window.location.pathname);
    }
  }

  _isInsiderBanned(check){
    if(check) {
      this._errorMessage('This account is banned from participation in the Age Insider Program.');
      window.history.pushState(null, null, window.location.pathname);
    }
  }

  // Check Params
  _checkParams(variable){
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          if (pair[0] == variable) {
              return pair[1];
          }
      }
      return (false);
  }

  // Handlers
  _eventHandlers() {
    var self = this;

    // Show loader when clicked
    $(document).on('click', '.js-steam_delete', function () {
      self.loader.show();
      $('#insiders-profile').foundation('close');
    });

    // Triggered When Video Modal is Closed
    $(document).on('followup', function () {
      self.ui.signupModal.foundation('open');
    });

    // Triggered When Steam Modal is Closed
    $(document).on('steam_login_closed', function () {
      if(self.SteamLink.steamData.steam_id.length){
        self.loader.show();
        self._ajaxPost('updateSteam', '', '');
      }
    });

    // Triggered When Steam is deleted
    $(document).on('steam_deleted', function () {
      window.location.reload();
    });

    // Modal Show/Hide Sections
    $(document).on("touchstart click", ".js-insiders_modal", function (event) {
      event.preventDefault();

      let self = this;

      if ($(this).hasClass('update_dxdiag_btn')) {
        $('.remove_dxdiag_modal').hide();
        $('.opt-out').hide();
        $('.disconnect_steam_modal').hide();
        $('.newsletter_unsubscribe_modal').hide();
        $('.upload_dxdiag').show();
      }

      if ($(this).hasClass('optout_btn')) {
        $('.remove_dxdiag_modal').hide();
        $('.upload_dxdiag').hide();
        $('.disconnect_steam_modal').hide();
        $('.newsletter_unsubscribe_modal').hide();
        $('.opt-out').show();
      }

      if ($(this).hasClass('remove_dxdiag_btn')) {
        $('.opt-out').hide();
        $('.upload_dxdiag').hide();
        $('.disconnect_steam_modal').hide();
        $('.newsletter_unsubscribe_modal').hide();
        $('.remove_dxdiag_modal').show();
      }

      if ($(this).hasClass('disconnect_steam_btn')) {
        $('.opt-out').hide();
        $('.upload_dxdiag').hide();
        $('.remove_dxdiag_modal').hide();
        $('.newsletter_unsubscribe_modal').hide();
        $('.disconnect_steam_modal').show();
      }

      if ($(this).hasClass('newsletter_unsubscribe_btn')) {
        $('.opt-out').hide();
        $('.upload_dxdiag').hide();
        $('.remove_dxdiag_modal').hide();
        $('.disconnect_steam_modal').hide();
        $('.newsletter_unsubscribe_modal').show();
      }

      $('#insiders-profile').foundation('open');
      return false;
    });

    // Disable Save Buttons until something changes
    $('.ac_content form').on('change', 'input', function () {
      $(this).parents('ul').siblings('button.save_pref:disabled').prop('disabled', false);
    });

    // Update Insider Communications Prefs
    $('.js-update_comm_prefs').on('click',function (event) {
      event.preventDefault();
      $(this).prop('disabled',true).addClass('pending');

      let pref_email = $('#pref_email').val();
      let current_email = $('#pref_email').attr('data-currentemail');

      let country = $('#pref_country').val();
      let countryValid = false;
      let emailValidated = false;

      /* ensure country is checked first */
      if (country != 'instruct') {
          countryValid = true;
          $('#profile_error').empty();
          $('.js-update_comm_prefs').prop('disabled',false).removeClass('pending');
      } else {
          self._errorMessage('Please select a country or region');
          $('.js-update_comm_prefs').prop('disabled',false).removeClass('pending');
      }

      // Validate Pref Email
      if(countryValid && $('#pref_email').val()){

        self.loader.show();

        let pref_email = $('#pref_email').val();

        var pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        let emailValid = $.trim(pref_email).match(pattern) ? true : false;

        if (!emailValid) {
          self.loader.hide();
          self._errorMessage('You must enter a valid email address');
          return false;
        } else {
          $('#profile_error').empty();
          emailValidated = true;
        }

      } else if(!$('#pref_email').val()) {
        self._errorMessage('You must enter a valid email address');
        return false;
      }

      let button = $(this);

      let answers = {};
      let action  = "updateCommunicationPrefs";
      let nonce = {
        actionNonce: $(this).data('nonce'),
        CPMNonce: $('#new_permissiontocontact').data('cpmnonce'),
      }

      // Current Email
      answers['current_email'] = current_email;
      // Pref Email
      answers['pref_email'] = pref_email;
      // Country
      answers['country'] = $('#pref_country option:selected').val();

      // Add Contact Prefs
      $('.insider_comm_prefs input').each(function (index, value) {
        let answer = $(value).is(':checked');
        answers[$(value).attr('data-answer')] = answer;
      });

      if(countryValid && emailValidated) {
        button.prop('disabled',true);
        self._ajaxPost(action, answers, nonce);
      }

    });

    // Beta Preferences
    $('.insider_beta_prefs').on('click', '.js-update_beta_prefs', function(){
      $(this).prop('disabled',true).addClass('pending');

      self.loader.show();

      let answers = [];
      let action = "updateBetaPrefs";
      let nonce = $(this).data('nonce');

      $('.insider_beta_prefs input').each(function (index, value) {
        if($(value).is(':checked')) {
          answers.push(parseInt($(value).attr('data-answer')));
        }
      });

      self._ajaxPost(action, answers, nonce);
    });

    // Update Insider Game Prefs
    $('#save_game_prefs').click(function () {
      $(this).prop('disabled',true).addClass('pending');

      self.loader.show();

      let nonce = $(this).data('nonce');

      let questions = {};

      let button = $(this);

      $('.insider_game_prefs ul.insider_settings_cb').each(function (index, value) {

        let question = $(this).data('question').toString();
        let answers = [];

        $(this).find('input:checked').each(function (index, value) {
          let answer = $(this).data('answer');

          if (answer == "other") {
            let currentEl = $(this).attr('ID');
            let inputText = $('#' + currentEl ).parents('ul').find('.other_input').val()
            answers.push({other: inputText});
          } else {
            answers.push($(value).data('answer').toString());
          }
        });

        questions[question] = answers;

      });

      let savable = true;
      $('form.insider_game_prefs ul').each(function (i, v) {
        if ($(v).find('input:checked').length < 1) {
          savable = false;
        }
      });

      if (savable) {
        $.ajax({
          type: "POST",
          dataType: 'JSON',
          data: {
            action: "updateUserPrefs",
            questions: questions,
            nonce: nonce,
          },
          url: window.wp_object.ajaxurl,
          success: function (response) {
            if (response.success) {
              self.loader.hide();
              $(button).prop('disabled', true);
            }
          },
        });
        $('#profile_error').empty();
      } else {
        self.loader.hide();
        self._errorMessage('Please select at least one answer per game preference');
      }
    });

    // OPT-OUT
    $('#insiders-profile').on('click', '.js-del_survey', function () {
      $(this).prop('disabled',true).addClass('pending');
      $('#insiders-profile').foundation('close');
      self.loader.show();

      // Make sure this is intended
      let nonce = $(this).data('nonce');

      // Erase Cookie
      let d = new Date();
      d.setTime(d.getTime() + (-1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = 'InsiderSurvey' + "=" + null + ";" + expires + ";path=/";

      // Delete user Dynamics function
      $.ajax({
        type: "POST",
        dataType: 'JSON',
        data: {
          action: "insiderOptOut",
          current_email: $('#pref_email').attr('data-currentemail'),
          nonce: nonce,
        },
        url: window.wp_object.ajaxurl,
        success: function (response) {
          if (response.success) {
            window.location.reload();
          }
        },
      });
    });

    // Resend Verification
    $('#communicationsProfileSettings').on('click', '#resend_email_verification', function (event) {
      event.preventDefault();
      self.loader.show();

      let nonce = $(this).data('nonce');

      $.ajax({
        type: "POST",
        dataType: "JSON",
        data: {
          action: "sendEmailVerification",
          pref_email: $('#pref_email').attr('data-currentemail'),
          nonce: nonce,
        },
        url: window.wp_object.ajaxurl,
        success: function (response) {
          if (response.success) {
            window.location.reload();
          }
        },
      });

    });

    // Remove DxDiag
    $('#insiders-profile').on('click', '.remove_dxdiag', function () {
      $('#insiders-profile').foundation('close');
      self.loader.show();

      let action = 'deleteDxDiag';
      let nonce = $(this).data('nonce');
      let data = '';

      self._ajaxPost(action, data, nonce);

    });

    // DxDiag Upload
    $(document).on('change', '.dxdiag_upload', function (event) {

      //Retrieve the first (and only!) File from the FileList object
      let uploadedFile = event.target.files[0];

      if (uploadedFile) {

        let uploadedFileName = uploadedFile.name;
        let uploadedFileNameExtension = uploadedFileName.split('.').pop();

        if (uploadedFileNameExtension.toLowerCase() == 'xml') {
          // this is an xml file so do the parsing

          let r = new FileReader();
          r.onload = function (e) {
            var xmlData = e.target.result;


            // Change xmlData into a json object
            //let jsonObj = Parser.parse(xmlData);  // this is for fast-xml-parser ( like better )

            // https://www.npmjs.com/package/xml-js
            // Converts the _text to a normal text node
            let removeJsonTextAttribute = function (value, parentElement) {
              let keyNo = Object.keys(parentElement._parent).length;
              let keyName = Object.keys(parentElement._parent)[keyNo - 1];
              parentElement._parent[keyName] = value;
            };

            // Setup the xml to json filtering options (note the textFn)
            const convertOpts = {
              compact: true,
              trim: true,
              ignoreDeclaration: true,
              ignoreInstruction: true,
              ignoreAttributes: true,
              ignoreComment: true,
              ignoreCdata: true,
              ignoreDoctype: true,
              spaces: 0,
              textFn: removeJsonTextAttribute,
            };

            // Convert our xml file to a json string
            let dxdiagString;
            try {
              dxdiagString = Convert.xml2json(xmlData, convertOpts);
            } catch (error) {
              // The xml file did not contain a DxDiag node
              let error_message = 'The uploaded xml file was not valid.  '
                + '  Please upload a valid <strong>DxDiag.xml file</strong>.';

              $('.js-upload_dx_diag').prop('disabled', 'disabled');
              $(".modal-content.upload_dxdiag .error_msg").empty().append("<li>" + error_message + "</li>");
            }

            // Then convert the json string to an object
            let dxdiagObj = JSON.parse(dxdiagString);

            // Check for a DxDiag node in the JSON Object
            if (!dxdiagObj.DxDiag) {

              // The xml file did not contain a DxDiag node
              let error_message = 'The uploaded xml file was not valid.  '
                + '  Please upload a valid <strong>DxDiag.xml file</strong>.';


              $('.js-upload_dx_diag').prop('disabled', 'disabled');
              $(".modal-content.upload_dxdiag .error_msg").empty().append("<li>" + error_message + "</li>");

            } else {
              // There is a DxDiag node present

              $(".modal-content.upload_dxdiag .error_msg").empty();

              $('.js-upload_dx_diag').prop('disabled', false);

              self.data.DxDiag = dxdiagObj.DxDiag;
              self._save_pc_specs();
            }

          };
          r.readAsText(uploadedFile);

        } else {
          // this was not an xml file so throw an error

          let error_message = 'The uploaded file was  of type '
            + '<strong>' + uploadedFileNameExtension.toLowerCase() + '</strong>.'
            + '  Please upload a <strong>DxDiag.xml file</strong>.';

          $(".modal-content.upload_dxdiag .error_msg").empty().append("<li>" + error_message + "</li>");

        }

      } else {
        console.log("Failed to load file");
      }

    });

    // Send DX Upload
    $('#insiders-profile').on('click', '#dxdiag_upload', function (event) {
      $('#insiders-profile').foundation('close');
      self.loader.show();

      let action = 'updateDxDiag';
      let nonce = $(this).data('nonce');
      let data = {
        dxDiag: JSON.stringify(self.data.DxDiag),
        PCSpecs: JSON.stringify(self.data.PCSpecs),
        machineID: self.data.PCSpecs.MachineId.replace(/[\{\}']+/g,''),
      }

      self._ajaxPost(action, data, nonce);

    });

    // Clicking none clears other checkboxes
    $(document).on('click', "input[data-exclusive='1']", function () {
      $(this).parents('ul').find("input[type=checkbox]:not(input[data-exclusive='1'])").prop('checked', false);
      $(this).parents('ul').find('input[type=text]').prop('disabled', true);
    });

    // Clicking Remove check from none
    $('.insider_game_prefs').on('click', "input[type=checkbox]:not(input[data-exclusive='1'])", function () {
      $(this).parents('ul').find("input[data-exclusive='1']").prop('checked', false);
    });

    // Disable enable other input field
    $('.insider_game_prefs').on('click', '.other', function () {
      if ($(this).prop('checked')) {
        $(this).parents('ul').find('.other_input').prop('disabled', false);
      } else {
        $(this).parents('ul').find('.other_input').prop('disabled', true);
      }
    });

  }

  _getCountries(){
    let current_country = $('#pref_country').attr('data-country');
    $.ajax({
      dataType: "json",
      url: config.api.CountryList,
      success: function(response){
        $('#pref_country').append('<option value="instruct"> - Select a Country/Region - </option>');
        $.each(response,function(key,value){
          let select = (value == current_country ? 'selected' : '');
          $('#pref_country').append('<option value="'+ value +'" ' + select + '>'+ key +'</option>')
        })
      },
    });
  }

  _save_pc_specs() {

    let self = this;

    // ------------------------------
    // Get the following Information:
    // ------------------------------
    // SystemInformation
    //   o  OperatingSystem
    //   o  Memory
    //   o  Processor
    // Display Devices
    //   o  Display Device
    //        o  Card Name
    //        o  ChipType
    //        o  DisplayMemory
    // ------------------------------

    // Get object nodes
    let systemInformation = self.data.DxDiag.SystemInformation;
    let displayDevices = self.data.DxDiag.DisplayDevices;

    // Operating System
    if (systemInformation.OperatingSystem) {
      self.data.PCSpecs.OperatingSystem = systemInformation.OperatingSystem;
    }

    // Memory
    if (systemInformation.Memory) {
      self.data.PCSpecs.Memory = systemInformation.Memory;
    }

    // Processor
    if (systemInformation.Processor) {
      self.data.PCSpecs.Processor = systemInformation.Processor;
    }

    // Display Devices
    if (displayDevices) {
      self.data.PCSpecs.DisplayDevices = displayDevices;
    }

    // Machine ID
    if(systemInformation.MachineId) {
      self.data.PCSpecs.MachineId = systemInformation.MachineId;
    }

  }

  _ajaxPost(action, data, nonce) {
    let self = this;

    $.ajax({
      type: "POST",
      dataType: 'JSON',
      data: {
        action: action,
        data: data,
        nonce: nonce,
      },
      url: window.wp_object.ajaxurl,
      error: function (response) {
        self.loader.hide();
        $('button.pending').prop('disabled',false).removeClass('pending');
        self._errorMessage('There was an error saving your information.');
      },
      success: function (response) {
        if (response.success) {
          window.location.reload();
        } else {
          self.loader.hide();
          $('button.pending').prop('disabled',false).removeClass('pending');
          self._errorMessage(response.message);
        }
      },
    });
  }

    _errorMessage(message) {
        if ($('#insiders-profile').length != 0) {
            $('#insiders-profile').foundation('close');
        }
        $('#profile_error').empty().append('<span>' + message + '</span>');
        $('html, body').animate({
          scrollTop: $('#profile_error').offset().top + -100,
        }, 600);
    }
}
