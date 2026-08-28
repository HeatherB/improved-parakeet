function closeNav() {
	$('body').removeClass('menuopen');
};

$('#mobile-nav-btn').on('click', function() {
	$('body').toggleClass('menuopen');
});

if($('body.menuopen')) {
	$('main').on('click', closeNav);
}