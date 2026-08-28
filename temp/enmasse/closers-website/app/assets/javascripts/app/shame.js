$(document).ready(function() {
	$('#games .trigger').on('click', function() {
		$('body.home main').toggleClass('lowerZ');
	});

	// stop list items on newsposts from displaying a bullet when they contain an image
	if($('#blog_post li').length > 0) {
		$( '#blog_post li' ).has( 'img' ).addClass( "img_wrap");
	}


	$('.bundle_button').on('click', function() {
		var ebSession = '[SessionID]';
		var ebRand = Math.random()+'';
		ebRand = ebRand * 1000000;
		
		if ($('#specialscripts_wrapper').length) {
			$('#specialscripts_wrapper').empty();
			$('#specialscripts_wrapper').html('<scr'+'ipt src="HTTPS://bs.serving-sys.com/Serving/ActivityServer.bs?cn=as&amp;ActivityID=1101311&amp;rnd=' + ebRand + '&amp;Session='+ebSession+'"></scr' + 'ipt><noscript><img width="1" height="1" style="border:0" src="HTTPS://bs.serving-sys.com/Serving/ActivityServer.bs?cn=as&amp;ActivityID=1101311&amp;Session=[SessionID]&amp;ns=1"/></noscript>');
		}
		
	});
	
});


window.onload = function() {
	//  Bai page video
  if ( document.getElementById('bg-vid') && window.outerWidth >= 1024 ) {
    $('main').append('<video playsinline autoplay muted loop poster="https://eme02.enmasse-game.com/images/closers/bai/bgs/hero_out.jpg" id="bgvid"><source src="//eme02.enmasse-game.com/images/closers/bai/video/Background_video.mp4" type="video/mp4"><source src="//eme02.enmasse-game.com/images/closers/bai/video/Background_video.webm" type="video/webm"></video>');
    $('main').addClass('plusvid');
  }

  // seth Page Video
  if ( document.getElementById('seth-bg-vid') && window.outerWidth >= 1024 ) {
    /*$('main').append('<iframe id="bgvid" width="560" height="315" src="https://www.youtube.com/embed/zlGsTJOLuU0?autoplay=1&rel=0&mute=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');*/
    $('main').append('<video playsinline autoplay muted loop poster="https://eme02.enmasse-game.com/images/closers/seth-release/hero-vid-bg.jpg" id="bgvid"><source src="//eme02.enmasse-game.com/images/closers/seth-release/closers_seth_header_loop.webm" type="video/webm"></video>');
    $('main').addClass('plusvid');
  }
}

