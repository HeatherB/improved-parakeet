// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require minimized/jquery-migrate-1.2.1.min.js
//= require_tree ./base
//= require_tree ./colorbox
//= require apps/mobileNav
//= require apps/shame


/* IE7 Warning */
/* Warning for <= IE7 users */
$(document).ready(function(){
  if ($.browser.msie && $.browser.version <= 7.0) {
    $('#global-alerts-wrapper #global-alerts').prepend('<div class="alert alert-error"><div class="message">We no longer support this browser. For the best experience, please upgrade your browser.</div></div>')
  }
})

/* Form Helpers */

function focusInput(obj) {
  obj.find("input.focus").first().focus();
}

function focusColorBoxInput(objStr) {
  setTimeout("focusInput($('" + objStr + "'))", 500);
  //setTimeout("$.colorbox.resize();", 500);
}

// submit link handler
function bindSubmitLinks() {

  $("form").keypress(function(event) {
    if (event.which == 13) {
      if ($(event.target).is('input')) {
        var btn = $(this).find(".pseudo-submit-link, .submit-link");
        if (btn.length > 0 && !btn.hasClass("disabled")) {
          btn.first().click();
          event.preventDefault();
        }
      }
    }
  });

  $(".submit-link").click(function(event) {
    if ($(this).hasClass("disabled")) return;
    var form = $("#" + $(this).attr("data-form"));
    var waitText = $(this).attr("data-wait-text") || "<span class='wait-text'>Submitting...</span>";
    if (form.length == 1) {
      $(this).html(waitText);
      $(".submit-link").addClass("disabled");
      form.submit();

      // disable the link
      $(".submit-link").unbind("click");
      $(".submit-link").bind("click", function(event) { event.preventDefault(); });
    }
    event.preventDefault();
  });
}

function handleLoginPopupLinkClick(event) {
  $.colorbox({
    width:"368px",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#login",
    onLoad: function(){ handleLoginPopupOpened(); }
  });
}

// The following methods are basically used to ensure
// only one login form is present on the page at any given time.
// This is to allow password programs (e.g. lastpass) to function properly.
function bufferLoginPopup() {
  // var inlineSignin = $("#login_options");
  // var popupSignin = $("#login");
  // if (inlineSignin.length > 0 && popupSignin.length > 0) {
  //   toggleVisibility(popupSignin, false);
  //   toggleVisibility(inlineSignin, true);
  // }
}

function handleLoginPopupOpened() {
/*  var inlineSignin = $("#login_options");
  var popupSignin = $("#login");
  if (inlineSignin.length > 0 && popupSignin.length > 0) {
    toggleVisibility(inlineSignin, false);
    toggleVisibility(popupSignin, true);
  }
  setTimeout("focusInput($('#login'))", 500);
  */
}

function handleLoginPopupClosed() {
/*  var inlineSignin = $("#login_options");
  var popupSignin = $("#login");
  if (inlineSignin.length > 0 && popupSignin.length > 0) {
    toggleVisibility(popupSignin, false);
    toggleVisibility(inlineSignin, true);
  }
  if (inlineSignin.css("left") == "0px") {
    setTimeout("focusInput($('#login_options'))", 500);
  }
  */
}

function toggleVisibility(obj, visible) {
  if (visible) {
    obj.show();
    obj.css("visibility", "visible");
  } else {
    obj.hide();
    obj.css("visibility", "hidden");
  }
}
// END password workaround


function addErrorsClass(obj) {
  obj.addClass("with_errors");
   handleHintableFocus();

  if(obj.is('input')) {
    obj.closest(".iparent").addClass("with_errors");
  }

  if (obj.hasClass("easy-select-box-disp")) {
    $("#secret_question_chk").removeClass("valid");
    $("#secret_question_chk").addClass("with_errors");
  } else {
    var chk = obj.closest(".iparent").next(".check");
    chk.removeClass("valid");
    chk.addClass("with_errors");
  }
}

function removeErrorsClass(obj) {
  obj.removeClass("with_errors");
  handleHintableBlur();

  if(obj.is('input')) {
    obj.closest(".iparent").removeClass("with_errors");
  }

  if (obj.hasClass("easy-select-box-disp")) {
    $("#secret_question_chk").removeClass("with_errors");
    $("#secret_question_chk").addClass("valid");
  } else {
    var chk = obj.parents(".iparent").next(".check");
    chk.removeClass("with_errors");
    if (obj.val().length > 0) {
      chk.addClass("valid");
    }
    
  }
}

function toggleButtonEnabled(btn, hasErrors, previewClass) {
  if (!hasErrors) {
    btn.removeClass("disabled");
    btn.removeClass(previewClass);
  } else {
    btn.addClass("disabled");
    btn.addClass(previewClass);
  }
}

/* /Form Helpers */

// Game codes form (it is shown on multiple "apps")
function handleGameCodeSubmit(event) {
  var btn = $(this);
  var frm = $("#" + btn.attr('data-form'));
  var url = frm.attr('action');
  var waitText = $(this).attr("data-wait-text") || "Submitting...";

  if (frm.length == 1) {
    $(this).html(waitText);

    // disable the link
    $(".game-code-submit").unbind("click");
    $(".game-code-submit").bind("click", function(event) { event.preventDefault(); });
  }

  /* Send the data using post and put the results in a div */
  $.post( url, frm.serialize(),
    function( data ) {
      frm.closest(".code-target").html(data);
      $.colorbox.resize();
      CodeSubmitted = true;
      setupGlobalEvents();
    }
  );

  event.preventDefault();
}

function enterCodePopupCallback(link) {
  var gid = link.attr("data-gid");
  $("#code-form-container").show();
  $("#code-form-container #info-box").hide();

  var codeInput = $("#code-form-container #game_code");
  var regex = /teraid=([^&'"\ ]+)?/i;
  codeInput.val("");
  removeErrorsClass(codeInput);

  if (gid != null) {
    $("#subscription-upgrade-info").show();
    $("#pref_account").val(gid);
    $(".teraID-link").each(function(ix, obj) {
      obj.href = obj.href.replace(regex, "teraID=" + gid);
    });
  } else {
    $("#subscription-upgrade-info").hide();
    $("#pref_account").val("");
    $(".teraID-link").each(function(ix, obj) {
      obj.href = obj.href.replace(regex, "teraID=");
    });
  }

  $("#code-success-container").hide();
  focusColorBoxInput("#enter-code");
}

var CodeSubmitted = false;
function handleCodePopupClosed() {
  if (CodeSubmitted) {
    window.location.reload();
  }
}

function bindGameCodeFormHandlers() {
  $(".enter-code-btn").colorbox({
    /*maxWidth:"780px",
    maxHeight:"300px",
    width:"100%",
    height:"100%",*/
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#enter-code-container",
    onLoad: function() { enterCodePopupCallback($(this)); },
    onClosed: function(){ handleCodePopupClosed(); }
  });
  $(".game-code-submit").unbind("click", handleGameCodeSubmit);
  $(".game-code-submit").bind("click", handleGameCodeSubmit);
}


//function displayLanguageSelector(event) {
//  showBlackout(function() {
//    hideBlackout();
//    $("#language-select-open").hide();
//    $("#language-select-close").show();
//  });
//
//  $("#language-select-close").hide();
//  $("#language-select-open").show();
//  event.preventDefault();
//}

//function submitLanguageSelection(event) {
//  var open = $("#language-select-open"),
//      closed = $("#language-select-close");
//  var path = $(this).parent("ul").attr("data-url");
//
//  open.hide();
//  closed.show();
//  closed.html("&nbsp;&nbsp;" + $(this).attr("data-loading") + "...");
//
//  $.post(path, { "authenticity_token": window._token, "language_code": $(this).attr("data-language") },
//     function(data) {
//       window.location.reload();
//     });
//
//  event.preventDefault();
//}

//function bindLanguageSelectHandlers() {
//  $(".language-menu-link").click(displayLanguageSelector);
//  $(".change-language-link").click(submitLanguageSelection);
//}

function handleComingSoonMouseOver(event) {
  this.innerHTML = "Coming Soon"
}

function handleComingSoonMouseOut(event) {
  this.innerHTML = $(this).attr('data-text');
}

function bindComingSoonLinks() {
  $('a.coming-soon').each(function(ix, obj){
    $(obj).attr('data-text', obj.innerHTML);
    $(obj).attr('href', "javascript:void(0);");
    $(obj).unbind('mouseover', handleComingSoonMouseOver);
    $(obj).bind('mouseover', handleComingSoonMouseOver);
    $(obj).unbind('mouseout', handleComingSoonMouseOut);
    $(obj).bind('mouseout', handleComingSoonMouseOut);
  });
}

// function setup global events
function setupGlobalEvents() {
  $(".login-form").submit(function() { copyBlackBox("#"+$(this).attr("id"), "#"+$(this).attr("id")+" #"+$(this).attr("data-io-bb"), 0); });
  bindGameCodeFormHandlers();
  //bindLanguageSelectHandlers();
  bindSubmitLinks();
  bindComingSoonLinks();
}

// iovation form helper
function copyBlackBox( form_id, io_bb_id, pass )
{
  var bb = $("#blackbox");

  if ( typeof( bb ) == 'undefined' )
  return true;

  if (inLauncher()) {
    $(io_bb_id).val(parent.copyCub.getString(0));
  } else {
    /* wait for blackbox, up to 3 seconds */
    if ( bb.val() == '' && pass < 6)
    {
      setTimeout( "copyBlackBox('" + form_id + "','" + io_bb_id + "'," + (pass + 1) + ");", 500 );
      return false;
    } else {
      if ( bb.val() != '' ) {
        $(io_bb_id).val(bb.val());
      }
    }
  }
}

function inLauncher() {
  // return true; // -cr- test
  return typeof parent.copyCub != "undefined";
}

/* Blackout */
   // translation dropdown not working do not render it  -cr-
//function showBlackout(callback) {
//  var bout = $("#blackout");
//  bout.bind("click", callback);
//  bout.show();
//}
//
//function hideBlackout() {
//  var bout = $("#blackout");
//  bout.unbind("click");
//  bout.hide();
//}
/* /Blackout */

/* Facebook */
function postToLauncher(message) {
  // TODO: Whitelist expected domain
  parent.postMessage(message, "*");
}

// example response:
//  response = {
//    "data": [
//    {
//      "permission": "installed",
//      "status": "granted"
//    }, {
//      "permission": "public_profile",
//      "status": "granted"
//    }, {
//      "permission": "email",
//      "status": "granted"
//    }, {
//      "permission": "user_birthday",
//      "status": "granted"
//    }, {
//      "permission": "user_friends",
//      "status": "granted"
//    }]
//  }
function check_permission_granted(response, permission_name) {
  for (var i = 0; i < response.data.length; i++) {
    var data = response.data[i];

    if (data.permission == permission_name && data.status == "granted") {
      return true;
    }
  }
  return false;
}

// check if the given permissions are granted by checking response data
function check_permissions_granted(response, permission_name_list) {
  for (var i = 0; i < permission_name_list.length; i++) {
    var permission_name = permission_name_list[i];

    if (check_permission_granted(response, permission_name) == false)
      return false;
  }
  return true;
}

var facebookLoginRedir = null; // used for custom redirects on login pages
function handleFacebookLogin(inLauncher) {
  // confirm that the user gave us the permissions we need
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      console.log(facebookLoginRedir)

      FB.api('/me/permissions', function (response) {
        if (response.data) {
          if (check_permissions_granted(response, ["email"])) {
            var blackbox = $("#blackbox").val();

            // check if there are checkboxes for subscribing newsletters. these checkboxes are shown if the page is connected from CA region.
            //  checkboxes whose id are "receive_news_<number>" are those for subscribing newsletters
            // if there is no checkbox, then do automatic subscribing newsletters
            // if there is any checkbox, then do manual subscribing newsletters
            var newsletter_ids = [];
            var auto_subscribe_newsletters;
            // retrieve all the checkboxes whose id are "receive_news_<number>"
            var receive_news_checkbox_list = $(":checkbox").filter(function() { return this.id.match(/^receive_news_\d+$/) });
            if (receive_news_checkbox_list.length == 0) {
              // do automatic subscribing
              auto_subscribe_newsletters = true;
            } else {
              // do manual subscribing
              auto_subscribe_newsletters = false;
              for (var i = 0; i < receive_news_checkbox_list.length; i++) {
                var receive_news_checkbox = receive_news_checkbox_list[i];
                if ($('#' + receive_news_checkbox.id).prop("checked") == true) {
                  newsletter_id = receive_news_checkbox.id.match(/^receive_news_(\d+)$/)[1];
                  if (!!newsletter_id) {
                    newsletter_ids.push(newsletter_id);
                  }
                }
              }
            }

            if (blackbox) {
              var data = {
                blackbox: blackbox,
                in_launcher: inLauncher,
                redir: facebookLoginRedir,
                newsletter_ids: newsletter_ids,
                auto_subscribe_newsletters: auto_subscribe_newsletters,
                campaign: {
                  game: $("#signup_campaign_game").val(),
                  campaign: $("#signup_campaign_campaign").val(),
                  revision: $("#signup_campaign_revision").val()
                }
              };

              if (inLauncher) {
                if ($("#game_id").length > 0) {
                  var gameId = $("#game_id").val();
                  data['game_id'] = gameId;
                }
                if (parent.steamUserId) {
                  data['in_steam'] = true;
                }
              } else {
                // find game name from the current url
                // example of the urls:
                //  https://account.enmasse.com/tera/sign-up
                //  https://account.enmasse.com/zmr/sign-up
                matches = /\/(\w+)\/sign-up/.exec(window.location);
                if (matches != null) {
                  data['game_name'] = matches[1];
                }
              }

              var jqxhr = $.ajax({
                method: "GET",
                url: "/auth/facebook/callback",
                data: data
              }).done(function(data) {
                if (data.success) {
                  if(typeof _gaq !== 'undefined'){
                    if (data.new_user) {
                      _gaq.push(['_trackEvent', 'Accounts', 'Complete Facebook Connect Process', 'signup']);
                    } else if (data.initial_authorization) {
                      _gaq.push(['_trackEvent', 'Accounts', 'Complete Facebook Connect Process', 'existing account']);
                    } else {
                      _gaq.push(['_trackEvent', 'Accounts', 'Complete Facebook Connect Process', 'login']);
                    }
                  }
                  
                  if (inLauncher && data.encrypted_token) {
                    postToLauncher("fbToken:" + data.encrypted_token);
                  }
                  var inUniversalLauncher = sessionStorage.getItem('inUniversalLauncher');
                  if(inUniversalLauncher && data.encrypted_token) {
                    parent.postMessage("fbToken:" + data.encrypted_token);
                  }
                }

                window.location.href = data.redir;
              });
            } else {
              window.location.reload();
            }
          // Special message if email is denied
          // Must remove app from user so they can try again.
          } else if (!check_permission_granted(response, "email")) {
            alert('Email is required for account creation. Please try again.')
            FB.api('/me/permissions', 'DELETE');
          } else {
            alert("ERROR: Fail to retrieve appropriate permissions from Facebook");
            FB.api('/me/permissions', 'DELETE');
          }
        }
      });
    }
  }, true);
}
/* /Facebook */

/* Bootstrap */
$(function() {
  $(document).on("click", ".login-popup-link", null, handleLoginPopupLinkClick);
  bufferLoginPopup();
  $('body').addClass('has-js');
  setupGlobalEvents();
  focusInput($(document));
});


// Pixel tracking
$(function() {
  $('a.pixel-track').bind('mousedown', function(e){
    e.preventDefault();
    mmConversionTag(536130, this, '_self', 'http://store.steampowered.com/app/306830/');
  })

  $('a.pixel-track').bind('click', function(e){
    e.preventDefault();
    href = $(this).attr('href');
    
    setTimeout(function(){
      window.location = href;
    }, 300);
  })
}) 
