import Loading from "./Loading";

export default class ModeratorApplication {
  constructor() {
    this.init();
  }

  init() {

    this.applicationFormData = {
      "name": "",
      "email": "",
      "confirm_age": "",
      "confirm_insider": "",
      "country": "",
      "steam_id": "",
      "discord_id": "",
      "forum_gamertag": "",
      "prefer_to_moderate": "",
      "moderator_why": "",
    }

    this.ui = {
      $applicationForm: document.getElementById('vcm-form'),
      $applicationAlert: document.getElementById('submission_alert'),
      $applicationSubmit: document.getElementById('submit-vcm'),
    }

    this.allRequiredDone = false;

    this._events();
    this._initLoaders();
    
  }

  _initLoaders() {
    this.loader = new Loading({
      container: $('body'),
    });
  }

  _checkValidity() {
    let self = this;

    if( self.ui.$applicationForm.querySelector('#name').value !== '' 
        && self.ui.$applicationForm.querySelector('#email').value !== ''
        && /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(self.ui.$applicationForm.querySelector('#email').value) == true
        && self.ui.$applicationForm.querySelector('#confirm_insider').checked
        && self.ui.$applicationForm.querySelector('#confirm_age').checked
        && self.ui.$applicationForm.querySelector('#country').value !== '' 
        && self.ui.$applicationForm.querySelector('#moderator_why').value !== '' 
        && self.ui.$applicationForm.querySelector('#terms').checked 
        && ( self.ui.$applicationForm.querySelector('#steam_id').value !== '' || self.ui.$applicationForm.querySelector('#discord_id').value !== '' || self.ui.$applicationForm.querySelector('#forum_gamertag').value !== '' ) ) {
      self.allRequiredDone = true;
      self.ui.$applicationSubmit.disabled = false;
    } else {
      self.allRequiredDone = false;
      self.ui.$applicationSubmit.disabled = true;
    }
  }

  _events() {
    let self = this;

    // Check Validation
    $(document).on('click keyup', '#vcm-form', function(event) {

      if(event.target.id == 'email') {
        // check if properly filledout, when leave field
         $('#email').on('blur', function(event) {
          if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(self.ui.$applicationForm.querySelector('#email').value) == false) {
            self.ui.$applicationForm.querySelector('.validation_notice.email').innerHTML = 'Please enter a valid email address, using the format name@provider.com';
          } 
        });

        // check if come back and correct field without leaving
        $('#email').on('change keyup', function(event) {
          if(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(self.ui.$applicationForm.querySelector('#email').value) == true) {
            self.ui.$applicationForm.querySelector('.validation_notice.email').innerHTML = '';
          }

          self._checkValidity();
        });

      }
      self._checkValidity();

    });

    // Submit Application
    $(document).on('click', '#submit-vcm', function (event) {
      event.preventDefault();

      self.loader.show();
      self.ui.$applicationSubmit.disabled = true;
      self.ui.$applicationAlert.className = 'submitted';

      let preferred_channels = [];

      if(self.ui.$applicationForm.querySelector('#steam').checked == true) {
        preferred_channels.push(self.ui.$applicationForm.querySelector('#steam').value);
      }
      if(self.ui.$applicationForm.querySelector('#discord').checked == true) {
        preferred_channels.push(self.ui.$applicationForm.querySelector('#discord').value);
      }
      if(self.ui.$applicationForm.querySelector('#forums').checked == true) {
        preferred_channels.push(self.ui.$applicationForm.querySelector('#forums').value);
      }
      if(self.ui.$applicationForm.querySelector('#confirm_insider').checked == true) {
        self.applicationFormData['confirm_insider'] = 'Insider Status confirmed by applicant';
      }
      if(self.ui.$applicationForm.querySelector('#confirm_age').checked == true) {
        self.applicationFormData['confirm_age'] = '18+ Year of Age confirmed by applicant';
      }

      self.applicationFormData['name'] = self.ui.$applicationForm.querySelector('#name').value;
      self.applicationFormData['email'] = self.ui.$applicationForm.querySelector('#email').value;
      self.applicationFormData['country'] = self.ui.$applicationForm.querySelector('#country').value;
      self.applicationFormData['steam_id'] = self.ui.$applicationForm.querySelector('#steam_id').value;
      self.applicationFormData['discord_id'] = self.ui.$applicationForm.querySelector('#discord_id').value;
      self.applicationFormData['forum_gamertag'] = self.ui.$applicationForm.querySelector('#forum_gamertag').value;
      self.applicationFormData['prefer_to_moderate'] = preferred_channels;
      self.applicationFormData['moderator_why'] = self.ui.$applicationForm.querySelector('#moderator_why').value;

      // Set Data to be sent
      let applicationData = self.applicationFormData;

      self._submitApplicationData('turnin_vcm_application', JSON.stringify(applicationData));
    });

  }

  _submitApplicationData(dataAction,dataString) {
    let self = this;
      
      $.ajax({
        type: "POST",
        dataType: 'JSON',
        async: true,
        data: {
          'action': dataAction,
          'transData': dataString,
        },
        url: window.wp_object.ajaxurl,
        error: function (response) {
          self.ui.$applicationAlert.className = 'submitted error';
          self.loader.hide();
        },
        success: function (response) {
          self.ui.$applicationAlert.className = 'submitted success';
          self.ui.$applicationSubmit.parentNode.removeChild(self.ui.$applicationSubmit);
          self.loader.hide();
        },
      });
  }

}
