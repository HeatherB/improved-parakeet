function handleSlideRightToggle(event) {
  var toggleOut = $("#" + $(this).attr("data-hide"));
  var toggleIn = $("#" + $(this).attr("data-show"));

  if (toggleOut.css("left") != "0px") return;

  toggleIn.show();
  toggleOut.animate({left:'-=790'}, 300, function() { 
    toggleOut.hide(); 
    focusInput($('#inline-signin'));
  });
  toggleIn.animate({left:'-=790'}, 300);

  event.preventDefault();
}

function handleSlideLeftToggle(event) {
  var toggleOut = $("#" + $(this).attr("data-hide"));
  var toggleIn = $("#" + $(this).attr("data-show"));

  if (toggleOut.css("left") != "0px") return;
    
  toggleIn.show();
  toggleOut.animate({left:'+=790'}, 300, function() { toggleOut.hide(); });
  toggleIn.animate({left:'+=790'}, 300);
  
  event.preventDefault();
}

function setupEvents() {
  $(document).on("click", "a.slide-left", null, handleSlideLeftToggle);
  $(document).on("click", "a.slide-right", null, handleSlideRightToggle);

  /* console form toggle */
  $(document).on('mouseenter click', '.console-select', function() {
    $(this).addClass('active');
    $('.console-select').not($(this)).removeClass('active');
    var formStyle = $(this).attr('id');
    $(this).parent().parent().attr('class', 'column_wrapper ' + formStyle);
  });

  /* reveal game toggle */
  $(document).on('click', '.game_account_bundle .nav', function() {
    $(this).closest('.game_account_bundle').toggleClass('open');
  });

  /* clear search */
  $(document).on('click', '.clearsearch', function() {
    $('#homepage-games-searchbox_results').empty();
    $('#homepage-games-searchbox').val('');
  });

  /* filter searches */
  $(document).on('click', '.selectable-filters li', function() {
    var platformfilter = $(this).data('platformfilter');
    var genrefilter = $(this).data('genrefilter');
    var typefilter = $(this).data('typefilter');
    var search_filter;
    var allResults = $('.game_tile');
    var filtertitle;

    if(platformfilter) {
      search_filter = platformfilter;
      filtertitle = $('.game_tile').find('.type_platform:not(:contains(' + platformfilter + '))');
    } else if (genrefilter) {
      search_filter = genrefilter;
      filtertitle = $('.game_tile').find('.type_genre:not(:contains(' + genrefilter + '))');
    } else if(typefilter) {
      search_filter = typefilter;
      filtertitle = $('.game_tile').find('.type_type:not(:contains(' + typefilter + '))');
    };

    /* select the non matches and set them to hide */
    $(allResults).removeClass('hidden');
    filtertitle.parent().parent().parent().parent().addClass('hidden');
    $('#filterTitle').html('Filter Results for: ' + search_filter + ' <span id="filter_clear">x clear filter</span>');
    $('#filterTitle').show();
  });

  /* clear filter */
  $(document).on('click', '#filter_clear', function() {
    var allResults = $('.game_tile');
    $(allResults).removeClass('hidden');
    $('#filterTitle').empty().hide();
  });
}


/* Boot strap */
$(function() {
  setupEvents();

  var inlineSignin = $("#inline-signin");
  if (inlineSignin.css("left") == "0px") {
    focusInput($('#inline-signin'));
  }
});