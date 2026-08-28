$(function() {
  // Start with your project-level client-side javascript here.
  // JQuery and lodash (_) are both included with Apostrophe, so no need to
  // worry about including them on your own.
  

  // login navigation
  	var LoginBox = {
	  box: $("#login-box"),
	  address: "https://account-edge.enmasse.com/remote_logins",
	  showLoginBox: function(e) {
	    e.preventDefault();
	    $('#login-box iframe').attr('src', LoginBox.address);
	    $('#blackout').show();
	    $('#login-box').show();
	  },
	  init: function(){
	    $(document).on("click", ".login-popup-link", null, LoginBox.showLoginBox);
	    $('#blackout').click( function(){ $(this).hide(); $('#login-box').hide(); } );
	    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
	    var eventer = window[eventMethod];
	    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

	    eventer(messageEvent,function(e) {
	      if (e.data === "loggedIn") {
	        location.reload(true);
          SSO.setup('account-edge.enmasse.com');
	      }
	    }, false);
	  }
	};


	var SSO = {
    logged_in: null,
    screenName: null,
    emp: null,
    errorMessage: '<span data-tooltip data-width class="has-tip error" title="Unable to retrieve EMP balance.">ERROR</span>',
    accountUrl: 'account.enmasse.com',

    binder: function(){
      $('#eme-logout').bind('click', function(e){
          e.preventDefault();
          SSO.logout();
      });
    },

    setup: function(accounturl){
      SimpleSSO.call();
        SSO.accountUrl = accounturl;
        if ($.cookie('screen_name') && $.cookie('screen_name') != "") {
          SSO.screenName = $.cookie('screen_name');
          SSO.emp = "<span class='loading'></span>";
          
        //  SSO.getEMP();
          $('#account').html( SSO.loggedInButtons );
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
          $('#account').html( SSO.loggedInButtons );
          SSO.binder();
        }).fail(function(){
          SSO.emp = SSO.errorMessage;
          $('#account').html( SSO.loggedInButtons );
          SSO.binder();
        });
      } else {
        SSO.emp =  $.cookie('emp');
      }
    },
    getScreenName: function(){ return SSO.screenName; },
    isLoggedIn: function(){ return !(SSO.screenName === null)},
    
    loggedInButtons: function(){
        userBar = '<ul class="user"><li class="welcome">' + SSO.screenName + ' <span class="acct-emp"> - EMP: ' + SSO.emp + '</span></li>';
        userBar += '<li><a href="https://' + SSO.accountUrl + '">Account Settings</a></li>';
        userBar += '<li><a href="#" id="eme-logout">Sign Out</a></li></ul>';

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

  var SimpleSSO = {
  
    /*var auth_subdomain(case_env) = {
      case "production":
        return "";
        break;
      case "qa":
        return "edge."
        break;
      default:
        return "edge."
        break;
    };*/

   /* auth_subdomain = "edge.",
    auth_service = "auth.service. " + auth_subdomain + "enmasse.com",
    auth_port = 4567,*/
    //var app;

    /*initialize: function(passed_app) {
      app = passed_app;
    };*/

    call: function(env) {
      var sessions_account_id = sessionStorage.getItem("account_id");
      
      if ((($.cookie("_ssot") && $.cookie("_ssot") != "") && !sessions_account_id)) {
          // connect the account -we have both
          connect_account();
      } else if (sessions_account_id && ($.cookie("_ssot").length < 0)) {
          // we only have account_id
          disconnect_account()
        }
            // we have neither

      // original code in this block
      /*req = Rack::Request.new(env)
      cookies = req.cookies
      session = req.session
      @eat_cookies = false
      @bake_cookies = false
      if cookies["_ssot"] && (!session["account_id"] || cookies["_ssot"] != session[:ssot])
        connect_account(cookies, session)
      elsif !cookies["_ssot"] && session["account_id"]
        @eat_cookies = true
        #disconnect_account(cookies, session)
      end
      #set_cookies(cookies, session) if @eat_cookies
      session.clear if @eat_cookies
      @status, @headers, @response = @app.call(env)
      set_cookies(cookies, session) if @eat_cookies || @bake_cookies
      return [@status, @headers, @response]*/
    },

    connect_account: function() {
      var auth_response = nil
      //$.post("/sso/ticket/" + $.cookie("_ssot") + "/verify", "tt=sso_insecure", function(data) {
        $.post("auth.service.edge.enmasse.com:4567/sso/ticket/" + $.cookie("_ssot") + "/verify", "tt=sso_insecure", function(data) {
        if(data) {
          var account_info = JSON.parse(data.body);
          sessionStorage.setItem("screen_name", account_info["temp_screen_name"] ? account_info["email"].split("@")[0] : account_info["screen_name"]);
          sessionStorage.setItem("account_id", account_info["id"]);
          sessionStorage.setItem("game_accounts", account_info["game_accounts"]);
          sessionStorage.setItem("account_info",  account_info);
          //session["screen_name"] = account_info["temp_screen_name"] ? account_info["email"].split("@")[0] : account_info["screen_name"];
              //session["account_id"] = account_info["id"];
              //session["game_accounts"] = account_info["game_accounts"];
              //session["account_info"] = account_info;
              $.cookie("screen_name", "1", {path: "/"});
        } else {
          $.cookie("_ssot", "1", {expires: Time.now-86400, path: "/", domain: "enmasse.com"});
        }
      });
    },

    disconnect_account: function(cookies, sesssion) {
      sessionStorage.removeItem("screen_name");
      sessionStorage.removeItem("account_id");
      $.cookie("screen_name", "1", {path: "/"});
      $.cookie("_ssot", "1", {expires: Time.now-86400, path: "/", domain: "enmasse.com"});
    }


  };
	
  LoginBox.init();
  SSO.setup("account-edge.enmasse.com");
  SimpleSSO.call();

});
