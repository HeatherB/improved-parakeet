if($('#community_streamers').length > 0) {

    $('a.showpartners').on('click', function(e) {
    	e.preventDefault();
    	/* <a href="https://www.twitch.tv/enmasseentertainment" data-streamerrows="3" class="more-btn" target="_blank">View All</a> */
    	//var streamer_rows = $(this).data('streamerrows') * 360;

    	//$(this).parent().toggleClass('full-list').css('height', streamer_rows);
    	$(this).parent().toggleClass('full-list');
      if($(this).parent().hasClass('full-list')) {
        $(this).html('View Fewer');
      } else {
        $(this).html('View All');
      }
    });

}