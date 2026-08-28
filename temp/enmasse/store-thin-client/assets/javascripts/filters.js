function filterCheck(){
  var race = $('#race').val(),
      clas = $('#class').val(),
      dur = $('#duration').val();

  if (race != 'all' || clas != 'all' || dur != 'all') {
    $('#filter-reset').show();
  } else {
    $('#filter-reset').hide();
  }
}

function closeFilters(){
  $('html').unbind('click').bind('click', function(){
    $(".filters").removeClass('open').addClass('closed');
    $('html').unbind('click');
  })
}

function openFilters(){
  $(".filters").removeClass('closed').addClass('open');
  $('html').unbind('click').bind('click', function(){
    closeFilters();
  })
}

$(document).ready(function(){
  if ( $('.filters') ) {
    $('#filter-reset').hide();
    filterCheck();
    $('.filters select').change(function(){
      filterCheck();
    });

    $('.filters #filter-reset').bind('click', function(e){
      e.preventDefault();
      $('.filters select').val(0);
      $('.filters form').submit();
    });

    $(".filter-trigger").bind('click', function(e) {
      ( $('.filters').hasClass('closed') ) ? openFilters() : closeFilters();
    });
    $(".filter-wrapper").bind('click', function(e){
      e.stopPropagation();
    });

    $('select#class').change(function(){
      if ($(this).val() == 'reaper'){
        $('select#race').val('elin');
      }
    });
    $('select#race').change(function(){
      if ( $(this).val() != 'elin' && ($('select#class').val() == 'reaper' || $('select#class').val() == 'ninja' ) ) {
        $('select#class').val('all');
      }
    });
  }
});