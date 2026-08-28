 /* slow scroll */
$(function() {
	$('a[href*="#"]:not([href="#"])').click(function() {
	  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	    var target = $(this.hash);
	    /* pass scrollto point from markup */
	    var target_offset = $(this).attr('data-scrolloffset');
	    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	    if (target.length) {
	      if (target_offset.length) {
	      	$('html, body').animate({
		        scrollTop: target.offset().top - target_offset
		      }, 1000);
	      } else {
	      	$('html, body').animate({
		        scrollTop: target.offset().top
		      }, 1000);
	      }

	      return false;
	    }
	  }
	});
});