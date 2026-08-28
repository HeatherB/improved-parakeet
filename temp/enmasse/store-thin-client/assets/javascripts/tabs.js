$(function(){
  // Global tabs
  if ($('#tabs').length) {
    // gather tab id's
    var tabs = [];
    $('#tabs').find('a').each(function(){
      tabs.push( $($(this).attr('href')) )
    })

    $('#tabs a').bind('click', function(event){
      event.preventDefault();
      $('#tabs').find('a').removeClass('active');
      $(tabs).each(function(){
        $(this).hide();
      })
      $(this).addClass('active');
      $($(this).attr('href')).addClass('active').show();
    })
  }
});
