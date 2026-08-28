$(function() {
  $("#game-account-selection-modal").on("click", ".game-account", null, function() {
    raf.modal.handleGameAccountSelection($(this));
  });

  $("#game-account-characters").on("click", ".character", null, function() {
    raf.modal.handleCharacterSelection($(this));
  });

  $('#referral-from-container').click(function() { raf.launchGameAccountSelection(); } );

  $('#referral_email').keyup(function() { if($(this).val() != '') { raf.validateEmailAddress($(this).val()); } });

  $('.referral-status-link').click(function() { raf.getReferralStatus($(this)); return false; });

  $("#cboxContent").on("click", "#referral-modal-close", null, function() { $.colorbox.close(); window.location = '/users/referrals/new'; return false; });
  $('#referral_sender').change(function() { raf.updateStep() });

  $('#referral_message').limit(300);
  $("#cboxContent").on("click", ".referral-resend", null, function() {
    if($(this).hasClass('disabled')) {
      return false;
    }
    var btn = $(this);
    btn.html('Sending...');
    $.post('/users/referrals/' + $(this).attr('data-rid') + '/resend_email', {}, function(data) {
      btn.html('Sent!');
    });

    return false;
  });

  // Server listing toggling between seeing characters and not
  $(document).on("click", ".server.closed", null, function() {
    $(this).hide();
    $(this).next().show();
    $.colorbox.resize();
  });

  $(document).on("click", ".server.open .top", null, function() {
    server = $(this).parent();
    server.hide();
    server.prev().show();
    $.colorbox.resize();
  });

  $('#new_referral #referral_submit').click(function() {
    if($(this).hasClass('disabled')) {
    } else {
      $('#new_referral').submit();
    }
    return false;
  });

  $('#new_referral').submit(function() {
    var formContent = $(this).serialize();
    $.post('/users/referrals.json', formContent, function(data) {
      if(data.status == 'success') {
        $.colorbox({
          inline:true,
          scrolling:false,
          href: "#referral-sent-modal",
          onOpen:function() {
            $("#referral-sent-modal").show();
          },
          onCleanup:function() {
            $("#referral-sent-modal").hide();
          }
        });
      } else if (data.status == 'redirect') {
        window.location = data.url;
      }
    });
    return false;
  });
});

raf = {
  launchGameAccountSelection:
    function() {
      $.colorbox({
        inline:true,
        scrolling:false,
        href: "#game-account-selection-modal",
        onOpen:function() {
          $("#game-account-selection-modal").show();
        },
        onCleanup:function() {
          $("#game-account-selection-modal").hide();
        }
      });
    },

  validateSenderName:
    function() {
      var senderName = $('#new_referral #referral_sender').val();
      var senderReg = /^[\w\s]+$/;
      return (senderName != '' && senderReg.test(senderName))
    },
  validateForm:
    function() {
      if(($('#new_referral #referral_email').val() != '') &&
         ($('#new_referral #referral_server').val() != '') &&
         ($('#new_referral #referral_character_name').val() != '') &&
         ($('#new_referral #referral_server_id').val() != '') &&
         ($('#new_referral #referral_char_srl').val() != '') &&
         (raf.validateSenderName()) &&
         ($('#new_referral #referral_game_account_id').val() != '')) {
            $('#new_referral #referral_submit').removeClass('disabled');
          }
      else {
        $('#new_referral #referral_submit').addClass('disabled');
      }
    },
  validateEmailAddress:
    function(email) {
      var emailReg = /^[\w\+\.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,5}$/;
      if( emailReg.test( email ) ) {
        raf.emailValid = true;
        raf.updateStep();
      } else {
        raf.emailValid = false;
        $('#new_referral #referral_submit').addClass('disabled');
        raf.updateStep();
      }
    },

  updateStep:
    function() {
      if(!raf.emailValid) {
        raf.changeStep(1);
        return false;
      } else if($('#sender').text() == 'Select a character') {
        raf.changeStep(2);
      } else if(!raf.validateSenderName()) {
        raf.changeStep(3);
      } else {
        raf.changeStep(4);
      }

      raf.validateForm();
    },

  changeStep:
    function(step) {
      $('.referral-step-indicator').removeClass('active');
      $('#step-' + step + ' .referral-step-indicator').addClass('active');
    },

  getReferralStatus:
    function(link) {
      link.html('Checking...');

      $.get(link.attr('data-url'), function(data) {
        $("#referral-status-modal-container").html(data);

        $.colorbox({
          inline:true,
          scrolling:false,
          href: "#referral-status-modal",
          onOpen:function() {
            $("#referral-status-modal").show();
          },
          onCleanup:function() {
            $("#referral-status-modal").hide();

            link.html(link.attr('data-text') + " >");
          }
        });
      });
    }

}

raf.modal = {
  handleGameAccountSelection:
    function(game_account) {
      $('#game-account-selection-modal .game-account').removeClass('active');
      $('#game-account-characters').html('');
      game_account.text('Loading...');
      $.colorbox.resize();

      var gid = game_account.attr('data-gid');
      var url = '/users/referrals/gacct_character?id=' + gid;
      $('form.new_referral #referral_game_account_id').val(gid);

      $.get(url, function(data) {
        // var characters_container = $('#game-account-characters');
        // characters_container.html('');

        // $.each(data, function(index, d) {
        //   raf.modal.addGameAccount(d);
        // });
        // $.colorbox.resize();
        game_account.text(game_account.attr('data-acct-name'));

        if(data.status == 'success') {
          $('#game-account-characters').html(data.html);
        } else {
          var msg = $('<div/>')
                      .addClass('modal-error-message')
                      .html(data.html);
          $('#game-account-characters').html(msg);
        }

        $.colorbox.resize();
      });
      game_account.addClass('active');
    },

  handleCharacterSelection:
    function(e) {
      $('form.new_referral #sender').html(e.text());

      $('form.new_referral #referral_server').val(e.attr('data-server-name'));
      $('form.new_referral #referral_character_name').val(e.attr('data-char-name'));
      $('form.new_referral #referral_server_id').val(e.attr('data-server-id'));
      $('form.new_referral #referral_char_srl').val(e.attr('data-char-srl'));
      $.colorbox.close();
      raf.updateStep();
    },

  addGameAccount:
    function(data) {
      var characters_container = $('#game-account-characters');
      var t = '<span class="name">' + data.char_name + '</span> <span class="from">from</span> <span class="server">' + data.server_name + '</span>';
      var e = $('<li/>')
                .addClass('character')
                .attr('data-server-id', data.server_id)
                .attr('data-char-srl', data.char_srl)
                .attr('data-char-name', data.char_name)
                .attr('data-server-name', data.server_name)
                .html(t);
      e.appendTo(characters_container);
    }
}
