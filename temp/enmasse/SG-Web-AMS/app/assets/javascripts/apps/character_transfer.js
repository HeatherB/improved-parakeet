transferUI = {
  clearCharacterSelect: function() {
    $('.character-list li:not(.disabled)').each(function() {
      $(this).removeClass('selected');
      $(this).find('.eligibility').hide();
      $(this).find('.eligibility').removeClass('unavailable');
    });
  },

  selectCharacter: function(li) {
    character_srl = li.attr('data-character-srl');
    server_id = li.attr('data-server-id');
    character_name = li.attr('data-character-name');
    server_name = li.attr('data-server-name');

    $('#hidden_form #character_transfer_character_id').val(character_srl);
    $('#hidden_form #character_transfer_character_name').val(character_name);

    $('#hidden_form #character_transfer_from_server_id').val(server_id);
    $('#hidden_form #character_transfer_from_server_name').val(server_name);
    transferUI.clearCharacterSelect();
    transferUI.checkEligibility(li);
    transferUI.updatePopUpFrom(li);
  },

  checkEligibility: function(li) {
    li.find('.eligibility').hide();
    li.find('.progress').show();
    $.get('/game_accounts/' + game_account_id + '/transfer/check_eligibility?character_srl=' + character_srl + '&server_id=' + server_id, function(data) {
      transferUI.setEligibility(li, data);
      transferUI.checkSteps();
    });
  },

  setEligibility: function(li, eligible) {
    transferUI.clearCharacterSelect();

    li.find('.progress').hide();
    li.find('.eligibility').show();

    var eligibility_element = li.find('.eligibility');

    if(eligible == true) {
      eligibility_element.text('SELECTED');
      eligibility_element.addClass('available');
      eligibility_element.removeClass('unavailable');
      li.addClass('selected');
      $("#server-select-input").trigger('keyup');
    } else {
      eligibility_element.text('UNAVAILABLE');
      eligibility_element.removeClass('available');
      eligibility_element.addClass('unavailable');
      transferUI.updateErrorReasons(eligible);
    }
  },

  updateErrorReasons: function(eligible) {
    var errors = [];
    for (var i = 0; i < eligible.length; i++) {
      errors.push(eligible[i]);
    }
    var replacement = arrayToListItem(errors);
    replacement = replacement.join('');
    $('#transfer-query .transfer-requirements .transfer-reasons').html(replacement);
  },

  updatePopUpFrom: function(li) {
    character_name = li.children('.character-name').text().replace(/\s/g,'');
    server_name = li.parents('.server.open').attr('data-server-name');

    popup = $('.transfer-popup');
    popup.find('.character-name').text(character_name);
    popup.find('.from-server').text(server_name);

    popup = $('.payment-popup');
    popup.find('.character-name').text(character_name);
    popup.find('.from-server').text(server_name);
  },

  updatePopUpTo: function(text) {
    popup = $('.transfer-popup');
    popup.find('.to-server').text(text);

    popup = $('.payment-popup');
    popup.find('.to-server').text(text);
  },

  checkSteps: function() {
    if($('.character-list li.selected').size() > 0) {
      transferUI.stepTwo();
    } else {
      transferUI.stepOne();
    }
  },

  stepThree: function() {
    $('#destination-dropdown').removeClass('disabled');
    $('#destination-dropdown input').removeAttr('disabled');
    $('#initiate-payment').removeClass('disabled');
  },

  stepTwo: function() {
    $('#destination-dropdown').removeClass('disabled');
    $('#destination-dropdown input').removeAttr('disabled');
    $('#initiate-payment').addClass('disabled');

    $('select#server').trigger('change');
  },

  stepOne: function() {
    $('#destination-dropdown').addClass('disabled');
    $('#destination-dropdown input').attr('disabled', 'disabled');

    $('#initiate-payment').addClass('disabled');
  },

  array_to_use: function() {
    var ssn = $('.character.selected').parents('.server').attr('data-server-name');

    if(tr == false) {
      var array_to_be_searched = serverList;
    } else if($.inArray(ssn, pvp) >= 0 ) {
      var array_to_be_searched = pvp;
    } else {
      var array_to_be_searched = pve;
    }
    return array_to_be_searched;
  }
}

function arrayToListItem( array ) {
  var newArray = [];
  for(var i = 0; i < array.length; i++) {
    newArray.push("<li><span>" + array[i] + "</span></li>");
  }
  return newArray;
}

function searchInArray( array, regex ) {
  var newArray = [];
  for(var i = 0; i < array.length; i++) {
    var s = array[i];
    var regex_test = new RegExp(regex, 'gi')

    if(regex_test.test(s)) {
      newArray.push(s);
    }
  }
  return newArray;
}

function isInArray( array, test ) {
  var result = false;
  for(var i=0; i < array.length; i++) {
    var s = array[i];
    if(s == test) {
      result = true;
    }
  }
  return result;
}

$(function() {
  $('.character-list li').mouseover(function() {
    $(this).addClass('hovered');
    $(this).find('.eligibility').clearQueue().animate({ opacity: 0 }, 500);
  });
  $('.character-list li').mouseout(function() {
    $(this).removeClass('hovered');
    $(this).find('.eligibility').clearQueue().animate({ opacity: 1 }, 500);
  });

  $('.character-list li.character').click(function() {
    if($(this).hasClass('disabled')) {
      return false;
    }

    if($(this).find('.eligibility').hasClass('unavailable')) {
      $.colorbox(
        { inline:true,
          scrolling:false,
          href: "#transfer-query",
          onOpen:function() {
              $("#transfer-query").show();
            },
          onCleanup:function() {
              $("#transfer-query").hide();
            }
        });
      return false;
    }
    if($(this).hasClass('selected')) {
      $(this).removeClass('selected');
      $(this).find('.eligibility').hide();
      $('#hidden_form #character_transfer_character').removeAttr('value');
    }
    else
    {
      transferUI.selectCharacter($(this));
    }
    transferUI.checkSteps();
  });

  // Server listing toggling between seeing characters and not
  $('.server.closed').click(function() {
    $(this).hide();
    $(this).next().show();
  });

  $('.server.open .top').click(function() {
    server = $(this).parent();
    server.hide();
    server.prev().show();
  });

  // UI interactions for when you change the drop down for the destination server
  $('#server-select-input').change(function() {
    var array_to_be_searched = transferUI.array_to_use();
    if(isInArray(array_to_be_searched, $(this).val())) {
      transferUI.updatePopUpTo($(this).val());

      $('#hidden_form #character_transfer_to_server_id').val(serverListWithId[$(this).val()]);
      $('#hidden_form #character_transfer_to_server_name').val($(this).val());
      $(this).parent().addClass('selected');
      transferUI.stepThree();
    } else {
      $(this).parent().removeClass('selected');
      if(!$('.flow-step#initiate-payment').hasClass('disabled')) {
        transferUI.stepTwo();
      }
    }
  });

  $('#initiate-payment-btn').colorbox(
    { inline:true,
      scrolling:false,
      href:"#payment-confirm",
      onOpen:function() {
        $("#payment-confirm").show();
      },
      onCleanup:function() {
        $("#payment-confirm").hide();
      }
    });

  $('#initiate-payment-btn').click(function(event) {
    if($('#transfer-flow .flow-step.disabled').size() > 0) {
      return false;
      event.preventDefault();
    } else {
    }
  });

  $('#close-without-buying').click(function(event) {
    $.colorbox.close();
  });

  $('#payment-confirm #btn-confirm.clickable').click(function() {
    $(this).html('Submitting...');
    $(this).removeClass('clickable');
    $(this).unbind('click');

    var form = $('#hidden_form form');

    $.post(form.attr('action'), form.serialize(), function(data) {
      $.colorbox.close();
      $('#transfer-status-popup-container').html(data);
      // $('#transfer-flow').hide();
    });
  });

  function background_update_emp_wallet_balance() {
    // update emp wallet balance only if payment-popup dialog is visible
    if ($('.payment-popup').is(':visible') === true || $('.payment-popup').find('.balance').text() == '') {
      $.ajax({
          url: '/users/account/get_emp_wallet_balance',
          success: function (data) {
            if (typeof data.emp_wallet_balance != "undefined") {
              $('.payment-popup').find('.balance').text(data.emp_wallet_balance)
              // check if emp wallet balance is enough to buy this product
              var price = parseInt($(".payment-popup").find(".purchase-amount").text());
              if(data.emp_wallet_balance < price) {
                // not enough emp, show error message
                $('.payment-popup').find('.payment-actions').hide()
                $('.payment-popup').find('.error-messages').show()
              }
              else {
                // purchasable
                $('.payment-popup').find('.payment-actions').show()
                $('.payment-popup').find('.error-messages').hide()
              }
            }
          },
          complete: function () {
            // Schedule the next request when the current one's complete
            setTimeout(background_update_emp_wallet_balance, 1000);
          }
        });
    }
    else
      setTimeout(background_update_emp_wallet_balance, 1000);
  }

  // disable transfer button by default
  $('.payment-popup').find('.payment-actions').hide()
  $('.payment-popup').find('.error-messages').show()
  // update emp_wallet_balance in background
  background_update_emp_wallet_balance();

  $("#cboxContent").on("click", "#btn-close", null, function() { $.colorbox.close(); });
  $("#cboxContent").on("click", "#btn-cancel", null, function() { $.colorbox.close(); });

  // (robin) Client side autocompletion of the server dropdown
  $("#server-select-input").keyup(function() {
    var text = $(this).val();
    var ssn = $('.character.selected').parents('.server').attr('data-server-name');

    var array_to_be_searched = transferUI.array_to_use();

    var servers = searchInArray(array_to_be_searched, text);
    delete(servers[$.inArray($('.character.selected').attr('data-server-name'), servers)]);

    // (robin) Need to dump it into a new array because of IE
    var new_server_array = [];
    for(var i = 0; i < servers.length; i++) {
      if(servers[i] != undefined) {
        new_server_array.push(servers[i])
      }
    }

    var html = arrayToListItem(new_server_array).join('');
    $('#server-select-list ul').html(html);
  });

  $("#server-select-input").focusin(function() { $("#server-select-list").fadeIn(); $('#transfer-notices').css('margin-top', '210px'); });
  $("#server-select-input").focusout(function() { $("#server-select-list").fadeOut(); $('#transfer-notices').css('margin-top', '20px'); });

  $(document).on("click", "#server-select-list ul li", null, function() {
    $('#server-select-input').val($.trim($(this).text()));
    $('#server-select-input').trigger('change');
  });

  $('.transfer-history-status').click(function() {
    var transferId = $(this).parent().attr('data-transfer-id');

    $.get('/game_accounts/' + game_account_id + '/transfer/' + transferId + '/status_popup', function(data) {
      $('#transfer-history-popup-container').html(data);

      $.colorbox(
        { inline:true,
          scrolling:false,
          href: "#transfer-history-popup",
          onOpen:function() {
              $("#transfer-history-popup").show();
            },
          onCleanup:function() {
              $("#transfer-history-popup").hide();
            }
        });
    });
  });
});
