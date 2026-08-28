/*
*= require modules/respond
*= require modules/velocity
*= require modules/magnific-popup.min.js
*= require modules/strength
*= require modules/waypoints
*= require_self
*/

var winW = $(window).width();
var winH = $(window).height();

var battleplansBeta = {
  s: {
    thumb: $('.thumb'),
    thumbOne: $('.thumb1'),
    thumbTwo: $('.thumb2'),
    thumbThree: $('.thumb3')
  },
  // GA stuff
  url: window.location.href.toString().split('http://')[1],
  waypoints: {
    header: { el: $('.hero'), label: 'Hero Area', read: false },
    signup:  {el: $('.signup'), label: 'Signup Form', read: false},
    gallery: { el: $('.battle-signup-gallery'), label: 'Battleplans Signup Gallery', read: false},
  },
  init: function(platform){
    battleplansBeta.bindWaypoints(platform);
    battleplansBeta.bindEvents();
    battleplansBeta.hitEnter();
  },
  hitEnter: function(e) {
    $("form").keypress(function(event) {
      if (event.which == 13) {
      //if ($(event.target).is('input')) {
        var btn = $(this).find(".btn-create-account");
        if (btn.length > 0 && !btn.hasClass("disabled")) {
          btn.first().click();
          event.preventDefault();
        }
      //}
    }
    });
  },
  bindWaypoints: function(platform){
    $.each(battleplansBeta.waypoints, function() {
      var _this = this;
      $(this.el).waypoint(function() {
        if (!_this.read){
          battleplansBeta.triggerGAEvent('Reached Page Section', _this.label);
        }
        _this.read = true;
      }, {offset: 300});
    });
    battleplansBeta.createPageTimers();
  },
  bindEvents: function() {
    var s = battleplansBeta.s;
    //handle clicking
    s.thumb.each(function() {
      $(this).on('click', battleplansBeta.handleColorboxClick);
    });
    //s.thumb.on('click', 'a', battleplansBeta.handleColorboxClick);
  },
  triggerGAEvent: function(action, label ) {
    // If Google Analytics is configured, trigger an event
    if (_gaq) {
      if (label != ' ') {
        _gaq.push(['_trackEvent', 'Landing Pages', action, battleplansBeta.url + ' - ' + label]);
      } else {
        _gaq.push(['_trackEvent', 'Landing Pages', action, battleplansBeta.url]);
      }
    }
  },
  createPageTimers: function() {
    // 1 minute on page
    setTimeout(function() {
      battleplansBeta.triggerGAEvent('Spent 1 minute on page', ' ');
    }, 1 * 60 * 1000);
    // 2 minutes on page
    setTimeout(function() {
      battleplansBeta.triggerGAEvent('Spent 2 minutes on page', ' ');
    }, 2 * 60 * 1000);
    // 5 minutes on page
    setTimeout(function() {
      battleplansBeta.triggerGAEvent('Spent 5 minutes on page', ' ');
    }, 5 * 60 * 1000);
  },
  // end GA stuff
  activateFields: function() {
    $( "#user_email" ).on('change blur paste cut', function() {
      validateEmail();
    });
    $( "#user_password" ).on('keyup change focus paste cut click', function() {
      $('#hint').show();
    });
    $( "#user_password" ).on('blur', function() {
      $('#hint').hide();
    });
    $( "#user_password" ).on('keyup change blur paste cut click', function() {
      validatePassword();
      if(!$.trim(this.value).length) {
        $('.password .check').removeClass('valid').addClass('with_errors');
      }
    });
  },


  gaInitialize: function(winW) {
    if(winW >= 1024) {
      battleplansBeta.init('desktop');
    } else if(winW < 768) {
      battleplansBeta.init('mobile');
    } else {
      battleplansBeta.init('tablet');
    }
  },


// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
//http://davidwalsh.name/javascript-debounce-function
  debounce: function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  },

};


$(window).on('load', function() {
  battleplansBeta.gaInitialize(winW);
  battleplansBeta.activateFields();
});

var myEfficientFn = battleplansBeta.debounce(function() {
  var winW = $(window).width();
  battleplansBeta.gaInitialize(winW);
}, 250);

//window.addEventListener('resize', myEfficientFn);

if (window.addEventListener) {
    window.addEventListener('resize', myEfficientFn, false);
}
else {
    window.attachEvent('resize', myEfficientFn);
}


// account js from tera-refienry
function validateEmail() {
  var emailReg = /\S+@\S+[\.]\S+/,
      email = $('#user_email').val(),
      obj = $(this);

  if (emailReg.test(email)) {
    $('.email').removeClass('error');
  } else if (email == "") {
    $('.email').addClass('error');
    $('#email_hint').show();
    $('#email_hint p').html('Email is invalid.');
  } else {
    $('.email').addClass('error');
    $('#email_hint').show();
    $('#email_hint p').html('The correct email format is name@domain.suffix');
    //$('.email').addClass('error');
    return false;
  }


// alterante check
$.get("/users/ajax_check_field", { "field_name":"email", "email":escape(email.toLowerCase()) },
  function(data) {
    if (data) {
      $('.email').addClass('email_error');
      $('#email_hint').show();
      $('#email_hint p').html(data);
      $('.email').addClass('error');
      $('.email .check').removeClass('valid').addClass('with_errors');
      //$('#btn-create-account').prop('disabled', true);
      //addErrorsClass(obj);
      return false;
    } else {
      $('.email').removeClass('email_error');
      $('#email_hint').hide();
      $('.email').removeClass('error');
      $('.email .check').removeClass('with_errors').addClass('valid');
      //$('#btn-create-account').prop('disabled', false);
    }
    //console.log('the data returned as ' + data);
    }
  );
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
      pw = $('#user_password').val();
  // password must be at least 8 characters
  if (pw.length < 8) {
    valid = false;
    $('#hint').show();
  } 

  // password can be no longer than 99 characters
  if (pw.length > 99) {
    valid = false;
    $('#hint').show();
  } 
  // password must pass regex
  if (!pw.match(passRegex)) {
    valid = false;
    $('#hint').show();
  } 

  // password cannot contain email or domain
  if (passwordContainsEmail(pw, $('#user_email').val())) {
    valid = false;
    $('#hint').show();
  } 

  //(pw == "" || valid) ? $('#hint').hide() : $('#hint').show();
  if(pw == "" || valid) {
    //$('#hint').hide();
    $('.password .check').removeClass('with_errors').addClass('valid');
    var dup_pass = $('#user_password').val();
    //console.log(dup_pass);
    $('#user_password_confirmation').val(dup_pass);
    $('#btn-create-account').prop("disabled", false);
  } else if(valid) {
    //console.log('hint can hide');
    $('#hint').hide();
  } else {
    $('#hint').show();
    $('.password .check').removeClass('valid').addClass('with_errors');
    $('#btn-create-account').prop("disabled", false);
  }
  
  return valid;
}


/*
$(document).ready(function() {
  if ( $('.account') ) {
    $('#user_email').bind({
      'focus': function() {
        $('.email').removeClass('error taken');
      },
     // 'blur': validateEmail
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

    //$('#email').trigger("focus");

    $('#btn-create-account').bind('click', function(e) {
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
        $('#email_hint').show();
      }
      
      if (pass) {
        var thankyouModal = $('#thankyouwrapper');
        $.magnificPopup.open({
          items: {
            src: thankyouModal,
          },
          type: 'inline',
          closeBtnInside: true,
          callbacks: {
            close: function() {
              $('#account-registration-form').submit();
            }
          }
        }) // end magnific popup
        $('.socials a').on('click', function() {
          $('#account-registration-form').submit();
        }) 
      } //end pass is true
    })
  }
}); 
*/




// magnific popup
$(document).ready(function() {

  $("#user_password").strength();

  $('#btn-create-account').bind('click', function(e) {
      e.preventDefault();
      var pass = true,
          email = $('#user_email').val(),
          pw = $('#user_password').val();

      if ( pw == "" || !validatePassword() ) {
        pass = false;
        $('#hint').show();
      } 

      if ( email == "" || !validateEmail() ) {
        pass = false;
        $('.email').addClass('error');
        $('#email_hint').show();
      }
      
      if (pass) {
        //$('#account-registration-form').submit();
        /*var thankyouModal = $('#thankyouwrapper');
        $.magnificPopup.open({
          items: {
            src: thankyouModal,
          },
          type: 'inline',
          closeBtnInside: true,
          callbacks: {
            close: function() {
              $('#account-registration-form').submit();
            }
          }
        }) // end magnific popup
        $('.socials a').on('click', function() {
          $('#account-registration-form').submit();
        }) */
      } //end pass is true
    }) // end btn click
   // flag to allow the successful submission to redirect
  var battleplansSignUp = "true";
  var thankyou = sessionStorage.getItem('thankyou');
  //console.log(thankyou)
  if(thankyou) {
    var thankyouModal = $('#thankyouwrapper');
    $.magnificPopup.open({
      items: {
        src: thankyouModal,
      },
        type: 'inline',
        closeBtnInside: true,
        callbacks: {
        close: function() {
          sessionStorage.setItem('thankyou', '');
        }
      }
    }) // end magnific popup
  } // end thank you check





  $('.image-popup-vertical-fit').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true
    }
    
  });

  $('.image-popup-fit-width').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    image: {
      verticalFit: false
    }
  });

  $('.image-popup-no-margins').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

});


