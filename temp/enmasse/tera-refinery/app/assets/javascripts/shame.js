$(document).ready(function() {
	// Finds all the divs with a class of video and adds a click handler to them
	$('.video-overlay ').on('click', '.overlay', function(e) {
		// Hide the sibling elements of the iframe. In this case, we are hiding the overlay divs
	    var player = $(this).hide().siblings('iframe');
		// pull the data-url attribute and shove it in the iframes soure. This
		// will cause the video to start playing when the overlay is clicked
		if (player.attr('data-url')) {
			player.attr('src', player.data('url'));
		}
	});


	// Add a click handler to the labels in the accordion so they will toggle a checked
	// class on the inputs and articles - fix for IE8 problems with sibling selectors
	$('.accordion label').on("click",function(){
		// check if items are checked
		var checked = $(this).siblings('input').is(":checked");
		if (checked) {
	    	$(this).siblings('input, article').removeClass('checked');
	    } else {
	    	$(this).siblings('input, article').addClass('checked');
	    }
	})

	// Find the matching page in the accordion menu and highlight it
	var filename = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
	if (filename.indexOf("?") > -1) {
		filename = filename.substr(0, filename.indexOf("?"));
	}
	if (filename.indexOf('#') == -1 && $('.accordion').length) {
	  $('.accordion a[href$=' + filename + ']').addClass('selected');
	}

	// Wanring for <= IE7 users
	if ($.browser.msie && $.browser.version <= 7.0) {
    $('.site-alert').prepend('<div class="error"><article><span class="icon"></span>We no longer support this browser. For the best experience, please upgrade your browser.</article></div>')
  }
});


//  Home page video
window.onload = function() {
  if ( document.getElementById('home-video') ) {
    $('#home-video').append('<video autoplay poster="/assets/homepage_video.jpg" id="bgvid" loop><source src="//download.enmasse.com/videos/tera/tera_homepage.mp4" type="video/mp4"><source src="//download.enmasse.com/videos/tera/tera_homepage.webm" type="video/webm"></video>');
  }
  // what is tera video
  if ( document.getElementById('what-is-tera') ) {
    $('.combat .hero-video').append('<video autoplay poster="/assets/what-is-tera/backsplash.jpg" id="teravid" loop><source src="//download.enmasse.com/videos/tera/ActionCombat_V2.mp4" type="video/mp4"><source src="//download.enmasse.com/videos/tera/tera_homepage.webm" type="video/webm"></video>');
  }
}