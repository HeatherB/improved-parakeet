//= require vendor/velocity.min.js


var DailyDeal = {
  init: function() {
    $(".buy-item-btn").on('click', null, DailyDeal.selectDailyDeal);
    $("#buy-this-deal").on('click', null, DailyDeal.purchaseDailyDeal);
    $("#welcome-window-deals .close-modal").on('click', null, DailyDeal.closeModal);
  //  DailyDeal.setTimerAlt();
    //$("#welcome-window-deals .close-welcome").on('click', null, DailyDeal.closeWelcomeWindow);
    //$('#welcome-window-deals .buy-emp').on('click', null, DailyDeal.buyEMP);
  },
  setTimerAlt: function() {
    /* count down from a specific time every day */
    var start = new Date;
    start.setHours(10, 0, 0); // 10am

    function pad(num) {
      return ("0" + parseInt(num)).substr(-2);
    }

    function tick() {
      var now = new Date;
      if (now > start) { // too late, go to tomorrow
        start.setDate(start.getDate() + 1);
      }
      var remain = ((start - now) / 1000);
      var hh = pad((remain / 60 / 60) % 60);
      var mm = pad((remain / 60) % 60);
      var ss = pad(remain % 60);
      document.getElementById('tera-deal-hours').innerHTML = hh + ' <span class="timeLabel">HRS</span>';
      document.getElementById('tera-deal-minutes').innerHTML = mm + ' <span class="timeLabel">MINS</span>';
      document.getElementById('tera-deal-seconds').innerHTML = ss + ' <span class="timeLabel">SECS</span>';
      setTimeout(tick, 1000);
    }
    tick();
  },
  setTimer: function() {
    /* straight 24 hour counter */
    setInterval(function time(){
      var d = new Date();
      var hours = 24 - d.getHours();
      var min = 60 - d.getMinutes();
      if((min + '').length == 1){
        min = '0' + min;
      }
      var sec = 60 - d.getSeconds();
      if((sec + '').length == 1){
            sec = '0' + sec;
      }
      $('#tera-deal-hours').html(hours + ' HRS');
      $('#tera-deal-minutes').html(min + ' MINS');
      $('#tera-deal-seconds').html(sec + ' SECS');
    }, 1000);
  },
  selectDailyDeal: function(e) {
    e.preventDefault();
    var thisDeal = $(this);
    var thisDeal_game = thisDeal.data('game');
    var thisDeal_name = thisDeal.data('name');
    var thisDeal_image = thisDeal.data('image');
    var thisDeal_user = thisDeal.data('user');
    var thisDeal_price = thisDeal.data('price');
    var thisDeal_id = thisDeal.data('id');
    DailyDeal.showModal(thisDeal, thisDeal_game, thisDeal_name, thisDeal_image, thisDeal_user, thisDeal_price, thisDeal_id);
  },
  showModal: function(thisDeal, thisDeal_game, thisDeal_name, thisDeal_image, thisDeal_user, thisDeal_price, thisDeal_id) {
    $('#pur_confirm').addClass('shopping');
    $('#pur_confirm .deal-title').html(thisDeal_name);
    $('#pur_confirm .deal-img .deal-img-holder').css('background-image', 'url(' + thisDeal_image + ')');
    $('#pur_success .deal-img .deal-img-holder').css('background-image', 'url(' + thisDeal_image + ')');
    $('#pur_failed .deal-img .deal-img-holder').css('background-image', 'url(' + thisDeal_image + ')');
    $('#pur_confirm .deal-price').html(thisDeal_price);
    $('.modal #bought_item').html(thisDeal_name);
    $('#sheer').addClass('shopping');
    $('#hidden_dd_form').append('<form id="purchase_dd_item"><input type="hidden" value="' + thisDeal_user + '" id="game_account_id" name="game_account_id"><input type="hidden" value="' + thisDeal_name + '" id="dd_name" name="dd_name"><input type="hidden" value="' + thisDeal_id + '" id="item_id" name="item_id"><input type="hidden" value="' + thisDeal_price + '" id="item_price" name="item_price"></form>');
  },
  closeModal: function() {
    $('#sheer').removeClass('shopping');
    $('#pur_failed').removeClass('shopping');
    $('#pur_success').removeClass('shopping');
    $('#pur_confirm').removeClass('shopping');
    $('#pur_confirm .deal-img .deal-img-holder').empty();
    $('#pur_success .deal-img .deal-img-holder').empty();
    $('#pur_failed .deal-img .deal-img-holder').empty();
    $('#bought_item').empty();
    $('#hidden_dd_form').empty();
  },
  purchaseSucceeded: function(data) {
    $('#pur_failed').removeClass('shopping');
    $('#pur_success').addClass('shopping');
  },
  purchaseFailed: function(errorMsg) {
    $('#pur_success').removeClass('shopping');
    $('#pur_failed').addClass('shopping');

    if(errorMsg.includes('3102-Exceeded')) {
        var insuff = '<h5>Purchase Maximum Reached</h5> <p>You are not able to purchase any more of this item.</p>';
        $('#errorMsg').html(insuff);
      } else {
        $('#errorMsg').html(errorMsg);
      }
  },
  purchaseDailyDeal: function(e) {
    e.preventDefault();

    $("#buy-this-deal").attr('disabled','disabled');
    
    var form = $('#hidden_dd_form form');

    $.post("/tera/buy-item", form.serialize(), function(data) {
        var parsedData = $.parseJSON(data);
        if(parsedData) {
            if(parsedData.error) {
                DailyDeal.purchaseFailed(parsedData.message);
                $("#buy-this-deal").removeAttr('disabled','disabled');
                //DailyDeal.updateEMP();
            } else {
                DailyDeal.purchaseSucceeded(parsedData);
                DailyDeal.updateEMP();
                $("#buy-this-deal").removeAttr('disabled','disabled');
            }
        //} else {
        //    DailyDeal.purchaseFailed();
        //    DailyDeal.updateEMP();
        }
    });

  },
  updateEMP: function() {
    $.get("/account/emp/", function(data) {
      var empData = $.parseJSON(data);
      if(empData) {
        $('#welcome-emp').html(empData);
      }
    })
  }
 
};



(function(){
  window.onload = function() {
    function loadLink(id) {
      try {
        _tera_client_proxy_;
      }
      catch(err) {
        _tera_client_proxy_ = null;
      }
      if (_tera_client_proxy_) {
        _tera_client_proxy_.invoke_menu(id);
      }
    };

    function listen(e) {
      e.stopPropagation();
      $('#welcome-window-deals').unbind('click');
      $('.buy-emp').bind('click', buyEmp);
    };

    function buyEmp(e) {
      e.stopPropagation();
      $('.buy-emp').unbind('click');
      loadLink(130)
      $('#welcome-window-deals').bind('click', listen);
    };
    $('.buy-emp').bind('click', buyEmp);

    function buyEliteStatus(e) {
      e.stopPropagation();
      $('.buy-elite-status').unbind('click');
      loadLink(140)
      $('#welcome-window-deals').bind('click', listen);
    };
    $('.buy-elite-status').bind('click', buyEliteStatus);
  };
})();






$(document).ready(function() {
  DailyDeal.init();
});