if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
      if (this[i] === obj) { return i; }
    }
    return -1;
  };
}

if($('#possible').length > 0) {

 

(function ($){
  function getMessage(count){
      if (count >= 20) {
      return "<h4>You've unlocked all the rewards! You are a generous person!</h4>";
      } else if ( count == 19 ) {
      return "<h4>You're only 1 gift box away from the next reward!</h4>";
      } else if (count == 15) {
      return "<h4>You've unlocked another reward! Send more gifts to earn the last reward!</h4>";
      } else if ( count == 14 ) {
      return "<h4>You're only 1 gift box away from the next reward!</h4>";
      } else if (count == 10) {
      return "<h4>You've unlocked another reward! Send more gifts to earn more rewards!</h4>";
      } else if (count == 9) {
      return "<h4>You're only 1 gift box away from the next big reward!</h4>";
      } else if (count == 5) {
      return "<h4>You've unlocked a reward! Send more gifts to earn more rewards!</h4>";
      } else if (count == 4) {
      return "<h4>You're only 1 gift box away from the next big reward!</h4>";
      } else if (count == 3) {
      return "<h4>You're only 2 gift boxes away from the next big reward!</h4>";
      } else if (count == 1) {
      return "<h4>You've unlocked the first reward! Collect it in game.</h4>";
      } else if (count == 0) {
      return "<h4>You haven't sent a single gift.</h4>";
      } else {
      return "<h4>Send more gifts to get rewards!</h4>";
      }
  }
  function getSentMsg(){
    var count = parseInt($('#gift-count').attr('data-count'));
    $('#gift-count').attr('data-count', count + 1);
    count += 1;
    return getMessage(count);
  }
  function getBuyCopy(){
    var count = parseInt($('#gift-count').attr('data-count'));
    return getMessage(count);
  }
  function showMessageForm(){
    //$('#send-gift .messages').show();
    //$('#send-gift .actions').show();
    $('.name-check').addClass('pass');
    $('#send-gift .button-primary').removeClass('disabled');
  }
  function hideMessageForm(){
    //$('#send-gift .messages').hide();
    $('.name-check').removeClass('pass');
    $('#charName .charInfo').hide();
    $('#send-gift .messages').find('input').val('');
    $('#send-gift').find('textarea').val('');
    //$('#send-gift .actions').hide();
    validateInputLength();
    recipient_id = 0;
    $('#send-gift .button-primary').addClass('disabled');
  }
  function validateEmail(){
    recipient = $('#email').find('input[name=email]').val();
    gameName = $('#send-gift').attr('data-gamename');
    $.ajax({
      type: "POST",
      url: '/' + gameName + '/gifts/find_account',
      data: {email: recipient},
      success: function(data){
        data = $.parseJSON(data);
        if (data.error) {
          $('#send-gift .error-alert .message').text(data.message)
          $('#send-gift .error-alert').show();
          $('#send-gift a.validate').removeClass('disabled');
          hideMessageForm();
        } else {
          $('#send-gift .error-alert').hide();
          $('#send-gift .error-alert .message').text('');
          $('#send-gift a.validate').removeClass('disabled');
          valid_recipient = true;
          recipient_id = data.id;
          showMessageForm();
        }
      }
    });
  }
  function validateChar(){
    recipient = $('#charName').find('input[name=character]').val();
    gameName = $('#send-gift').attr('data-gamename');
    $.ajax({
      type: "POST",
      url: '/' + gameName + '/gifts/find_character',
      data: {
        server_id: $('select[name=server]').val(),
        name: recipient
      },
      success: function(data){
        data = $.parseJSON(data);
        if (data.error) {
          $('#send-gift .error-alert .message').text(data.message)
          $('#send-gift .error-alert').show();
          $('#charName .charInfo').hide();
          hideMessageForm();
        } else {
          $('#send-gift .error-alert').hide();
          $('#send-gift .error-alert .message').text('')
          valid_recipient = true;
          if(gameName == 'tera') {
            recipient_id = data.character.user_id;
            $('#charName .race').text(data.character.race);
            $('#charName .class').text(data.character['class']);
            $('#charName .level').text(data.character.level);
            $('#charName .charInfo').show();
          } else {
            recipient_data = JSON.parse(data);
            recipient_id = recipient_data.user_id;
          }
          showMessageForm();
        }
      }
    });
  }
  function validateInputLength(field, count){
    var fields = [
      '#send-gift input[name=from]', 
      '#send-gift input[name=to]', 
      '#send-gift textarea[name=message]'
    ]

    sendable = true;
    $.each(fields, function(key, value){
      count = (this == '#send-gift textarea[name=message]') ? 250 : 30;
      if ($(value).val() && $(value).val().length > count){
        sendable = false;
        $('#send-gift .' + $(value).attr('name') + '-count')
          .css('color', 'red')
          .text($(value).val().length + '/' + count);
        $('.messages').find('.error.' + $(value).attr('name')).show();
      } else {
        $('#send-gift .' + $(value).attr('name') + '-count')
          .css('color', '#BBB')
          .text($(value).val().length + '/' + count);
        $('.messages').find('.error.' + $(value).attr('name')).hide();
      }
    })

    if (sendable){
      $('#send-gift .button-primary').removeClass('disabled');
    } else {
      $('#send-gift .button-primary').addClass('disabled');
    }
  }
  function showSuccess(){
    // sent modal copy
    $('#gift-count').html(getSentMsg());
    //$('.buy-more').find('.copy').html(getBuyCopy());
    $('#gift-sent .name').text(recipient);
    $('#gift-sent').reveal({
      close: function(){
        $('#gift-count').html('');
      }
    });
  }
  
  var possible = $.parseJSON($('#possible').attr('data-possible')),
  gift_id, recipient_id, recipient, sendable,
  valid_recipient = false,
  prizes = [];

  // $('.buy-more').find('.copy').html(getBuyCopy());

  // get all possible prizes and there indexes
  if (possible) {
    $.each(possible, function(ind, val){
      var prizeSet = [];
      $.each(possible[ind], function(index, value){
        prizeSet.push(index);
      })
      prizes[ind] = prizeSet;
    })
  }

  // Universal modal close event
 /* $('[class*=close]').bind('click', function(e){
    e.preventDefault();
    console.log('[class*=close]');
    $('.reveal-modal').trigger('reveal:close');
  });
*/

  // alternate universal close modal event
  $('a.close').on('click', function(event) {
    event.preventDefault();
    $('.reveal-modal').trigger('reveal:close');

  });


  // trigger faq
  $('.gifting-faq').bind('click', function(event){
    event.preventDefault();
    $('#gift-faq').reveal({
      close: function(){
        hideMessageForm();
      }
    });
  });

  // trigger sending gift
  $('.send-gift').bind('click', function(event){
    event.preventDefault();
    gift_id = $(this).find('a').attr('data-gift-id');
    $('#send-gift').reveal({
      close: function(){
        $('#send-gift .selector').find('li').removeClass('selected');
        $('#send-gift input').val('');
        $('#send-gift select').val(0);
        $('#send-gift .error-alert').hide();
        //$('#send-gift #charName').hide();
        hideMessageForm();
      }
    });
  })

  // Email/char name selector behavior
  $('#send-gift .selector').find('li').bind('click', function(){
    friend_select = $(this).attr('data-id');
    if(friend_select == 'email') {
      $('#send-gift #charName').hide();
    } else if(friend_select == 'charName') {
      $('#send-gift #email').hide();
    } else {
      $('#send-gift #charName').hide();
      $('#send-gift #email').hide();
    }
    $('#send-gift #email,#send-gift #charName').hide();
    $('#send-gift .error-alert').hide();
    $('#send-gift select').val(0);
    $('#send-gift #email input,#send-gift #charName input').val('');
    $('#send-gift .selector').find('li').removeClass('selected');
    $(this).addClass('selected');
    $('#send-gift').find('.race,.class,.level').text('');
    $('#send-gift #' + $(this).attr('data-id')).show();
  })

  // attach enter key press events to email and char name fields
  $('#send-gift input[name=email]').focus(function(){
    $('#email input').bind('keyup', function(e){
      if ( $(this).val() && e.keyCode == 13  ) { validateEmail(); $('#send-gift a.validate').addClass('disabled'); }
    })
  })
  $('#send-gift input[name=character]').focus(function(){
    $('#charName input').bind('keyup', function(e){
      if (e.keyCode == 13  ) { validateChar(); }
    })
  })


  // validate recipient by email
  $('#email .validate').bind('click', function(event){
    event.preventDefault();
    // attach events to revalidate in case user changes email
    $('#send-gift input[name=email]').bind('change', function(){
      valid_recipient = false;
      $('#send-gift .button-primary').addClass('disabled');
    })
    validateEmail();
    $('#send-gift a.validate').addClass('disabled');
  })

  // validate recipient by character
  $('#charName .validate').bind('click', function(event){
    event.preventDefault();
    // attach events to revalidate in case user changes character
    $('#send-gift input[name=character]').bind('change', function(){
      valid_recipient = false;
      $('#send-gift .button-primary').addClass('disabled');
    })
    validateChar();
  })

  // binding events to message fields for character restrictions
  $('#send-gift input[name=from],#send-gift input[name=to],#send-gift textarea[name=message]').bind('keyup', function(){
    validateInputLength();
  })
  
  // actually send the gift if all checks passß
  $('#send-gift .button-primary').bind('click', function(event){
    event.preventDefault();
    validateInputLength();
    gameName = $('#send-gift').attr('data-gamename');
    extraMsg = " Click the button below to open your gift and reveal what's inside!";
    if (sendable) {
      $.ajax({
        type: "POST",
        url: '/' + gameName + '/gifts/send/' + gift_id,
        data: {
          gift_id: gift_id,
          to_master_account_id: recipient_id,
          from: $('#send-gift input[name=from]').val(),
          to: $('#send-gift input[name=to]').val(),
          message: $('#send-gift textarea[name=message]').val() + extraMsg,
          game: gameName
        },
        success: function(data){
          data = $.parseJSON(data);
          if (data.error) {
            $('#send-gift .error-alert .message').text(data.message);
            $('#send-gift .error-alert').show();
            $('#send-gift .error_banner').show();
            $('#send-gift .reg_banner').hide();
          } else {
            $('#send-gift .error-alert').hide();
            $('#send-gift .error-alert .message').text('');
            $('article#gift-' + gift_id).remove();
            $('#send-gift .error_banner').hide()
            $('#send-gift .reg_banner').show();

            var bar = $('[id*=fill]'),
                num = parseInt($('[id*=fill]').attr('id').split('-')[1]) + 1;

            if (num <= 20) {
              $(bar).removeAttr('id').attr('id', 'fill-' + num);
            }

            if (num >= 5) { $('.prize-1 .image').addClass('cheevo'); }
            if (num >= 10) { $('.prize-2 .image').addClass('cheevo'); }
            if (num >= 20) {
              $('.prize-3 .image').addClass('cheevo');
              $('.purchased').addClass('whale');
            }
            // Clear player info and reset for next gift send
            recipient_id = 0;
            showSuccess();
          }
        }
      });
    }
  })

  // trigger opening a gift
  $('.claim-gift a').bind('click', function(event){
    event.preventDefault();
    gift_id = $(this).attr('data-gift-id'),
    gift_campaign = $(this).attr('data-campaign');
    gift_msg = $(this).attr('data-msg') || 'generic message';
    gift_sender = $(this).attr('data-sender')  || 'generic sender';
    gift_recipient = $(this).attr('data-recipient')  || 'generic recipient';

    if (gift_sender == 'generic sender') {
      $(".claim-open").hide();
    } else {
      $(".claim-open").show();
    }

    $('#gift-claim-recipient').html(gift_recipient);
    $('#gift-claim-message').html(gift_msg);
    $('#gift-claim-sender').html(gift_sender);

    $('#gift-claim').reveal({
      close: function(){
        $('#gift-claim').find('.gift').removeClass('chosen');
        $('#gift-claim').find('.front').show();
        $('#gift-claim').find('.flipper,.front,.back,.prize').removeAttr('style');
        $('#gift-claim').find('.back .title').text();
        $('#gift-claim').find('.close').text('Close without picking a card');
        $('#gift-claim .error-alert').hide();
        $('#gift-claim #gifts-cover').hide();
        $('#gift-claim .grats').hide();
        $('#gift-claim .pick').show();
        $('#gift-claim .account').show().find('.prizeName').text('');
      }
    });
  })


  $('#game-account').bind('change', function(){
    $('#gift-claim .error-alert').hide();
    $('#gift-claim .reg_banner').show();
    $('#gift-claim .error_banner').hide();
  })

  $('#gift-claim').find('.gift').bind('click', function(event){
    event.preventDefault();
    var self = this,
        game_account_id = $('#game-account').val();

    if ( $('#game-account').val() != 0 ){
      if (!$('#gift-claim').find('.flipped').length){
        var pool = $.extend(true, [], prizes);
        gameName = $('#gift-claim').attr('data-gamename');
        $.ajax({
          type: "POST",
          url: '/' + gameName + '/gifts/open/' + gift_id,
          data: {
            gift_id: gift_id,
            game_account_id: game_account_id
          },
          success: function(data){
            data = $.parseJSON(data);
            if (data.error) {
              $('#gift-claim .error-alert .message').text(data.message);
              $('#gift-claim .error-alert').show();
              $('#gift-claim .reg_banner').hide();
              $('#gift-claim .error_banner').show();
            } else {
              // hide errors because success
              $('#gift-claim .error-alert').hide();
              $('#gift-claim .error-alert .message').text('');
              $('#gift-claim .reg_banner').show();
              $('#gift-claim .error_banner').hide();

              // Cover page so cant click off while animations
              modalCover = $('body').prepend( $( '<div />', { 'class' : 'modal-cover' } ) );
              
              // get prize info from possibles
              var item = {};
              if (data.gift.emp) {
                item.display_name = data.gift.emp + " EMP";
                item.image = data.gift.emp + "EMP.jpg";
              } else {
                item = possible[data.gift.gift_box_id][data.gift.item_code];
                pool[data.gift.gift_box_id].splice(pool[data.gift.gift_box_id].indexOf(item.item_code),1);
              }

              $.each($('#gift-claim .gift'), function(){
                var boxTypes = Object.keys(possible);
                prize = possible[ data.gift.gift_box_id ][ pool[data.gift.gift_box_id].splice(Math.floor(Math.random() * pool[data.gift.gift_box_id].length),1) ];
                console.log(prize);
                if (prize.image != null) {
                  $(this).find('.back .prize').css('background-image', 'url(https://static.enmasse.com/store/' + gameName + '/wintera/' + prize.image + ')');
                }
                $(this).find('.back .title').html(prize.display_name)
              })

              $(self).find('.back .title').html(item.display_name)

              if (item.image) {
                $(self).find('.back .prize').css('background-image', 'url(https://static.enmasse.com/store/' + gameName + '/wintera/' + item.image + ')');
              }

              $('#gift-claim #gifts-cover').show();
              $(self).addClass('chosen').find('.front').transition({
                width: 382,
                height: 257,
                top: -23,
                left: -34,
                easing: 'easeOutQuad',
                duration: 1500
              }, function(){
                $(self).find('.flipper').transition({
                  perspective: 1000,
                  rotateY: '180deg',
                  easing: 'easeOutQuad',
                  duration: 1000,
                  delay: 500
                }, function(){
                  $(self).find('.back').css('backface-visibility', 'visible');
                  $(self).find('.front').hide();
                  $('#gift-claim .pick').hide();
                  $('#gift-claim .account').hide();
                  $('#gift-claim .grats').find('.prizeName').html(item.display_name);
                  // $('#gift-claim .grats').find('.type').text( (gift_campaign == 1482) ? 'White Satin party box' : 'Black Velvet Party Box' );
                  $('#gift-claim .grats').show();
                  $('#gift-claim').find('.flipper').transition({
                    perspective: 1000,
                    rotateY: '180deg',
                    easing: 'easeOutQuart',
                    duration: 1000,
                    delay: 1500
                  }, function(){
                    $('#gift-claim').find('.back').css('backface-visibility', 'visible');
                    $('#gift-claim').find('.front').hide();
                    $('.modal-cover').remove();
                  })
                })
              });
              $('#gift-claim').find('.close').text('Close');
              $('article#gift-' + gift_id).remove();
            }
          }
        });
      }
    } else {

      $('#gift-claim .error-alert .message').text('Please select an account.');
      $('#gift-claim .error-alert').show();
      $('#gift-claim .reg_banner').hide();
      $('#gift-claim .error_banner').show();
    }
  })

  // countdown
  if (new Date() >= new Date("1/3/2019")) {
    $(".reminder").css("display", "block");
  }
  var seconds = $("#countdown #seconds");
  var minutes = $("#countdown #minutes");
  var hours = $("#countdown #hours");

  setInterval(function() {updateTimer()}, 1000);

  function updateTimer() {
    var endDate = new Date('2019/1/3 0:00'); // subtract 8 hours, will point to 8am
    var startDate = new Date();
    var diffInMill = Math.abs(endDate - startDate);
    
    hours.text(parseInt(diffInMill / 3600000));
    minutes.text(60 - startDate.getMinutes() - 1);
    seconds.text(parseInt(60 - startDate.getSeconds() - 1));
  }

})( jQuery );
}
