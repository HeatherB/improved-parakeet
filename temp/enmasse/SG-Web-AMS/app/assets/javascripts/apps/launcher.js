var MessageNumber = 1;
var KeepaliveInterval = 1000 * 60 * 15;

// set the following variables in _js_configs.erb
// so this file can be game agnostic
var SLS_URL = "";
var CURRENT_LANGUAGE = "";
var CUSTOMER_SUPPORT_URL = "";
var GAME_EXE = "";
var GAME_ID = 0;
var ACCOUNT_NAME = "";
var ACCOUNT_EMAIL = "";
var LAUNCHER_EXIT_MSGS = {};
var GACCT_ACCESS_TYPE = 0;
var ACCOUNT_ID = 0;
var GACCT_ID = 0;
var GACCT_IS_TRIAL = false;
var DISPLAY_INFO_TITLE = "";
var DISPLAY_INFO_BODY = "";
var GAME_SETTINGS_TABLE = {};
var FB_TOKEN = "";
var ELITE_STATUS = false;

var loginEventsTriggered = false;

function testInterface() {
  alert("Message Received by AMS Hosted IFrame!");
}

function serverPing() {
  $.ajax({
    url: "/launcher/" + GAME_ID + "/keepalive",
    success: function (data) {
      setTimeout(serverPing, KeepaliveInterval);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      setTimeout(serverPing, KeepaliveInterval);
    }
  });
}

var LockPlayButton = false;
function gameLaunch(releaseName, launcherVersion) {
  if (LockPlayButton) return;

  LockPlayButton = true;

  switch (GACCT_ACCESS_TYPE) {
    case 0: // full access
      launchGameExe(releaseName, launcherVersion);
      LockPlayButton = false;
      break;

    case 1: // limited play times
      // make ajax call to server to confirm user can play now
      if (canPlay()) {
        launchGameExe(releaseName, launcherVersion);
      } else {
        endPopup(0x8000, 0x0002);
      }
      LockPlayButton = false;

      break;

    default: // download only
      // show error message
      endPopup(0x8000, 0x0001);
      LockPlayButton = false;
  }
}

function launchGameExe(releaseName, launcherVersion) {
  triggerLoginEvents();

  if (!releaseName)
    releaseName = "";

  if (!launcherVersion)
    launcherVersion = "";

  var commandline_options = "";
  var has_error = false;
  $.ajax({
    async: false,
    type: "GET",
    url: "/launcher/" + GAME_ID + "/get_commandline_options/?release_name=" + releaseName + "&launcher_version=" + launcherVersion,
    dataType: "json",
    success: function(data) {
      if (data.error) {
        // if there is an error, for example, account is banned, alert it and deny to run the game
        console.log("error: launchGameExe: " + JSON.stringify(data));
        alert(data.error);
        has_error = true;
      }
      else {
        console.log("success: launchGameExe: " + JSON.stringify(data));
        commandline_options = data.options;
      }
    },
    error: function(jqHXR, textStatus, errorThrown) {
      has_error = true;
      alert("Error: launchGameExe: " + errorThrown);
    }
  });

  if (has_error == false) {
    if (commandline_options) {
      parent.copyCub.launchGame(GAME_EXE + " " + commandline_options);
    }
    else {
      parent.copyCub.launchGame(GAME_EXE);
    }
    MessageNumber++;
  }
}

function canPlay() {
  var res = false;

  $.ajax({
    async: false,
    url: "/launcher/" + GAME_ID + "/account_can_play",
    success: function (data) {
      res = (data == "1");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      res = false;
    }
  });
  return res;
}

function triggerLoginEvents() {
  if (loginEventsTriggered == false) {
    loginEventsTriggered = true;
    var jqxhr = $.ajax({
      method: "GET",
      url: "/launcher/" + GAME_ID + "/login_events"
    }).done(function (data) {
      if (data.track_args) {
        for (var i = 0; i < data.track_args.length; i++) {
          var track_arg = data.track_args[i];

          _gaq.push(['_trackEvent', track_arg.category, track_arg.action, track_arg.label, track_arg.value]);
        }
      }
    });
  }
}

function hasGameAccount(i) {
  i = i || 0;
  if (i < 12) {
    // make call to get game account information
    $.ajax({
      url: "/launcher/" + GAME_ID + "/has_game_account",
      dataType: 'json',
      type: 'get'
    }).done( function( data ) {
      // if there is a game account, reload page
      if (data['has_game_account']) {
        window.location.reload();
      }
    });

    setTimeout( function() {
      // check every 5 seconds if the user has a game account
      hasGameAccount(++i);
    }, 5000);
  } else {
    // after 12 checks for a game account, hide the standby message
    //   and show a refresh button instead
    $("#standbyMsg").hide();
    $("#refreshBtn").show();
  }
}

function gameSendMessage() {
  parent.copyCub.sendMessage("Some data: " + MessageNumber);
  MessageNumber++;
}

// This returns the location of SLS specific to the selected game and
// the current user's language
function getSLSURL() {
  return SLS_URL;
}

function getAuthTicket() {
  var out = "";

  $.ajax({
    async: false,
    url: "/launcher/" + GAME_ID + "/auth_ticket",
    success: function (data) {
      out = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      out = jqHXR.responseText;
    }
  });

  return out;
}

function makeSSOUrl(popupUrl, optionalData) {
  // parse optional flags in popupUrl
  var splitted_popupUrl = popupUrl.split("|");
  popupUrl = splitted_popupUrl[0];
  var optional_flags = splitted_popupUrl.slice(1);

  var enable_sso = true;
  var enable_system_browser = false;
  var result_url = null;

  for (var i = 0; i < optional_flags.length; i++) {
    var optional_flag = optional_flags[i];
    if (optional_flag == "sso") {
      enable_sso = true;
    }
    if (optional_flag == "not_sso") {
      enable_sso = false;
    }
    if (optional_flag == "system_browser") {
      enable_system_browser = true;
    }
    if (optional_flag == "not_system_browser" || optional_flag == "ingame_browser") {
      enable_system_browser = false;
    }
  }

  if (enable_sso) {
    var ticket = "";
    $.ajax({
      type: "POST",
      async: false,
      data: optionalData,
      dataType: 'json',
      url: "/launcher/" + GAME_ID + "/sso_auth_ticket",
      success: function (data) {
        ticket = data.ticket;
      }
    });
      result_url = location.protocol + "//" + location.host + "/launcher/auth_forward_url?next=" + encodeURIComponent(popupUrl) + "&ticket=" + ticket;
    }
  else {
    result_url = popupUrl;
  }

  return {url: result_url, enable_system_browser: enable_system_browser};
}



function showNewWindowPopup(caseCode) {
  var steamEnabled = false;
  var optionalData = {};
  if (parent.steamUserId === undefined || parent.steamUserId === null) {
    steamEnabled = false;
  }
  else {
    steamEnabled = true;
    optionalData = {steam_user_id: parent.steamUserId, steam_user_persona_name: parent.steamUserPersonaName};
  }

  var popupUrl = null;
  if (steamEnabled) {
    popupUrl = GAME_SETTINGS_TABLE['steam_url_' + caseCode.toString()] || null;
    if (popupUrl == null) {
      steamEnabled = false;
      popupUrl = GAME_SETTINGS_TABLE['url_' + caseCode.toString()] || null;
    }
  }
  else {
    popupUrl = GAME_SETTINGS_TABLE['url_' + caseCode.toString()] || null;
  }

  if (popupUrl != null) {
    var result = makeSSOUrl(popupUrl, optionalData);
    if (steamEnabled) {
      parent.navigateSteamBrowser(result.url);
    }
    else {
      parent.navigateDefaultBrowser(result.url);
    }
  }
}

function getWebLinkUrl(caseCode, serverId, characterId) {
  var steamEnabled = false;
  var optionalData = {};
  if (parent.steamUserId === undefined || parent.steamUserId === null) {
    optionalData = {server_id: serverId, character_id: characterId};
    steamEnabled = false;
  }
  else {
    steamEnabled = true;
    optionalData = {server_id: serverId, character_id: characterId, steam_user_id: parent.steamUserId,
                    steam_user_persona_name: parent.steamUserPersonaName};
  }

  var popupUrl = null;
  if (steamEnabled) {
    popupUrl = GAME_SETTINGS_TABLE['steam_url_' + caseCode.toString()] || null;
    if (popupUrl == null) {
      steamEnabled = false;
      popupUrl = GAME_SETTINGS_TABLE['url_' + caseCode.toString()] || null;
    }
  }
  else {
    popupUrl = GAME_SETTINGS_TABLE['url_' + caseCode.toString()] || null;
  }

  if (popupUrl != null) {
    var result = makeSSOUrl(popupUrl, optionalData);

    if (result.enable_system_browser) {
      parent.navigateDefaultBrowser(result.url);
      return null;
    }
    else {
      if (steamEnabled) {
        parent.navigateSteamBrowser(result.url);
        return null;
      }
      else {
        return result.url + "|dummy_key=dummy_value;"; // dummy cookie pair is needed for avoiding corrupted data in request's cookies
      }
    }
  }
  return null;
}

function endPopup(endType1, endType2) {
  var str_e1 = new Number(endType1).toString(16);
  var str_e2 = new Number(endType2).toString(16);
  var str_e2_opt = new Number(endType2 & 0x7fff).toString(16);

  str_e1 = rPadString(str_e1, 4, "0");
  str_e2 = rPadString(str_e2, 4, "0");
  str_e2_opt = rPadString(str_e2_opt, 4, "0");

  reportLauncherErrorToGA(str_e1, str_e2);

  var msg = getErrorMsgFromTypes(str_e1, str_e2, str_e2_opt);
  if (msg != null) {
    var err_data = {
      'user_id': ACCOUNT_ID,
      'game_account_id': GACCT_ID,
      'error': str_e1 + ':' + str_e2
    };
    reportLauncherError(err_data);

    if (GACCT_IS_TRIAL && str_e1 == "0104") { // 0104: Billed time exhausted
      parent.displayInfo(DISPLAY_INFO_TITLE, DISPLAY_INFO_BODY);
    } else {
      var title = "Error: " + str_e1 + ":" + str_e2;
      parent.displayError(title, msg);
    }
  } else if (GACCT_IS_TRIAL) {
    parent.displayInfo(DISPLAY_INFO_TITLE, DISPLAY_INFO_BODY);
  }
  parent.gameClose(); // notify launcher that the game is closed
}

function reportGameEventToGA(value) {
  _gaq.push(['_trackPageview', '/game_event/' + value.toString()]);
}

function reportLauncherErrorToGA(str_e1, str_e2) {
  _gaq.push(['_trackEvent', 'endPopup', str_e1, str_e2]);
}

function reportLauncherError(data) {
  $.ajax({
    url: '/launcher/report_error',
    data: data,
    type: "POST",
    success: function (data) {
    },
    error: function (jqXHR, textStatus, errorThrown) {
    }
  });
}

function getErrorMsgFromTypes(str_e1, str_e2, str_e2_opt) {
  return LAUNCHER_EXIT_MSGS[str_e1 + "_" + str_e2] || LAUNCHER_EXIT_MSGS[str_e1 + "_" + str_e2_opt] || LAUNCHER_EXIT_MSGS[str_e1] || null;
}

function rPadString(str, len, chr) {
  var pad = [];
  while (pad.length + str.length < len) {
    pad[pad.length] = chr;
  }
  return pad.join('') + str;
}

function csPopup() {
  parent.navigateDefaultBrowser(CUSTOMER_SUPPORT_URL);
}

function handleNewWindowLinkClick(event) {
  var link = $(this);
  var tgt = link.attr("target");

  if (tgt == "blank" || tgt == "_blank") {
    parent.navigateDefaultBrowser(link.attr("href"));
    event.preventDefault();
  }
}

function handleSwitchUserLinkClick(event) {
  event.preventDefault();

  // send a blank token to clear the saved token
  FB_TOKEN = "";
  postToLauncher("fbToken:");
  location.reload();
}

function getAccountServerInfo(attach_auth_ticket) {
  var out = "";

  $.ajax({
    async: false,
    url: "/launcher/" + GAME_ID + "/account_server_info",
    data: "attach_auth_ticket=" + (attach_auth_ticket ? 1 : 0),
    success: function (data) {
      out = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      out = jqXHR.responseText;
    }
  });

  return out;
}

function reportSpecLog(spec) {
  var data = {
    'user_id': ACCOUNT_ID,
    'game_account_id': GACCT_ID,
    'game_id': GAME_ID,
    'spec': spec
  };

  $.ajax({
    url: '/launcher/report_spec_log',
    data: data,
    type: "POST",
    success: function (data) {},
    error: function (jqXHR, textStatus, errorThrown) {}
  });
}

// the following methods all more or less have to make the same call to server info
// as such, we call getAccountServerInfo and strip out what we don't need.
// Also, because I'm not sure the frequency or order these are called in, the response
// from getAccountServerInfo is cached (server side) for 1 minute so we don't have
// to make repeated requests to the game web services.
// TODO : discuss w/ BHS why these are even needed
function getGameString() {
  return getAccountServerInfo(true);
}

function getLastConnectedServerId() {
  var out = $.parseJSON(getAccountServerInfo(false));
  delete out.user_permission;
  delete out.chars_per_server;
  return JSON.stringify(out);

}

function getListOfCharacterCount() {
  var out = $.parseJSON(getAccountServerInfo(false));
  delete out.user_permission;
  delete out.last_connected_server_id;
  return JSON.stringify(out);
}

function receiveMessage(event) {
  if (event.origin.match(/http:\/\/127.0.0.1/)) {
    var split_message = event.data.split(":");
    if (split_message[0].trim() == "fbToken") {
      FB_TOKEN = split_message[1].trim();
      if (FB_TOKEN.length) {
        var jqxhr = $.ajax({
          method: "GET",
          url: "/auth/facebook/picture",
          data: { encrypted_token: FB_TOKEN }
        }).done(function(data) {
          if (data.picture) {
            $(".launcher-facebook-link").before("<div class='facebook-picture'><img src='" + data.picture + "' /></div>");
            $(".launcher-facebook-link").after("<br><a href='#' class='switch-user-link'>Log out of Facebook</a>");
          } else {
            postToLauncher("fbToken:");
            FB_TOKEN = "";
          }
        });
      }
    }
  }
}

// BOOTSTRAP
$(function () {
  $(document).on("click", "a", null, handleNewWindowLinkClick);
  $(document).on("click", ".switch-user-link", null, handleSwitchUserLinkClick);
  $("#user_email").focus();

  window.addEventListener("message", receiveMessage);

  postToLauncher("loginReady");
});
