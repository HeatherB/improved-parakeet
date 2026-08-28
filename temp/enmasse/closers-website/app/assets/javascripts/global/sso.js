;SSO = {
    logged_in: null,
    accountUrl: null,
    screenName: null,
    emp: null,
    errorMessage: '<span data-tooltip data-width class="has-tip error" title="Unable to retrieve EMP balance.">ERROR</span>',

    binder: function(){
      $('#eme-logout').bind('click', function(e){
          e.preventDefault();
          SSO.logout();
      });
    },

    setup: function(accounturl){
        SSO.accountUrl = accounturl;
        if ($.cookie('screen_name') && $.cookie('screen_name') != "") {
          SSO.screenName = $.cookie('screen_name');
          SSO.emp = "<span class='loading'></span>";
          
          SSO.getEMP();
          //$('#account').append( SSO.loggedInButtons );
          SSO.binder();
        }
        $('#account').show();
    },

    getEMP: function(){
      if ( !$.isNumeric($.cookie('emp')) ){
        // need fail
        $.get('/account/emp', function(data){
          if(data === 'error'){
            SSO.emp = SSO.errorMessage;
          } else {
            SSO.emp =  data;
          }
          $('.logged_out').remove();
          $('#account ul').append( SSO.loggedInButtons );
          SSO.binder();
        }).fail(function(){
          SSO.emp = SSO.errorMessage;
          $('.logged_out').remove();
          $('#account ul').append( SSO.loggedInButtons );
          SSO.binder();
        });
      } else {
        SSO.emp =  $.cookie('emp');
      }
    },
    getScreenName: function(){ return SSO.screenName; },
    isLoggedIn: function(){ return !(SSO.screenName === null)},
    
    loggedInButtons: function(){
        userBar = '<li class="welcome">' + SSO.screenName + ' <span class="acct-emp"> - EMP: ' + SSO.emp + '</span></li>';
        userBar += '<li><a href="https://' + SSO.accountUrl + '">Account Settings</a></li>';
        userBar += '<li><a href="#" id="eme-logout">Sign Out</a></li>';

        return userBar;
    },

    logout: function () {
      $.removeCookie('screen_name');
      $.removeCookie('screen_name', { domain: '.enmasse.com' });
      $.removeCookie('emp');
      var ifrm = document.createElement("IFRAME");
      ifrm.setAttribute("src", "https://"+SSO.accountUrl+"/signout");
      ifrm.setAttribute("onload", "window.location.reload()");
      ifrm.style.width = 1+"px";
      ifrm.style.height = 1+"px";
      document.body.appendChild(ifrm);
    },

    refresh: function () {
      $.get('/refresh-user', function(data){
        data = $.parseJSON(data);
        if(!data.loggedIn){
          this.logout();
          return;
        }
        if(!data.changed){
          return;
        }
        if(data.drastic){
          document.reload(true);
          return;
        }
        // convert this part to a Callback later VVVV #TODO
        var $obj = $('#game-account-selector');
        if (data.accounts.length > 0) {
          var reg = new RegExp("\\(Elite\\)$");
          $.each( data.accounts, function(i, acc) {
            // have an option tag
            var opt = $obj.find("option[value='"+acc.id+"']");
            opt.data("elite", acc.subscription_active);

            var ELITE_DROPDOWN_TAG = " (Elite)";

            if(acc.subscription_active && !reg.test(opt.text()) ){
              opt.text(opt.text() + ELITE_DROPDOWN_TAG);
            }
            else if(!acc.subscription_active && reg.test(opt.text())) {
              opt.text( opt.text().replace(ELITE_DROPDOWN_TAG, '') );
            }
          });
          modal.message("Your account status may have changed in a way that affects the price of your purchase. Please review your order before continuing.", "warning");
          $obj.change();
        }
      });
    }
};
