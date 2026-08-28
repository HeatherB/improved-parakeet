//$(function() {
//
//  var verify = $(JST['templates/sitewide-age-gate']());
//  var failed = $(JST['templates/sitewide-age-gate-failed']());
//
//  if ($.cookie('of_age') == 'false') {
//    $('#page_container').replaceWith(verify);
//    checkAgeFailed();
//  } else if ($.cookie('of_age') == undefined) {
//    checkAge();
//  }
//
//  function between (num, min, max) {
//    return (typeof num == 'number' && num <= max && num >= min);
//  }
//
//  function checkAge() {
//
//    verify.appendTo('body');
//    $('#page_container').hide();
//
//    verify.find('form').submit(function (e) {
//      e.preventDefault();
//
//      var month = parseInt($(this).find('[name=mm]').val(), 10) - 1;
//      var year = parseInt($(this).find('[name=yyyy]').val(), 10) + 17;
//      var date = parseInt($(this).find('[name=dd]').val(), 10);
//
//      var doa = new Date(year, month, date);
//      of_age = doa <= (new Date());
//
//      if(of_age) {
//        $.cookie('of_age', true, {expires: 365, path: '/'});
//          $('#page_container').show();
//          verify.fadeOut('slow');
//      } else {
//        $.cookie('of_age', false, {expires: 1, path: '/'});
//        checkAgeFailed();
//      }
//    });
//  };
//
//  function checkAgeFailed() {
//    verify.find('.age-gate-form').replaceWith(failed);
//  }
//});