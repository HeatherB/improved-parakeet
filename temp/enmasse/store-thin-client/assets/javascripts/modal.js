var modal;
itemModal = function itemModal(){
  var INSUFFICENT_FUNDS_MESSAGE = "You don't have enough EMP to buy this item. Perhaps you would like to <a href='/tera/emp'>buy some EMP</a>?",
      $item, name, price;

  $('.checkout').click(function (e) {
    e.preventDefault();
    $('#foundation-modal').find('a[class*=close]').show();
    $item = $(this).parents('.item');
    name = $item.find('#item-title').text();
    modal.pop($item.data('item-id'));
    $('#foundation-modal .desc').html($item.find('.details').html());

    if($('#foundation-modal .desc .badge-elite').length > 0){
      SSO.refresh();
    }

    if(SSO.isLoggedIn()){
      $('#item-id').val($item.data('item-id'));
      resetPrice();
      $('#game-account-selector').prop('selectedIndex',0);
      var curr = findCurrency();
      if( parseInt(price) <= SSO.emp || curr == 'usd') {
        clearErrorMessage();
        showPurchaseButton();
      } else {
        showFailure(INSUFFICENT_FUNDS_MESSAGE);
        hidePurchaseButton();
      }
    }

    $('#foundation-modal').reveal({close: modal.close });
    _gaq.push(['_trackEvent', 'Purchase Funnels', 'View Product Modal', name]);
  });

  $('.close-modal').click(function (e) {
    e.preventDefault();
    $('.reveal-modal').trigger('reveal:close');
  });

  $('#buy-form-submit').click(function (e) {
    e.preventDefault();
    $('#purchase-item').submit();
  });

  $('#game-account-selector').change(function () {
    resetPrice();
  });

  $('#purchase-item').submit(function(e){
    e.preventDefault();
    var submitButton = $(this),
        itemId = $('#item-id').val(),
        currency = findCurrency();

    if(currency == 'usd'){
      alert("send to paypal!");
      return;
    }

    if(submitButton.hasClass('processing-transaction')) {
      return;
    }
    if( $('#game-account-selector').val() == 0 ) {
      showFailure('value.invalid.externalIdentityId');
      return;
    }
    submitButton.addClass('processing-transaction');
    $('#foundation-modal').find('a[class*=close]').hide();
    submitButton.find('.button-secondary').html('<span class="loading"></span> Processing...')

    $.post("/tera/buy-item", submitButton.serialize(), function(data){
      var parsedData = $.parseJSON(data);
      if(parsedData.error) {
        showFailure(parsedData.message);
        if(parsedData.reload_watcher){
          modal.reloadWatch();
        }
      } else if(parsedData.transaction_id) {
        showSuccess(parsedData, itemId);
      }
      submitButton.removeClass('processing-transaction');
    });
  });

  function findPrice() {
    if($item.find('.elite-price').text()){
      var accountSelector = ($('#game-account-selector option:selected').length == 0 ? $('#game-account-selector') : $('#game-account-selector option:selected'));
      if (accountSelector.data('elite')) {
        return $item.find('.elite-price').text();
      }
    }
    return $item.find('.price').text();
  }
  
  function findCurrency() {
    if($item.find('.elite-price').text()){
      var accountSelector = ($('#game-account-selector option:selected').length == 0 ? $('#game-account-selector') : $('#game-account-selector option:selected'));
      if (accountSelector.data('elite')) {
        return $item.find('.elite-price').data('currency');
      }
    }
    return $item.find('.price').data('currency');
  }

  function resetPrice() {
    price = findPrice();
    var currency = findCurrency();
    var icon;
    if(currency == "usd"){
      icon = '<span class="usd-icon medium">$</span>'
    } else {
      icon = '<span class="emp-icon medium"></span>'
    }
    $('#item-price').val(price);
    $('#buy-form-submit').html('Buy for PC ' + icon + price);
  }

  function showPurchaseButton() {
    $('#purchase-item').show();
  }

  function hidePurchaseButton() {
    $('#purchase-item').hide();
  }

  function showSuccess (data, itemId) {
    var product_name = $('#foundation-modal.open .title-bar-dark').text();
    $('#success-modal .item-image').css('background-image', $('#foundation-modal .item-image').css('background-image'));

    if (!!itemId.match(/^winterishere/)) {
      $('#success-modal .item-message').hide();
      $('#success-modal .gift-message').show();
    }
    /* 5th anniversary - no one knows where to enter this? */
    if (!!itemId.match(/^anniversaryishere/)) {
      $('#success-modal .item-message').hide();
      $('#success-modal .anni-gift-message').show();
    }
    $('#success-modal .item-name').text(product_name);
    
    $('#success-modal .trx-number').text(data.transaction_id);
    $('#success-modal .receipt-price').text(data.price);
    $('.cash').text(parseInt($('.cash').text()) - parseInt(data.price));
    $('#success-modal').reveal();

    _gaq.push(['_trackEvent', 'Purchase Funnels', 'Purchase Product', product_name, data.price]);
  }

  function showFailure (message) {
    if (message == "You do not have enough EMP for this purchase.  Please buy EMP and try again.") {
      $('#error-message').html(INSUFFICENT_FUNDS_MESSAGE);
    } else if(message.includes('3102-Exceeded')) {
        var item_name = $('#foundation-modal #itemName').text() || 'this item';
        var insuff = '<h3>Purchase Maximum Reached</h3> <p>You have reached the maximum number of purchases for <b>' + item_name + '</b>. You are not able to purchase any more of <b>' + item_name + '</b>.</p>';
        $('#error-message').html(insuff);
    } else if (message == 'value.invalid.externalIdentityId') {
      $('#error-message').html('Please select the game account to which you want to send this item.');
    } else {
      $('#error-message').html(message);
    }


    resetPrice();
    $('#modal-error').show();
  }

  function clearErrorMessage() {
    $('#error-message').html('');
    $('#modal-error').hide();
  }
};

var Modal = function(){
  var goBack = false;
  var repop = false;
  this.repopping = function(){
    var repopWas = repop;
    repop = false;
    return repopWas;
  }
  this.repop = function () {
    if(document.location.hash !== undefined && document.location.hash !== '') {
      repop = true;
      var hash = document.location.hash.substr(1);
      //document.location.hash = "";
      //document.location.hash = hash;
      $('.item[data-item-id='+hash+']').find('.checkout').click();
      modal.repopMessage();
    }
  };
  this.pop = function(hash){
    if(repop){
      repop = false;
    } else {
      goBack = true;
      document.location.hash = hash;
    }
    $('.modal-id').val(hash);
  };
  this.close = function(){
    if(goBack) {
      goback = false;
      window.history.back();
    } else if(document.location.hash !== '') {
      document.location.hash = '';
    }
    $('.modal-id').val("");
    $('#modal-error').hide();
    $('#modal-warning').hide();
  };
  this.reloadWatch = function(){
    $.get('/tera/is-reloading', function(data){
      var json = $.parseJSON(data);
      if( json.reloading ){
        setTimeout(modal.reloadWatch, 5000);
      } else {
        $.cookie('reloader', 'pricingupdate');
        document.location.reload(true);
      }
    });
  };
  this.repopMessage = function(){
    if($.cookie("reloader") === "pricingupdate"){
      $.cookie("reloader", null);
      $('#modal-warn .warning').html("<span class='icon'></span>Pricing has been updated. You may now proceed with your purchase.");
      $('#modal-warn').show();
    }
  };
  this.message = function(mess, kind) {
    kind = kind || "error";
    $('#modal-' + kind).show().find('.' + kind).text(mess);
  };

}

$(function () {
  if ($('.checkout')) {
    modal = new Modal();
    itemModal();
  }
});
