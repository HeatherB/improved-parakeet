$('#filter-platform span').on('click', function() {
	var selectedPlat = $(this).attr('data-platform');
	var selectedLocale = $('#locale_listing').html() || 'en';
	$.get('/postsfilter_' + selectedPlat + '?locale=' + selectedLocale, function(data){
		if(data) {
			if($('#home-content #news-posts')) {
				$('#home-content #news-posts').html(data);
			}
	  		//console.log('request passed');
	  		$.get('/featuredfilter', function(data){
				if(data) {
					if($('#home-content #featured-posts')) {
						$('#home-content #featured-posts').html(data);
					}
			  		//console.log('request passed');
			 	} else {
			    	//console.log('request failed');
			  }
			});
	 	} else {
	    	//console.log('request failed');
	  }
	});
});




//category filter
$('[data-platform="all"]').on('click', function() {
	$('body').attr('data-filter', 'all');
	$('body').trigger('data-filter-change');
	$('#filter-platform span').removeClass('selected');
	$('.filter-all').addClass('selected');
});

$('[data-platform="windows"]').on('click', function() {
	$('body').attr('data-filter', 'windows');
	$('body').trigger('data-filter-change');
	$('#filter-platform span').removeClass('selected');
	$('.filter-windows').addClass('selected');
});

$('[data-platform="playstation"]').on('click', function() {
	$('body').attr('data-filter', 'playstation');
	$('body').trigger('data-filter-change');
	$('#filter-platform span').removeClass('selected');
	$('.filter-playstation').addClass('selected');

});

$('[data-platform="xbox"]').on('click', function() {
	$('body').attr('data-filter', 'xbox');
	$('body').trigger('data-filter-change');
	$('#filter-platform span').removeClass('selected');
	$('.filter-xbox').addClass('selected');
});

