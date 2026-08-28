//= require minimized/easyselectbox.min.js
//= require minimized/jquery.placeholder.min.js
//= require minimized/jquery.pstrength-min.js

function handleHintableFocus(event) {
  showHint($(this));
}
function handleHintableBlur(event) {
  $("#hint").remove();
}

function handleEasySelectFocus(event) {
  var obj = $(this).hasClass(".easy-select-box") ? $(this) : $(this).parent(".easy-select-box");
  obj = obj.prev("select.easy-select");
  showHint(obj);
}

function handleEasySelectKeyDown(event) {
  var sel = $("#user_secret_question_id")[0];

  switch(event.which) {
    case 38: // up arrow
      handleEasySelectArrowSelect(event, sel, "up");
      break;
    case 40: // down arrow
      handleEasySelectArrowSelect(event, sel, "down");
      break;
    case 9:  // tab
      $(".easy-select-box ul").hide();
      break;
    case 27: // esc
      $(".easy-select-box ul").hide();
      break;
    default:
      return;
  }
}

function handleEasySelectOptionHover(event) {
  var ul = $(".easy-select-box ul");
  var link = $(this);
  var li = link.parent("li");

  if (!li.hasClass("selected")) {
    ul.find("li").each(function() { $(this).removeClass("selected"); });
    li.addClass("selected");
  }
}

function handleEasySelectArrowSelect(event, sel, dir) {
  var position = sel.selectedIndex;
  var ul = $(".easy-select-box ul");

  if (ul.css("display") == "none") {
    ul.show();
    dir = "none";
  }

  if (dir == "up") {
    position = Math.max(0, position-1);
  } else if (dir == "down") {
    position = Math.min(position+1, sel.options.length-1);
  } else {
    position = sel.selectedIndex;
  }
  sel.selectedIndex = position;

  ul.find("li").each(function() { $(this).removeClass("selected"); });
  var li = ul.find("li:nth-child(" + (position+1) + ")");
  li.addClass("selected");
  $(".easy-select-box-disp").html(sel.options[position].text);

  event.preventDefault();
  event.stopPropagation();
}

function handleDisabledButtonClick(event) {
  if ($(this).hasClass("disabled")) {
    event.preventDefault();
    event.stopPropagation();
  }
}

function showHint(obj) {
  if (obj.length <= 0) return;

  $("#hint").remove();

  $("div.row").removeClass("selected");
  currentRow = obj.closest("div.row")
  currentRow.addClass("selected");

  currentInput = obj.closest("div.input")
  currentInput.append('<div id="hint" class="' + obj.attr("id") + '"></div>');

  var hint = $("#hint")
  hint.html("");

  var hintContainer = $("#" + obj.attr("id") + "-hint");
  if (obj.hasClass("with_errors")) {
    hint.addClass("warning");
    var warningHint = $("#" + obj.attr("id") + "-warning");
    if (warningHint.length > 0) hintContainer = warningHint;
  } else {
    obj.attr("allow-blur", null);
  }

  if (hintContainer.length > 0) {
    hint.html(hintContainer.html());
    hint.append('<span id="arrow"></span>')
  }
}

function showInputError(obj) {
  addErrorsClass(obj);
  if (obj.attr("allow-blur") == null) {
    obj.attr("allow-blur", true);
    // setTimeout("$('#" + obj.attr("id") + "').focus()", 1);
  }
}

function setupLabel() {
  // if ($('.label_check input').length) {
  //   $('.label_check').each(function(){
  //       $(this).removeClass('c_on');
  //   });
  //   $('.label_check input:checked').each(function(){
  //       $(this).parent('label').addClass('c_on');
  //   });
  // };
  if ($('.label_radio input').length) {
    $('.label_radio').each(function(){
        $(this).removeClass('r_on');
    });
    $('.label_radio input:checked').each(function(){
        $(this).parent('label').addClass('r_on');
    });
  };
};

function trimInputValue(input) {
  var curr = input.val();
  if (curr.match(/^[ \t]+|[ \t]+$/)) {
    input.val($.trim(input.val()));
  }
}

var emailCheckCached = "";
var emailCheckCachedValid = false;
function validateEmail(event) {
  var obj = $(this);
  trimInputValue(obj);

  var email = obj.val();

  if (email.toLowerCase() != emailCheckCached.toLowerCase()) removeErrorsClass(obj);

  if (email.length > 0) {
    if (email.toLowerCase() != emailCheckCached.toLowerCase()) {
      emailCheckCached = email;

      // basic validation passed, now make a call to server so we don't have to duplicate the logic here
      $.get("/users/ajax_check_field", { "field_name":"email", "email":escape(email.toLowerCase()) },
        function(data) {
          $("#user_email-warning p.server-error").html(data);
          if ($.trim(data) != "") {
            addErrorsClass(obj);
            emailCheckCachedValid = false;
           /* if($('.sign-up-multi').length > 0) {
              // signup flow does not have second field
              removeErrorsClass(obj);
              emailCheckCachedValid = true;
            } else {
              addErrorsClass(obj);
              emailCheckCachedValid = false;
            }*/
            $('#user_email_confirmation').unbind("blur", validateEmailConfirmation);
            // obj.focus();
            $('#user_email_confirmation').bind("blur", validateEmailConfirmation);
          } else {
            emailCheckCachedValid = true;
            removeErrorsClass(obj);
            if($('.sign-up-multi').length > 0) {
               // signup flow does not have second field
               $('#submit-btn a').removeClass('disabled');
            }
          }
        }
      );
    } else {
      if (emailCheckCachedValid) {
        removeErrorsClass(obj);
      } else {
        addErrorsClass(obj);
      }
    }
  }

  if (!obj.hasClass("with_errors")) {
    var conf = $("#user_email_confirmation");
    if (email == conf.val()) {
      removeErrorsClass(conf);
    }
  }

  checkFormComplete(event);
}

function validateEmailConfirmation(event) {
  var emailTextBox = $("#user_email");
  trimInputValue(emailTextBox);
  var email = emailTextBox.val();

  trimInputValue($(this));
  var emailConf = $(this).val();

  if ((emailConf.length > 0 && email != emailConf) ||
      (email.length > 0 && !emailTextBox.hasClass("with_errors") && email != emailConf)) {
    showInputError($(this));
  } else {
    if (emailConf.length > 0) {
      removeErrorsClass($(this));
    }
  }
  checkFormComplete(event);
}

function passwordContainsEmail(password, email) {
  if (email == null || $.trim(email) == "") return false;

  var emailArr = email.split("@");
  var emailName = emailArr[0];
  var emailDomain = emailArr[1];
  var pass = password.toLowerCase();

  if (pass.indexOf(emailName.toLowerCase()) >= 0) {
    return true;
  } else if (emailDomain != null) {
    var ix = emailDomain.lastIndexOf(".");
    if (ix <= 0) ix = emailDomain.length;
    if (pass.indexOf(emailDomain.substring(0, ix).toLowerCase()) >= 0) {
      return true;
    }
  }
  return false;
}

function handleRegValidatePassword(event) {
  var pass = $(this).val();
  var errors = false;

  if (pass.length > 0) {
    errors = !passwordValid(pass, $("#user_email").val());

    if (errors) {
      showInputError($(this));
    } else {
      removeErrorsClass($(this));
      $('#btn-create-account').removeClass('disabled');
      var conf = $("#user_password_confirmation");
      if (pass == conf.val()) {
        removeErrorsClass(conf);
      }
    }
  }

  // for case where user edits password and doesn't touch confirmation
  var passConfInput = $("#user_password_confirmation");
  var passConf = passConfInput.val();

  if($('.sign-up-multi').length > 0) {
    var passConf = pass;
  } else {
    var passConf = passConfInput.val();
  }
  if (passConf) {
    if ((passConf.length > 0 && pass != passConf) ||
      (pass.length > 0 && !$(this).hasClass("with_errors") && pass != passConf)) {
      showInputError(passConfInput);
    } else {
      if (passConf.length > 0) {
        removeErrorsClass(passConfInput);
      }
    }
  }
  checkFormComplete(event);
}

function passwordValid(pass, email) {
  var passRegex = /(?=.*[A-Z])(?=.*[^A-Z])[\S]+|(?=.*[a-z])(?=.*[^a-z])[\S]+$|(?=.*[0-9])(?=.*[^0-9])[\S]+$/;

  var valid = true;

  if (pass.length < 8) {
    valid = false;
    $(".user_password_warning_minlength").show();
  } else {
    $(".user_password_warning_minlength").hide();
  }

  if (pass.length > 99) {
    valid = false;
    $(".user_password_warning_maxlength").show();
  } else {
    $(".user_password_warning_maxlength").hide();
  }

  if (!pass.match(passRegex)) {
    valid = false;
    $(".user_password_warning_types").show();
  } else {
    $(".user_password_warning_types").hide();
  }

  if (passwordContainsEmail(pass, email)) {
    valid = false;
    $(".user_password_warning_email").show();
  } else {
    $(".user_password_warning_email").hide();
  }

  return valid;
}

function handleRegValidatePasswordConfirmation(event) {
  var passTextBox = $("#user_password");
  var pass = passTextBox.val();
  var passConf = $(this).val();

  if ((passConf.length > 0 && pass != passConf) ||
      (pass.length > 0 && !passTextBox.hasClass("with_errors") && pass != passConf)) {
    showInputError($(this));
  } else {
    if (passConf.length > 0) {
      removeErrorsClass($(this));
    }
  }
  checkFormComplete(event);
}

function validateSecretAnswer(event) {
  if ($.trim($(this).val()) != "") {
    removeErrorsClass($(this));
  } else {
    showInputError($(this));
  }
  checkSecurityFormComplete(event);
}

function validateDOB(event) {
  var dobYear = $("#user_date_of_birth_year");
  var dobMonth = $("#user_date_of_birth_month");
  var dobDay = $("#user_date_of_birth_day");
  var dobString = dobMonth.val() + "/" + dobDay.val() + "/" + dobYear.val();
  var dobResult = validDOB(dobString);

  if (($.trim(dobYear.val()) == "" && $.trim(dobMonth.val()) == "" && $.trim(dobDay.val()) == "") || dobResult["valid"]) {
    removeErrorsClass(dobYear);
    removeErrorsClass(dobMonth);
    removeErrorsClass(dobDay);
  } else {
    showInputError(dobYear);
    showInputError(dobMonth);
    showInputError(dobDay);
  }

  checkFormComplete(event);
}

function validDOB(dobString) {
  var dobMatch, dob, dobValid;

  dobValid = false;
  dobMatch = dobString.match(/^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/]((19|20)[0-9]{2}))*$/);

  if (dobMatch != null) {
    dobString = dobString.replace(/[- .]/gi, "/");
    try {
      var year = dobMatch[4];
      var month = dobMatch[2]-1;
      var day = dobMatch[3];
      dob = new Date(year, month, day);

      if (year != dob.getFullYear() || month != dob.getMonth() || day != dob.getDate()) {
        dobValid = false;
        dobString = "";
      } else if (getAge(dob) >= 13) {
        dobValid = true;
      }
    } catch(err) {
      dobValid = false;
      dobString = "";
    }
  }

  return { "valid":dobValid, "dobString":dobString };
}

function validateEasySelectSelection(event) {
  var esDisp = null;
  var hasErrors = true;

  if ($(this).val() != "" || $(this).attr("rel") != "") {
    esDisp = highlightEasySelect(false);
    hasErrors = false;
  } else {
    esDisp = highlightEasySelect(true);
    var rel = $(this).attr("rel");
  }

  if (esDisp != null && event.type == "click") {
    esDisp.focus();
  }
  checkSecurityFormComplete(event, hasErrors);
}

function validateTermsOfService(event) {
  checkFormComplete(event);
}

function highlightEasySelect(hasErrors) {
  var sel = $("#user_secret_question_id");
  var esDisp = $(".easy-select-box-disp").first();

  if (hasErrors) {
    addErrorsClass(sel);
    addErrorsClass(esDisp);
  } else {
    removeErrorsClass(sel);
    removeErrorsClass(esDisp);
  }
  return esDisp;
}

function checkFormComplete(event, easySelectErrors) {
  var hasErrors = false;

  if (!hasErrors) {
    $("input.hintable").each(function() {
      if ($(this).val() == "" || $(this).hasClass("with_errors")) {
        hasErrors = true;
        return false;
      }
    });
  }

  var btnCreate = $("#btn-create-account");
  toggleButtonEnabled(btnCreate, hasErrors, "preview-rounded");
}

function errorsForScreenName(name) {
  var nameRegex = /^[a-zA-Z0-9]+$/;

  if (name.length < 3) {
    // ScreenNameErrors defined in erb for localization purposes
    return ScreenNameErrors["too_short"];
  } else if (!name.match(nameRegex)) {
    return ScreenNameErrors["invalid"];
  } else {
    return false;
  }
}

/* when screen name input changes we go here */
function handleScreenNameFieldUpdated() {
  console.log('handleScreenNameFieldUpdated');
  var frm = $("#" + $(this).attr("rel"));
  var txt = $(this);
  var val = $(this).val();

  if (frm.length > 0) {
    AlternateNames = [];
    var errors = errorsForScreenName(val);
    var chk = $("#screen-name-chk");
    var btn = $("#screen-name-submit");

    if (errors == false) {
      $.get("/users/ajax_check_field", { "field_name":"screen_name", "screen_name":escape(val) },
        function(data) {
          $("#screen-name-err-msg").html(data);
          if (data != "") {
            toggleScreenNameErrors(chk, btn, false);
          } else {
            $("#screen-name-err-msg").html("");
            toggleScreenNameErrors(chk, btn, true);
          }
          showAlternateNames(val);
        }
      );
    } else {
      $("#screen-name-err-msg").html(errors);
      toggleScreenNameErrors(chk, btn, false);
      showAlternateNames(val);
    }
  }
}

function handleOldPasswordFieldUpdated() {
  var frm = this.form;
  var txt = $(this);
  var val = $(this).val();

  if (frm != null) {
    $.post("/users/account/ajax_check_field", { "field_name":"old_password", "old_password":val },
      function(data) {
        if ($.trim(data) != "1") {
          addErrorsClass(txt);
        } else {
          removeErrorsClass(txt);
        }
      }
    );
  }
}

function handleNewPasswordFieldUpdated(event) {
  var pass = $(this).val();
  var errors = false;

  if (pass.length > 0) {
    var email = $("#user_email_name").val() + "@" + $("#user_email_domain").val();
    errors = !passwordValid(pass, email);

    if (errors) {
      addErrorsClass($(this));
    } else {
      removeErrorsClass($(this));
      var conf = $("#user_new_password_confirmation");
      if (pass == conf.val()) {
        removeErrorsClass(conf);
      }
    }
  } else {
    removeErrorsClass($(this));
  }
  checkPasswordFormComplete(event);
}

function handleNewPasswordConfirmationFieldUpdated(event) {
  var passTextBox = $("#user_new_password");
  var pass = passTextBox.val();
  var passConf = $(this).val();

  if ((passConf.length > 0 && pass != passConf) ||
      (pass.length > 0 && !passTextBox.hasClass("with_errors") && pass != passConf)) {
    addErrorsClass($(this));
  } else {
    removeErrorsClass($(this));
  }
  checkPasswordFormComplete(event);
}

function handleSetPasswordFieldUpdated(event) {
  var pass = $(this).val();
  var errors = false;

  if (pass.length > 0) {
    var email = $("#user_email_name").val() + "@" + $("#user_email_domain").val();
    errors = !passwordValid(pass, email);

    if (errors) {
      addErrorsClass($(this));
    } else {
      removeErrorsClass($(this));
      var conf = $("#user_set_password_confirmation");
      if (pass == conf.val()) {
        removeErrorsClass(conf);
      }
    }
  } else {
    removeErrorsClass($(this));
  }
  checkDisconnectAuthorizationFormComplete(event);
}

function handleSetPasswordConfirmationFieldUpdated(event) {
  var passTextBox = $("#user_set_password");
  var pass = passTextBox.val();
  var passConf = $(this).val();

  if ((passConf.length > 0 && pass != passConf) ||
      (pass.length > 0 && !passTextBox.hasClass("with_errors") && pass != passConf)) {
    addErrorsClass($(this));
  } else {
    removeErrorsClass($(this));
  }
  checkDisconnectAuthorizationFormComplete(event);
}

function checkPasswordFormComplete() {
  var hasErrors = false;

  $("#change-password-form .check-form").each(function() {
    if ($(this).hasClass("with_errors") || $.trim($(this).val()) == "") {
      hasErrors = true;
    }
  });

  toggleButtonEnabled($("#password-submit"), hasErrors, "preview");
}

function checkDisconnectAuthorizationFormComplete() {
  var hasErrors = false;

  $("#disconnect-authorization-form .check-form").each(function() {
    if ($(this).hasClass("with_errors") || $.trim($(this).val()) == "") {
      hasErrors = true;
    }
  });

  toggleButtonEnabled($("#disconnect-authorization-submit"), hasErrors, "preview");
}

function handleNewEmailFieldUpdated(event) {
  var input = $(this);
  trimInputValue(input);
  var email = $(this).val();

  if (email.length > 0) {
    if (email.match(/^([a-zA-Z0-9~*_\+\-\.]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i) &&
        !passwordContainsEmail($(".old-password").val(), email)) {
      // basic validation passed, now make a call to server so we don't have to duplicate the logic here
      $.post("/users/account/ajax_check_field", { "field_name":"email", "email":email },
        function(data) {
          var notice = $("#user_new_email_notice");
          if ($.trim(data) != "1") {
            addErrorsClass(input);
            notice.html(data);
            notice.show();
          } else {
            removeErrorsClass(input);
            notice.html("");
            notice.hide();
          }
          var conf = $("#user_new_email_confirmation");
          if (email == conf.val()) {
            removeErrorsClass(conf);
          } else if (conf.val().length > 0) {
            addErrorsClass(conf);
          }
          checkEmailFormComplete(event);
        }
      );
    } else {
      addErrorsClass(input);
    }
  } else {
    removeErrorsClass($(this));
  }
  checkEmailFormComplete(event);
}

function handleNewEmailConfirmationFieldUpdated(event) {
  var emailTextBox = $("#user_new_email");
  trimInputValue(emailTextBox);
  var email = emailTextBox.val();

  trimInputValue($(this));
  var emailConf = $(this).val();

  if (emailConf.length > 0 && email != emailConf) {
    addErrorsClass($(this));
  } else {
    removeErrorsClass($(this));
  }
  checkEmailFormComplete(event);
}

function handleDownloadClick(event) {
  _gaq.push(['_trackEvent', 'Downloads', 'TERA - Streaming Client', 'Sign-up Complete Button']);
}

function handleZMRDownloadClick(event) {
  _gaq.push(['_trackEvent', 'Downloads', 'ZMR - Full Client', 'Sign-up Complete Button']);
}

function checkEmailFormComplete() {
  var hasErrors = false;

  $("#change-email-form .check-form").each(function() {
    if ($(this).hasClass("with_errors") || $.trim($(this).val()) == "") {
      hasErrors = true;
    }
  });

  toggleButtonEnabled($("#email-submit"), hasErrors, "preview");

  //$.colorbox.resize();
}

function checkSecurityFormComplete(event, easySelectErrors) {
  var hasErrors = false;
  var sel = $("#user_secret_question_id");

  // special check condition for secret question/answer
  if ( easySelectErrors == true ||
       (easySelectErrors == null && sel.find("option:selected").first().val() == "" && $("#user_secret_answer").val() != "") ) {
    highlightEasySelect(true);
    hasErrors = true;
  }

  if ($("#user_secret_answer").hasClass("with_errors") || $("#user_secret_answer").val() == "") {
    hasErrors = true;
  }

  toggleButtonEnabled($("#btn-save-changes"), hasErrors);
}

function toggleScreenNameErrors(chk, btn, enable) {
  if (enable) {
    chk.addClass("valid");
    chk.removeClass("with_errors");
    btn.removeClass("disabled");
    btn.removeClass("preview");
  } else {
    chk.removeClass("valid");
    chk.addClass("with_errors");
    btn.addClass("disabled");
    btn.addClass("preview");
  }

  //$.colorbox.resize();
}

var AlternateNames = [];
function showAlternateNames(val) {
  var div = $("#alternate-names");
  var existing = $("#existing-name");
  var links = $("#alternate-name-links");

  if (AlternateNames.length > 0) {
    existing.html(val);
    links.html("");
    for (i=0;i<AlternateNames.length;i++) {
      if (i > 0) links.append(", ");
      links.append("<a href='#'>" + AlternateNames[i] + "</a>");
    }
    $("#alternate-name-links a").click(handleAlternateNameClick);
    div.show();
  } else {
    div.hide();
  }

  //$.colorbox.resize();
}

function handleAlternateNameClick(event) {
  var txt = $("#user_screen_name");
  txt.val($(this).html());
}

function handleTermsOfServiceClick(event) {
  $.colorbox({
    width:"840px",
    height: "355px",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#terms",
    fixed:true
  });
}

function codeRedemptionPopupCallback(href) {
  $('#code-redemption-info').html("");
  $('#code-redemption-info').load(href);
}

function handleUnredeemedCodeClicked(event) {
  var code_href = $(this).attr("href");
  $.colorbox({
    //width:"780px",
    //height:"350px",
    maxWidth:"780px",
    maxHeight:"350px",
    width: "100%",
    height: "100%",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#code-redemption-info",
    onLoad:codeRedemptionPopupCallback(code_href)
  });
  event.preventDefault();
}

function setupClientSideValidations() {
  $('.sign-up-mutli #user_email').on('blur, mouseleave, keyup', validateEmail);
  $('#user_email_confirmation').bind("blur", validateEmailConfirmation);
  $('.sign-up-mutli #user_password').on('blur, mouseleave, keyup', handleRegValidatePassword);
  //$('#user_password_confirmation').blur(handleRegValidatePasswordConfirmation);
  $('#user_secret_answer').keyup(validateSecretAnswer);
  $('#user_date_of_birth_year').blur(validateDOB);
  $('#user_date_of_birth_month').blur(validateDOB);
  $('#user_date_of_birth_day').blur(validateDOB);
  $('#user_terms_label').click(validateTermsOfService);
   //$(".easy-select-box-disp").blur(validateEasySelectSelection);
  $("#user_secret_question_id").focus(validateEasySelectSelection);
  $(".easy-select-box li a").click(validateEasySelectSelection);

  $("input.hintable").keyup(checkFormComplete);

  bindPeriodicObserver($("#user_screen_name"), 1, handleScreenNameFieldUpdated);

  bindPeriodicObserver($(".old-password"), 1, handleOldPasswordFieldUpdated);
  bindPeriodicObserver($("#user_new_password"), 1, handleNewPasswordFieldUpdated);
  $("#user_new_password_confirmation").keyup(handleNewPasswordConfirmationFieldUpdated);

  bindPeriodicObserver($("#user_set_password"), 1, handleSetPasswordFieldUpdated);
  $("#user_set_password_confirmation").keyup(handleSetPasswordConfirmationFieldUpdated);

  bindPeriodicObserver($("#user_new_email"), 1, handleNewEmailFieldUpdated);
  $("#user_new_email_confirmation").keyup(handleNewEmailConfirmationFieldUpdated);
}

function setupPromoCodeEvents() {
  $("a.unredeemed-code").click(handleUnredeemedCodeClicked);
}

function setupAccountEvents() {
  $(".hintable").on('focus', handleHintableFocus);
  $(".hintable").on('blur', handleHintableBlur);
  $("#user_date_of_birth_year").blur(function() { $("div.row").removeClass("selected"); });
  $("#user_date_of_birth_month").blur(function() { $("div.row").removeClass("selected"); });
  $("#user_date_of_birth_day").blur(function() { $("div.row").removeClass("selected"); });
  $('.label_check, .label_radio').click(function(){
      setupLabel();
  });
  setupLabel();
  $('.easy-select').easySelectBox();
  $(".easy-select-box-disp").focus(handleEasySelectFocus);
  $(".easy-select-box-disp").click(handleEasySelectFocus);
  $(".easy-select-box ul li a").hover(handleEasySelectOptionHover);
  $(".easy-select-box-disp").keydown(handleEasySelectKeyDown);

  setupClientSideValidations();
  setupPromoCodeEvents();
}

function randomizeString(chars, output) {
  var len = chars.length;

  var rnum = Math.floor(Math.random() * len);
  if (len == 0) {
    return output
  } else {
    var newChars = chars.slice(0, rnum) + chars.slice(rnum+1, len);
    output += chars.substring(rnum,rnum+1);
    return randomizeString(newChars, output);
  }
}

function showErrorExplanation(errors, location) {
  if(errors.length > 0) {
    if ($("#errorExplanation").length == 0) {
        location.prepend('<div class="errorExplanation" id="errorExplanation"></div>');
    }

    var errorContent = '<p>' + errors.length + (errors.length > 1 ? ' Errors:' : ' Error:') + '</p><ul>';
    errors.forEach(function(error) {
      errorContent += '<li>' + error + '</li>';
    });
    errorContent += '</ul>';
    $("#errorExplanation").html(errorContent);
  }
}

function handleCreateAccountClick(event) {
  if ($(this).hasClass("disabled")) {
    event.preventDefault();
    event.stopPropagation();
  } else {
    var form = $("#" + $(this).attr("data-form"));
    var waitText = $(this).attr("data-wait-text") || "Submitting...";
    var successText = $(this).attr("data-success-text") || "Success";
    var successTitle = $(this).attr("data-success-title") || "Success, please check your email";
    var send_verify_email = '/custom_blocks/send_verification_email';
    var event_label = 'TERA';

    if (form.length == 1) {
      if ($('#battleplans-signup').length > 0) {
        send_verify_email = '/custom_blocks/battleplans_send_verification_email';
        event_label = 'BATTLEPLANS';
      } else if ($('#zmr-signup').length > 0) {
        send_verify_email = '/custom_blocks/zmr_send_verification_email';
        event_label = 'ZMR';
      } else if ($('#eme-signup').length > 0) {
        send_verify_email = '/custom_blocks/eme_send_verification_email';
        event_label = 'EME';
      }
    
      var button = $(this);
      var originalText = button.html() || "Sign Up Now";
      button.html(waitText);

      copyBlackBox("#account-registration-form", "#user_io_black_box", 0);

      var valuesToSubmit = form.serialize();

      $.ajax({
        dataType: 'json',
        type: 'post',
        url: '/users',
        data: valuesToSubmit,
        success: function (data) {
          if (data) {
            if (data.errors) {
              showErrorExplanation(data.errors, $("#registration"));
              button.html(originalText);
            } else if (data.redirect_url) {
              // when legacy account creation is occurred, window redirection will invoked.
              window.location = data.redirect_url;
            } else {
              _gaq.push(['_trackEvent', 'Accounts', 'Send Verification Email', event_label]);

              $.ajax({
                //async: false,
                dataType: 'json',
                type: 'get',
                url: send_verify_email,
                success: function (data) {
                  $.globalEval(data.content);
                }
              })

              if ($('#btn-success').length == 1) {
                button.hide();
                $('#btn-success').css('display', 'block');
                // disable the link
                $('#btn-success').unbind("click");
                $('#btn-success').bind("click", function(event) { event.preventDefault(); });
              } else {
                button.html(successText);
                button.attr("title", successTitle);
                button.addClass("disabled");
              }

              if (data.email_address) {
                $("#email_address").html("Email sent to: " + data.email_address + "!");
              }
              if (data.email_inbox) {
                $("#email_inbox").html(data.email_inbox);
              }

              if (data.activation_ticket_link) {
                $("a.resend_activation").attr("href", data.activation_ticket_link);
              }


                $('.signup-wrap').css('display', 'none');
                $('#verify-wrap').css('display', 'block'); 
                
              
              /*  $.colorbox({
                  width: "645px",
                  height: "240px",
                  scrolling: false,
                  inline: true,
                  className: "submissionPop",
                  opacity: "1",
                  href: "#verification",
                  fixed: true,
                  onLoad: function() { $.colorbox.resize(); },
                  onOpen: function() {$("#container-main").hide();},
                  onClosed: function() {$("#container-main").show();}
                }); */

            }
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          button.html(originalText);

          var errors = new Array();
          errors[0] = errorThrown;

          showErrorExplanation(errors, $("#registration"));
        }
      });
    }
    event.preventDefault();
  }
}

function gacctNameChangeCallback(obj) {
  var currName = unescape(obj.attr("rel"));
  $("#game_account_account_name").val(currName);
  $("#current_gacct_name").val(currName);
  focusColorBoxInput("#gacct-name-form-cont");
}

function handleGameAccountNameClick(event) {
  $.colorbox({
    width:"840px",
    height:"420px",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#gacct-name-form-cont",
    onLoad:gacctNameChangeCallback($(this))
  });

  event.preventDefault();
}

function handleDisconnectAuthorizationClick(event) {
  event.preventDefault();

  var target = $(event.target);
  var provider = target.data("provider");
  var setPassword = target.data("set-password");

  var form = $("#disconnect-authorization-form-cont form");
  form.find("#provider").val(provider);

  if (setPassword) {
    $.colorbox({
      width:"475px",
      height:"217px",
      scrolling:false,
      inline:true,
      opacity: "1",
      href:"#disconnect-authorization-form-cont",
      onLoad:disconnectAuthorizationCBoxCallback
    });
  } else {
    form.submit();
  }

}

function handleDisconnectAuthorizationButtonClick(event) {
  event.preventDefault();

  var target = $(event.target);

  if (target.hasClass("disabled")) {
    return false;
  }

  var form = target.closest("form");
  form.submit();
}

function nickNameCBoxCallback() {
  focusColorBoxInput("#public-nickname");
}

function emailCBoxCallback() {
  focusColorBoxInput("#change-email-form-cont");
}

function passwordCBoxCallback() {
  focusColorBoxInput("#change-password-form-cont");
}

function engardeCBoxCallback() {
  focusColorBoxInput("#user_engarde_enabled_true");
}

function disconnectAuthorizationCBoxCallback() {
  focusColorBoxInput("#disconnect-authorization-form-cont");
}

function initColorBoxes() {
  $(".nickname").colorbox({
    //maxWidth:"840px",
    //maxHeight:"380px",
    //width: "100%",
    //height: "100%",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#public-nickname",
    onLoad:nickNameCBoxCallback
  });

  $(".edit-email-link").colorbox({
    //maxWidth:"760px",
    //maxHeight:"720px",
    //width: "100%",
    //height: "100%",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#change-email-form-cont",
    onLoad:emailCBoxCallback
  });

  $(".edit-password-link").colorbox({
    //maxWidth:"760px",
    //maxHeight:"495px",
    //width: "100%",
    //height: "100%",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#change-password-form-cont",
    onLoad:passwordCBoxCallback
  });

  $(".edit-engarde-link").colorbox({
    //maxWidth:"475px",
    //maxHeight:"480px",
    //width:"100%",
    //height: "100%",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#engarde-form-cont",
    onLoad:engardeCBoxCallback
  });

  $(".game-account-name-link").click(handleGameAccountNameClick);

  $(".disconnect-authorization-link").click(handleDisconnectAuthorizationClick);
  $(".disconnect-authorization-button").click(handleDisconnectAuthorizationButtonClick);

  $("#cboxContent").on("click", ".cancel", null, function(e) { e.preventDefault(); $.colorbox.close(); });
}

function bindPeriodicObserver(input, freq, callback) {
  if (input.length > 0) {
    input.observe_field(freq, callback);
  }
}

function bindLearnMoreMenu() {
  $('.menu-link').mouseover(function() {
    var position = $(this).attr('data-position');
    $('#learn-more-menu').attr('class', position);
    $('#menu-'+position).attr('class', "active");
  }).mouseout(function() {
    var position = $(this).attr('data-position');
    $('#learn-more-menu').removeClass();
    $('#menu-'+position).removeClass();
  });
}

function autoPlayVideo(video_id, width, height){
  var container = $(video_id).parent();
  var autoplaySrc = $(video_id).attr('src').replace('autohide=0', 'autohide=1') + '?&amp;autoplay=1';
  var autoplayHtml = '<iframe id="video" width="' + width + '" height="' + height + '" src="' + autoplaySrc + '" frameborder="0" allowfullscreen></iframe>';
  $(video_id).remove();
  container.prepend(autoplayHtml);
}

function trackVideoPlay(page, version) {
  version = typeof version !== 'undefined' ? version : 0;
   _gaq.push(['_trackEvent', 'Videos', 'Play', page, parseInt(version)]);
}

function handleVideoOverlayClick() {
  $(this).hide();
  $('#vidPreview').stop().hide();
  var width,
      height,
      page,
      version,
      video = $('#video');
  width = video.attr('width');
  height = video.attr('height');
  page = video.attr('data-page');
  version = video.attr('data-var');
  // trigger the google analytics code
 trackVideoPlay(page, version)
  autoPlayVideo('#video', width, height);
}

/**
Shows the sign up modal window for the ZMR sign up page
**/
function handleSignUpClick(event) {
  event.preventDefault();
  $.colorbox({
    width: "910px",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#register-modal",
    fixed:true
  });
};


function bootstrap() {
  setupAccountEvents();
  $("#link-terms-of-service").click(handleTermsOfServiceClick);
  $(".default-button.disabled").click(handleDisabledButtonClick);
  $("#btn-create-account").click(handleCreateAccountClick);
  $("#btn-save-changes").click(handleDisabledButtonClick);
  $("#btn-download").click(handleDownloadClick);
  $("#btn-zmr-download").click(handleZMRDownloadClick);
  $("#video-overlay").click(handleVideoOverlayClick);

  $(".sign-up").click(handleSignUpClick);

  // label ie
  var doc = document.documentElement;
  doc.setAttribute('data-useragent', navigator.userAgent);

  // make sure easy select shows error outline
  var secretQuestionSelect = $("#user_secret_question_id");
  if (secretQuestionSelect.hasClass("with_errors")) {
    addErrorsClass(secretQuestionSelect.next("div.easy-select-box").find("a.easy-select-box-disp"));
  }

  if ($('.password').length > 0) {
    $('.password').pstrength();
    $('.password').focus(function() { $(this).keyup(); }); // update the meter
  }

  //  focusInput($("#account-registration-form"));
  initColorBoxes();

  // bind learn more mouseover events
  bindLearnMoreMenu();

  $(".add-game-time-btn").click(function() {
    $("#game-time-card-pref-account").val($(this).attr('data-gid'));
  });
  $(".add-game-time-btn").colorbox({
    width:"780px",
    height:"420px",
    scrolling:false,
    inline:true,
    opacity: "1",
    href:"#game-time-card-form-container",
    onLoad: function() { $('#game-time-card-form-container').show(); },
    onComplete: function() { $('#game-time-card-form-container #game_code').focus(); },
    onCleanup: function() { $('#game-time-card-form-container').hide(); window.location.reload(); }
  });

  $(".game-time-card-code-submit").click(function() {
    if($(this).hasClass('disabled')) {
      return false;
    }
    var waitText = $(this).attr("data-wait-text") || "Submitting...";
    var formData = {};
    var serializedForm = $(this).parent().parent().serialize();
    $(this).text(waitText).addClass('disabled');
    $('#game-time-card-flash').html('');
    $.post('/users/game_time_cards', serializedForm, function(data) {
      handleGameTimeCardReturn(data);
    });

    return false;
  });

  /* account page */
  // reveal game toggle
  $('.game_account_bundle .nav').on('click', function() {
    $(this).closest('.game_account_bundle').toggleClass('open');
  });

  if ($('.show_nicknamer').length > 0) {
    $(".nickname").trigger('click');
  }
  

 /* get support tickets */
  /*var get_development_access_token = function() {
      // get access token usgin development API
      var user_email = <%= @user.email.to_json %>;
      var user_password = <%= @user.password.to_json %>;
      console.log('user_email ', user_email);
      console.log('user_password' , user_password);

      //$.ajax({
      //  type: 'post',
      //  url: 'http://account-edge.dev.enmasse.com/api/public/console/store/access_token', 
      //  data: {email: user_email, password: user_password}, 
      //  success: function(data) {
      //    accessToken = data.access_token;
      //    console.log('accessToken ', accessToken); 
      //  }
      //});
  };
  
  get_development_access_token();

  function fetchTickets(event) {
    console.log('fetch the tickets');
    
    var http_get = function(uri, data, success_handler, error_handler)
    {
      var url = uri;
      data.access_token = accessToken;
      $.ajax({
        type: 'get',
        url: url, 
        data: data, 
        success: success_handler, 
        error: function(xhr, status, error) {
          if (status == 401) {
            refresh_access_token();
            data.access_token = accessToken;
            $.ajax({
              type: 'get',
              url: url, 
              data: data, 
              success: success_handler, 
              error: error_handler
            });
          }
          else {
            error_handler(xhr, status, error);
          }
        }
      });
    }

    http_get(
        //'http://account-edge.dev.enmasse.com/api/public/console/store/time',
        'http://support-edge.enmasse.com/tickets/status',
        {},
        function(data) {
          console.log('data' , data);
        },
        function(xhr, status, error) {        
          console.log('Woops, there was an error making the request.');
          console.log(xhr.responseJSON);
        }
      );

  };

*/
  //$(document).on("click", "#fetchTickets", null, fetchTickets);
  /* end get support tickets */



  //accounts connected toggle
  //$('.togglebar input[type="checkbox"]').on('click', function() {
   // $(this).closest('.togglebar').toggleClass('checked');
  //});
}

/* Boot strap */
$(function() {
  bootstrap();
});

function handleGameTimeCardReturn(data) {
  data = JSON.parse(data);
  $('#game-time-card-flash').removeClass('success');
  $('#game-time-card-flash').html(data.message);
  if(data.success) {
    $('#game-time-card-flash').addClass('success');
    $('#cboxLoadedContent').html(data.html);
  } else {
    var submit_link = $("#game-time-card-form-container .submit a");
    submit_link.text(submit_link.attr('data-text')).removeClass('disabled');
  }
}

