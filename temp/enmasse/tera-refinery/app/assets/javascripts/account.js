function validateEmail() {
  var emailReg = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/,
      email = $('#email').val();

  if (emailReg.test(email) || email == "") {
    $('.email').removeClass('error');
  } else {
    $('.email').addClass('error');
    return false;
  }

  $.get('/email-verification', { 'email': email}, function(data) {
    data = $.parseJSON(data);
    if (data.exists) {
      $('.email').addClass('taken');
      return false;
    }
  });
  return true;
}

function passwordContainsEmail(password, email) {
  if (email == null || $.trim(email) == "") return false;

  var emailArr = email.split("@");
  var emailName = emailArr[0];
  var emailDomain = emailArr[1];
  var pw = password.toLowerCase();

  if (pw.indexOf(emailName.toLowerCase()) >= 0) {
    return true;
  } else if (emailDomain != null) {
    var ix = emailDomain.lastIndexOf(".");
    if (ix <= 0) ix = emailDomain.length;
    if (pw.indexOf(emailDomain.substring(0, ix).toLowerCase()) >= 0) {
      return true;
    }
  }
  return false;
}

function validatePassword() {
  var passRegex = /(?=.*[A-Z])(?=.*[^A-Z])[\S]+|(?=.*[a-z])(?=.*[^a-z])[\S]+$|(?=.*[0-9])(?=.*[^0-9])[\S]+$/,
      valid = true,
      pw = $('#password').val();

  // password must be at least 8 characters
  if (pw.length < 8) {
    valid = false;
  }

  // password can be no longer than 99 characters
  if (pw.length > 99) {
    valid = false;
  }

  // password must pass regex
  if (!pw.match(passRegex)) {
    valid = false;
  }

  // password cannot contain email or domain
  if (passwordContainsEmail(pw, $('#email').val())) {
    valid = false;
  }

  (pw == "" || valid) ? $('#hint').hide() : $('#hint').show();
  
  return valid;
}

$(document).ready(function() {
  if ( $('.account') ) {
    $('#email').bind({
      'focus': function() {
        $('.email').removeClass('error taken');
      },
      'blur': validateEmail
    });

    $('#password').bind({
      'focus': function() {
        $('#hint li').removeClass('error');
        $('#hint').show();
      },
      'blur': function() {
        validatePassword();
      }
    })

    $("#password").strength();

    $('#email').trigger("focus");

    $('#create-account').bind('click', function(e) {
      e.preventDefault();
      var pass = true,
          email = $('#email').val(),
          pw = $('#password').val();

      if ( pw == "" || !validatePassword() ) {
        pass = false;
        $('#hint').show();
      }

      if ( email == "" || !validateEmail() ) {
        pass = false;
        $('.email').addClass('error');
      }

      if (pass) {
        $('#sign-up').submit();
      }
    })
  }
});


// Secret question
$(document).ready(function() {
  $('#secret_question_id').bind('click', function() {
    $(this).removeClass('error');
  })

  $('#user_secret_answer').bind('click', function() {
    $(this).removeClass('error');
  })

  $('#save-secret').bind('click', function(e) {
    e.preventDefault();

    var q = $('#secret_question_id').val(),
        a = $('#secret_answer').val();

    if (q == "" && a == "") {
      $('#secret_question_id').addClass('error');
      $('#secret_answer').addClass('error');
      $('#ohnoerrors').html('Please fill out the form. You need to select a secret question along with an answer.');
    } else if (q == "") {
      $('#secret_question_id').addClass('error');
      $('#ohnoerrors').html('Please select a secret question.');
    } else if (a == "") {
      $('#secret_answer').addClass('error');
      $('#ohnoerrors').html('Please create an answer for your secret question.');
    }

    if (q != "" && a != "") {
      $('#question').submit();
    }
  })
})
