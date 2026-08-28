// track footer socials interaction
$('.ft-social a').on('click', function(e) {
	var thisSocialProperty = $(this).attr('class');
	if(thisSocialProperty) {
		// GA tracking
		ga('send', 'event', 'TERA Footer Social Links', 'Clicked Offsite Link', thisSocialProperty, {'nonInteraction': 1});
	}
})


// track homepage twitter and discord clicks
if($('body.home').length > 0) {
	window.addEventListener('blur',function(){
	  if(document.activeElement.id == 'twitter-widget-0'){
	    // GA tracking
		ga('send', 'event', 'TERA Homepage', 'Clicked Twitter Embedded Feed', 'opened https://twitter.com/TERAonline', {'nonInteraction': 1});
	  }
	});
	$('.twitter_feed a.more-btn').on('click', function(e) {
		// GA tracking
		ga('send', 'event', 'TERA Homepage', 'Clicked Twitter Read More Button', 'opened https://twitter.com/TERAonline', {'nonInteraction': 1});
	});
	$('a.discordBTN').on('click', function(e) {
		// GA tracking
		ga('send', 'event', 'TERA Homepage', 'Clicked Join Discord Button', 'opened https://discordapp.com/invite/EME', {'nonInteraction': 1});
	});
}