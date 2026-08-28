var mobileNav = {

	isMobileDevice: function() {
    	return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
	},

	buildNest: function() {
		/* $('#menu li').addClass('top_link');
		 $('#menu li ul').parent().removeClass('top_link').addClass('nested');

		 $('#menu li.nested').on('click', function(e) {
		 	$(this).find('ul').addClass('mobile-expose');
		 	$(this).unbind("click", mobileNav.preventDefault);
		 });
		 $('#menu li.nested').bind("click", mobileNav.preventDefault);
*/
		 // for filters search
		 $('.game-filter h6').on('click', function(e) {
		 	console.log('are you listening to me at all filters');
		 	$(this).next('ul.selectable-filters').show();
		 	$(this).unbind("click", mobileNav.preventDefault);
		 });
		 

		 $('ul.selectable-filters li').on('click', function() {
		 	$('ul.selectable-filters').hide();
		 	$('.game-filter h6').bind("click", mobileNav.preventDefault);
		 });

		 $('#filterTitle').on('click', function() {
		 	$('ul.selectable-filters').hide();
		 	$('.game-filter h6').bind("click", mobileNav.preventDefault);
		 });

		 /* account armor hover info */
		 /* finish this */
		 $('.aa-reveal').on('click', function() {
		 	$(this).toggleClass('showTip');
		 });

		 
		

	},

    preventDefault: function(e) {
	    e.preventDefault();
	},

	init: function(e) {
		var vw = $(window).width();
		var deviceCheck = mobileNav.isMobileDevice();
		/* can restrict to only actual mobile devices with the device check */
		if(deviceCheck) {
			mobileNav.buildNest();
		}

		/* can set for css mobile and tablet if wanted same behavior on devices and desktops */
		//if(vw <= 1024) {
		//	mobileNav.buildNest();
		//}
	}
};

$(document).ready(function() {
  mobileNav.init();

});