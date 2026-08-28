document.addEventListener("DOMContentLoaded", function(event) {
    var controller = new YTV('youtube-playlist', {
	   playlist: 'PLzpfNG37wb-ntcXXNT773aVy_4nP0gmrH',
	   responsive: true,
	   playerTheme: 'light',
	   listTheme: 'light'
    });

    $('a.mediaBTN').on('click', function(e) {
    	e.preventDefault();
    	$(this).parent().parent().parent().toggleClass('full-list');
      if($(this).parent().parent().parent().hasClass('full-list')) {
        $(this).parent().addClass('fewer');
        // GA Tracking
        ga('send', 'event', 'TERA Media', 'Clicked Show More', 'Game Art', {'nonInteraction': 1});
      } else {
        $(this).parent().removeClass('fewer');
      }
    });

    /*$(document).on('screenshot_grid:mytrigger', function (event) {
      console.log('Listener 1 and response is:');
      $( "#screenshot_grid" ).unwrap();
      $( "#screenshot_grid" ).removeClass().addClass('eme-lightbox');
    });*/

});
/* https://github.com/Giorgio003/Youtube-TV */