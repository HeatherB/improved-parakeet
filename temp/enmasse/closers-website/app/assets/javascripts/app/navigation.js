var navigation = $('#navigation');
var navBtn = $('#mobile-nav-btn');
var navSpan = $('#mobile-nav-btn span');
var _body = $('body');

exposeNav = function(e) {
    e.preventDefault();
    //measureExpose();
    _body.toggleClass("mobile-nav-open");
}
navBtn.on('click', exposeNav);

measureHide = function(e) {
	var toHide = -1 * navigation.height();
	$('#main-wrap').css('top', toHide);
	$('#main-wrap').css('margin-bottom', toHide);
}

measureExpose = function(e) {
	$('#main-wrap').css('top', '0');
	$('#main-wrap').css('margin-bottom', '0');
	if ($('.mobile-nav-open').length) {
		measureHide();
	}
	_body.toggleClass("mobile-nav-open");
}

reCheckNav = function(winW) {
	if(winW >= 768) {
		$('#main-wrap').css('top', '0');
		$('#main-wrap').css('margin-bottom', '0');
	} else {
		measureHide();
	}
}

$(".nav a").on('click', function(e) {
	var node = e.target;
	if ($(node).parent().find("ul").length > 0 && $('body').hasClass("mobile-nav-open")) {
		e.preventDefault();
		$(node).parent().toggleClass("open");
	}
});


 /* slow scroll */
$(function() {
	$('a[href*="#"]:not([href="#"])').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	    var target = $(this.hash);
	    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	    if (target.length) {
	      $('html, body').animate({
	        scrollTop: target.offset().top
	      }, 1000);
	      return false;
	    }
	  }
	});
});

/* show / hide buttons on development roadmap */

$(document).ready(function() {
    $('.action .button').on("click", function(e){
      e.preventDefault();
      //console.log( $(this).closest('.roadmap_desc'));
      $(this).closest('.mapBundle').toggleClass('open');
	});
		
		if (ga) {
			
			$("#signup-btn").on("click", function() {
				ga('send', 'event', 'Navigation', 'Click Play Free Btn', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".signup-btn").on("click", function() {
				ga('send', 'event', 'Navigation', 'Click Bottom-Promo Play Free Btn', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".steam").on("click", function() {
				ga('send', 'event', 'Navigation', 'Click Steam Download Btn', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".direct").on("click", function() {
				ga('send', 'event', 'Navigation', 'Click Direct Download Btn', $(this).attr("href"), {'nonInteraction': 1});
			});
			$("#download-play-free").on("click", function() {
				ga('send', 'event', 'Navigation', 'Click Download Page Play Free Btn', $(this).attr("href"), {'nonInteraction': 1});
			});

			// footer socials
			$(".twitter").on("click", function() {
				ga('send', 'event', 'Navigation', 'Twitter Social Clicked - Footer', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".facebook").on("click", function() {
				ga('send', 'event', 'Navigation', 'Facebook Social Clicked - Footer', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".youtube").on("click", function() {
				ga('send', 'event', 'Navigation', 'YouTube Social Clicked - Footer', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".forums").on("click", function() {
				ga('send', 'event', 'Navigation', 'Forums Social Clicked - Footer', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".instagram").on("click", function() {
				ga('send', 'event', 'Navigation', 'Instagram Social Clicked - Footer', $(this).attr("href"), {'nonInteraction': 1});
			});
			$(".discord").on("click", function() {
				ga('send', 'event', 'Navigation', 'Discord Social Clicked - Footer', $(this).attr("href"), {'nonInteraction': 1});
			});

			// featured clicks
			$(".promo-btn").on("click", function() {
				ga('send', 'event', 'Navigation', 'Featured Gumball Button Clicked', $(this).attr("href"), {'nonInteraction': 1});
			});
		}
});

