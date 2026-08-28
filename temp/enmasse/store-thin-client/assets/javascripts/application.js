$(document).ready(function(){
  // Store item menu
  $('.menu-tree .has-flyout', this).hover(function () {
    $(this).children('.flyout').show();
  }, function () {
    $(this).children('.flyout').hide();
  });

  // item attributes
  if ( $('.show-hide-trigger') ) {
    $('.show-hide-trigger').bind('click', function(){
      $(this).text( ($(this).text() == '+ More Info') ? '- Less Info' : '+ More Info' );
      $('.show-hide-content').toggleClass('showing');
    })
  };
  // Wanring for <= IE7 users
  if ($.browser.msie && $.browser.version <= 7.0) {
    $('.site-alert').prepend('<div class="error ie-alert"><span class="icon"></span>We no longer support this browser. For the best experience, please upgrade your browser.</div>')
  };


  // promo button use
  $('#change-to-promo').on('click', function(){
    $.get("/tera/elite-status/get-promo", function(data){
      //console.log(data);
      data = $.parseJSON(data);
      $( ".promo_messaging" ).html( data.message );
      $( ".promo_pricing" ).html( data.price );
      $('#promo_sucess_modal').reveal({});
    });
  });
});
