//tracking embed snippet is in layout.html
$('#homepage_download').on('click', function(e) {
	ga('send', 'event', 'EnMasse Homepage', 'Click Launcher Download button', {'nonInteraction': 1});
});

// track footer socials interaction
$('#social-ankle .social a').on('click', function(e) {
	var thisSocialProperty = $(this).parent().attr('class');
	if(thisSocialProperty) {
		// GA tracking
		ga('send', 'event', 'EnMasse Homepage Social Links', 'Clicked Offsite Link', thisSocialProperty, {'nonInteraction': 1});
	}
});

// gamepage trailer links
$('.game-pages #hero .action a').on('click', function(e) {
	var gamepage = $('.game-pages').attr('id');
	var heroAnchor = $(this).attr('href');
	// GA tracking
	ga('send', 'event', 'EnMasse ' + gamepage, 'Clicked Hero button', heroAnchor, {'nonInteraction': 1});
});

// game developer links
$('.attribution a').on('click', function(e) {
	var gamedevpage = $(this).html();
	var heroAnchor = $(this).attr('href');
	// GA tracking
	ga('send', 'event', 'EnMasse website', 'Clicked Developer Link ' + gamedevpage, heroAnchor, {'nonInteraction': 1});
});

// dark crystal quiz
$('#start_dc_quiz').on('click', function(e) {
	// GA tracking
	ga('send', 'event', 'EnMasse website Dark Crystal Job Quiz', 'Clicked Start Quiz ', {'nonInteraction': 1});
});
$('#quiz #move_on').on('click', function(e) {
	var quizquestion = $('#question_section').attr('data-question');
	// GA tracking
	ga('send', 'event', 'EnMasse website Dark Crystal Job Quiz', 'Got Question No ' + quizquestion, {'nonInteraction': 1});
});
$('body').on('click', '#dc_job_quiz #share_facebook a', function(e) {
	// GA tracking
	ga('send', 'event', 'EnMasse website Dark Crystal Job Quiz', 'Shared to Facebook ', {'nonInteraction': 1});
});
$('body').on('click', '#dc_job_quiz #share_instagram a', function(e) {
	// GA tracking
	ga('send', 'event', 'EnMasse website Dark Crystal Job Quiz', 'Shared to Instagram ', {'nonInteraction': 1});
});
$('body').on('click', '#dc_job_quiz a#share_twitter', function(e) {
	// GA tracking
	ga('send', 'event', 'EnMasse website Dark Crystal Job Quiz', 'Shared to Twitter ', {'nonInteraction': 1});
});
$('body').on('click', '#quiz_prepurchase', function(e) {
	// GA tracking
	ga('send', 'event', 'EnMasse website Dark Crystal Job Quiz', 'Went to PrePurchase ', {'nonInteraction': 1});
});


/* exmaple */
/* ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]); */
/* ga('send', 'event', 'TERA in-game shop', 'Click Confirm Purchase', EME.selectedItem.name, {'nonInteraction': 1}); */