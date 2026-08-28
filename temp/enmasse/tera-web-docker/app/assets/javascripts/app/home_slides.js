if($('#home-content').length > 0) {


var homePageSlides = {
	slapSomeSlidesTogether: function(toSlide) {
		//console.log('make some slides');
		for(i = 0; i < toSlide.length; i++) {
			var selectedImg = $(toSlide[i]).find('img').first();
			var selectedImgPath = selectedImg.data('src');

			if(selectedImgPath) {
				if(window.outerWidth > 1000) {
					$(selectedImg).attr("src",selectedImgPath + '/topslot.jpg');
				} else {
					$(selectedImg).attr("src",selectedImgPath + '/list.jpg');
				}
			}

			$(toSlide[i]).wrap("<div class='home_slide' data-homeslide='home_slide_" + i + "'>");
		}
		$('.home_slide').first().addClass('active');
	},

	buildNav: function(toSlide) {
		//console.log('allow navigation');
		var homeNavBlock = '<div id="home_slide_nav"><button id="home_slide_prev"></button><button id="home_slide_next"></button></div>';
		$('#content_article_header').append(homeNavBlock);
		homePageSlides.navBTNs();
	},

	buildPagers: function(toSlide) {
		//console.log('allow pagers');
		var homePagerBlock = '<div class="home_slide_pagers">';
		for(i = 0; i < toSlide.length; i++) {
			homePagerBlock += '<span id="home_slide_' + i + '"></span>';
		};
		homePagerBlock += "</div>";
		$('#content_article_header').append(homePagerBlock);
		$('.home_slide_pagers span').first().addClass('active');
		//homePageSlides.rotateSlides();
	},

	rotateSlides: function() {
		var homeGallery = $('#content_article_header.home_slides');

	    $(homeGallery).on('mouseenter', function() {
	      clearInterval(homePageSlides.homeInterval);
	    });


	    $(homeGallery).on('mouseleave', function() {
	      homeInterval = setInterval(homePageSlides.autoRotate, 7000);
	    });
	},

	autoRotate: function() {
	    $('#content_article_header.home_slides').find($('#home_slide_next')).trigger('click');
	},

	checkForSlides: function(slideBundle) {	
		$('#content_article_header').addClass('home_slides');
		homePageSlides.slapSomeSlidesTogether(slideBundle);	
		if(slideBundle.length > 1) {
			//$('#content_article_header').addClass('home_slides');
			//homePageSlides.slapSomeSlidesTogether(slideBundle);
			homePageSlides.buildNav(slideBundle);
			homePageSlides.buildPagers(slideBundle);
		}
	},

	navBTNs: function() {
		var theSlides = $('.home_slide');

		$('#home_slide_prev').on('click', function() {
			var currentSlide = $('.home_slide.active');
			var currentPager = $('.home_slide_pagers span.active');

			if(currentSlide) {
				currentSlide.removeClass('active');
				currentPager.removeClass('active');

				var slideIndex = currentSlide.attr('data-homeslide');
				slideIndex = slideIndex.split("_");	slideIndex = slideIndex.split("_");
				

				if(parseInt(slideIndex[2] + 1) < theSlides.length) {
					$('.home_slide').last().addClass('active');
					$('.home_slide_pagers span').last().addClass('active');
				} else {
					currentSlide.prevAll('.home_slide:first').addClass('active');
					currentPager.prevAll('.home_slide_pagers span:first').addClass('active');
				}
			} else {
				return;
			}

			/*currentSlide.removeClass('active');
			currentPager.removeClass('active');

			var slideIndex = currentSlide.attr('data-homeslide');
			slideIndex = slideIndex.split("_");	slideIndex = slideIndex.split("_");
			

			if(parseInt(slideIndex[2] + 1) < theSlides.length) {
				$('.home_slide').last().addClass('active');
				$('.home_slide_pagers span').last().addClass('active');
			} else {
				currentSlide.prevAll('.home_slide:first').addClass('active');
				currentPager.prevAll('.home_slide_pagers span:first').addClass('active');
			}*/
		});

		$('#home_slide_next').on('click', function() {
			var currentSlide = $('.home_slide.active');
			var currentPager = $('.home_slide_pagers span.active');

			if(currentSlide) {
				currentSlide.removeClass('active');
				currentPager.removeClass('active');

				var slideIndex = currentSlide.attr('data-homeslide');
				slideIndex = slideIndex.split("_");

				
				if(parseInt(slideIndex[2]) + 1 >= theSlides.length) {
					$('.home_slide').first().addClass('active');
					$('.home_slide_pagers span').first().addClass('active');
				} else {
					currentSlide.siblings(".home_slide").eq(parseInt(slideIndex[2])).addClass('active');
					currentPager.siblings(".home_slide_pagers span").eq(parseInt(slideIndex[2])).addClass('active');
				}
			} else {
				return;
			}

			/*currentSlide.removeClass('active');
			currentPager.removeClass('active');

			var slideIndex = currentSlide.attr('data-homeslide');
			slideIndex = slideIndex.split("_");

			
			if(parseInt(slideIndex[2]) + 1 >= theSlides.length) {
				$('.home_slide').first().addClass('active');
				$('.home_slide_pagers span').first().addClass('active');
			} else {
				currentSlide.siblings(".home_slide").eq(parseInt(slideIndex[2])).addClass('active');
				currentPager.siblings(".home_slide_pagers span").eq(parseInt(slideIndex[2])).addClass('active');
			}*/
		});
	},

	filterSlides: function() {
		var slidesToFilter = $('#content_article_header').children();
		var filterToFilter = $('body').attr('data-filter') || 'all';
		var slideBundle = [];

		if(filterToFilter == 'all') {
			for(k = 0; k < slidesToFilter.length; k++) {
				$(slidesToFilter[k]).css('display', 'block');
				slideBundle.push($(slidesToFilter[k]));
			}
			
		} else {
			for(k = 0; k < slidesToFilter.length; k++) {
			
				if($(slidesToFilter[k]).attr("data-filter-platform") == undefined) {
					console.log('please add filters to the slides');
					// pretend its the all filter
						$(slidesToFilter[k]).attr("data-filter-platform", "all");
						$(slidesToFilter[k]).css('display', 'block');
						slideBundle.push($(slidesToFilter[k]));
					
				} else {
					var slideFilters = $(slidesToFilter[k]).attr("data-filter-platform").toLowerCase().split(" ");

					if(slideFilters.indexOf(filterToFilter) !== -1) {
						// it does exist
						$(slidesToFilter[k]).css('display', 'block');
						slideBundle.push($(slidesToFilter[k]));
					} else {
						// no slide and page filter match
						$(slidesToFilter[k]).css('display', 'none');
					}
				}
			}
		}
		homePageSlides.checkForSlides(slideBundle);
	},

	cleanSlides: function() {
		if($('#content_article_header.home_slides')) {
			$('#home_slide_nav').empty().remove();
			$('.home_slide_pagers').empty().remove();
			$('.home_slide').replaceWith(function () {
			    return this.childNodes;
			});
		}
		homePageSlides.filterSlides();
	},

  	delay: (function(){
    	var timer = 0;
    	return function(callback, ms){
      	clearTimeout (timer);
      	timer = setTimeout(callback, ms);
    	};
  	})()

	/*isMobileDevice: function() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
  	},

  	mobileCheck: function() {
    	var vw = $(window).width();
    	var deviceCheck = isMobileDevice();*/
	    /* can restrict to only actual mobile devices with the device check */
	    //if(deviceCheck) {
	    //  whatever();
	    //}

	    /* can set for css mobile and tablet if wanted same behavior on devices and desktops */
	   /* if(vw <= 1000) {
	      whatever();
	    }
	}*/

};

	homeInterval = setInterval(function() {
      homePageSlides.autoRotate();
    }, 7000);


	$('body').on('click', '.home_slide_pagers span', function() {
		$(this).siblings().removeClass('active');
		$(this).addClass('active');
		var selectedSlideByPager = $(this).attr('id');
		$('.home_slide').removeClass('active');
		$('[data-homeslide="' + selectedSlideByPager + '"]').addClass('active');
	});

	$('body').on('data-filter-change', function() {
		homePageSlides.cleanSlides();
	});



	$(document).ready(function() {
		homePageSlides.cleanSlides();
		var win_outer_width = window.outerWidth;
		var endWidth = window.outerWidth;


		$(window).resize(function() {
	      homePageSlides.delay(function() {
	      		
	      	clearInterval(homeInterval);
	      	endWidth = window.outerWidth;

			if(win_outer_width > 1000 && endWidth < 1000) {
				//console.log('moved desktop to device, reload');
				homePageSlides.cleanSlides();
				homeInterval = setInterval(homePageSlides.autoRotate, 7000);
			} else if(win_outer_width < 1000 && endWidth > 1000) {
				//console.log('moved device to desktop, reload');
				homePageSlides.cleanSlides();
				homeInterval = setInterval(homePageSlides.autoRotate, 7000);
			} else {
				//console.log('didnt cross a threshold');
				homeInterval = setInterval(homePageSlides.autoRotate, 7000);
			}
	          //homePageSlides.cleanSlides();
	      }, 400);
	      win_outer_width = endWidth;
	    });


		$('#content_article_header.home_slides').on('mouseenter', function() {
	      clearInterval(homeInterval);
	    });


	    $('#content_article_header.home_slides').on('mouseleave', function() {
	      homeInterval = setInterval(homePageSlides.autoRotate, 7000);
	    });
	});
	
}