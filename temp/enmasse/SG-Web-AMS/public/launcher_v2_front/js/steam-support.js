// steamSupport is in the global namespace
//var steamSupport = null;

function SteamSupport(instanceId) {
    this.instanceId = instanceId;
}

// This function should probably never be called since
// the SteamSupport function has the same lifespan as the app.
SteamSupport.prototype.release = function () {
    interop.releaseInstance(this.instanceId);
};

SteamSupport.prototype.get_subprocesses = function() {
  var methodBinding = {
    "method": "get_subprocesses"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error == "NOT_FOUND") {
    return {};
  }

  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.get_subprocess = function(name) {
  var methodBinding = {
    "method": "get_subprocess",
    "name": name
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    if (response.error == "NOT_FOUND")
      return null
    else
      console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.get_injection_enabled = function() {
  var methodBinding = {
    "method": "get_injection_enabled"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.set_injection_enabled = function(enable) {
  var methodBinding = {
    "method": "set_injection_enabled",
    "enable": enable
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_is_api_loaded = function() {
  var methodBinding = {
    "method": "steam_is_api_loaded"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_load_api = function(dll_path) {
  var methodBinding = {
    "method": "steam_load_api",
    "dll_path": dll_path
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_unload_api = function() {
  var methodBinding = {
    "method": "steam_unload_api"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_is_running = function() {
  var methodBinding = {
    "method": "steam_is_running"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_init = function() {
  var methodBinding = {
    "method": "steam_init"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_shutdown = function() {
  var methodBinding = {
    "method": "steam_shutdown"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_get_user_id = function() {
  var methodBinding = {
    "method": "steam_get_user_id"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_get_app_id = function() {
  var methodBinding = {
    "method": "steam_get_app_id"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_get_user_persona_name = function() {
  var methodBinding = {
    "method": "steam_get_user_persona_name"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_get_auth_session_ticket = function() {
  var methodBinding = {
    "method": "steam_get_auth_session_ticket"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }

  if (response.return_value == "true") {
    return {ticket: response.ticket, ticket_handle: response.ticket_handle};
  }
  else {
    return {ticket: null, ticket_handle: null};
  }
};

SteamSupport.prototype.steam_cancel_auth_session_ticket = function(ticket_handle) {
  var methodBinding = {
    "method": "steam_cancel_auth_session_ticket",
    "ticket_handle": ticket_handle
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_is_overlay_enabled = function() {
  var methodBinding = {
    "method": "steam_is_overlay_enabled"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_activate_game_overlay = function(dialog) {
  var methodBinding = {
    "method": "steam_activate_game_overlay",
    "dialog": dialog
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_activate_game_overlay_to_web_page = function(url) {
  var methodBinding = {
    "method": "steam_activate_game_overlay_to_web_page",
    "url": url
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_activate_game_overlay_to_store = function(app_id) {
  var methodBinding = {
    "method": "steam_activate_game_overlay_to_store",
    "app_id": app_id
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.steam_is_dlc_installed = function(dlc_id) {
  var methodBinding = {
    "method": "steam_is_dlc_installed",
    "dlc_id": dlc_id
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
}

SteamSupport.prototype.steam_get_dlc_count = function() {
  var methodBinding = {
    "method": "steam_get_dlc_count"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
}

SteamSupport.prototype.steam_get_dlc_data = function(index) {
  var methodBinding = {
    "method": "steam_get_dlc_data",
    "index": index
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
}

SteamSupport.prototype.steam_install_dlc_installed_callback = function(host_method) {
  var methodBinding = {
    "method": "steam_install_dlc_installed_callback",
    "host": {
      "method": host_method,
      "typename": "SteamSupport"
    }
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
}

SteamSupport.prototype.steam_uninstall_dlc_installed_callback = function() {
  var methodBinding = {
    "method": "steam_uninstall_dlc_installed_callback"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
}

SteamSupport.prototype.steam_run_callbacks = function() {
  var methodBinding = {
    "method": "steam_run_callbacks"
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
}

SteamSupport.prototype.remote_steam_is_api_loaded = function(remote_name, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_is_api_loaded"
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_load_api = function(remote_name, dll_path, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_load_api",
      "dll_path": dll_path
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_unload_api = function(remote_name, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_unload_api"
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_is_running = function(remote_name, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_is_running"
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_init = function(remote_name, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_init"
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_shutdown = function(remote_name, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_shutdown"
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_get_user_id = function(remote_name, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_get_user_id"
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_is_overlay_enabled = function(remote_name, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_is_overlay_enabled"
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_activate_game_overlay = function(remote_name, dialog, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_activate_game_overlay",
      "dialog": dialog
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_activate_game_overlay_to_web_page = function(remote_name, url, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_activate_game_overlay_to_web_page",
      "url": url
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_steam_activate_game_overlay_to_store = function(remote_name, app_id, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "steam_activate_game_overlay_to_store",
      "app_id": app_id
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
};

SteamSupport.prototype.remote_register_callback = function(remote_name, event_name, host_method, timeout) {
  timeout = typeof timeout !== 'undefined' ? timeout: 0.0;
  var methodBinding = {
    "method": "remote_call",
    "remote": {
      "remote_name": remote_name,
      "method": "register_callback",
      "event_name": event_name,
      "remote": {
        "remote_name": "main",
        "method": "call_host_method",
        "host": {
          "method": host_method,
          "typename": "SteamSupport"
        }
      },
      "timeout": timeout
    },
    "timeout": timeout
  };
  response = interop.parseJSON(NativeInterop.invoke(this.instanceId, JSON.stringify(methodBinding)));
  if (response.error) {
    if (response.error == "NOT_FOUND")
      return "false";
    else
      console.error("{0}: {1}".format(response.error, response.error_message));
  }
  return response.return_value;
}