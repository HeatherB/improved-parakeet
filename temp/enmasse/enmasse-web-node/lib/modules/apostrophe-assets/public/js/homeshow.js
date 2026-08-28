if($('#hero.home-page').length > 0) {


	var homePageSlides = {
		slapSomeSlidesTogether: function(toSlide) {
			for(i = 0; i < toSlide.length; i++) {
				// alteration to get around builtin apostrophe slideshow
				//var selectedImg = $(toSlide[i]).find('img').first();
				//var selectedImgSrc = $(toSlide[i]).find('img').attr('src');
				var selectedImg = $(toSlide[i]).find('.imgpath')
				var selectedImgSrc = $(toSlide[i]).find('.imgpath').data('src');
				var selectedImgSrcLeftColor = $(toSlide[i]).find('.imgpath').data('leftcolor');
				var selectedImgSrcRightColor = $(toSlide[i]).find('.imgpath').data('rightcolor');
				//var selectedImgPath = selectedImg.data('src');
	
				var selectedVid = $(toSlide[i]).find('video').first();
				var selectedVidPoster = $(toSlide[i]).find('video').attr('poster');
	
				/*if(selectedImgPath) {
					if(window.outerWidth > 1000) {
						$(selectedImg).attr("src",selectedImgPath + '/topslot.jpg');
					} else {
						$(selectedImg).attr("src",selectedImgPath + '/list.jpg');
					}
				}*/
	
				selectedImg.remove();
	
				if(selectedVidPoster) {
					$(toSlide[i]).wrap("<div class='home_slide plusvid' data-homeslide='home_slide_" + i + "' style='background-image: url(" + selectedVidPoster + ")'>");
					// $('#home-video').append('<video autoplay poster="/assets/homepage_video.jpg" id="bgvid" loop><source src="//download.enmasse.com/videos/tera/tera_homepage.mp4" type="video/mp4"><source src="//download.enmasse.com/videos/tera/tera_homepage.webm" type="video/webm"></video>');
					//$('main').append('<video playsinline autoplay muted loop poster="https://eme02.enmasse-game.com/images/closers/bai/bgs/hero_out.jpg" id="bgvid"><source src="//eme02.enmasse-game.com/images/closers/bai/video/Background_video.mp4" type="video/mp4"><source src="//eme02.enmasse-game.com/images/closers/bai/video/Background_video.webm" type="video/webm"></video>');
				   // $('main').addClass('plusvid');
				} else if(selectedImgSrc) {
					$(toSlide[i]).wrap("<div class='home_slide' data-leftcolor='" + selectedImgSrcLeftColor + "' data-rightcolor='" + selectedImgSrcRightColor + "' data-homeslide='home_slide_" + i + "' style='background-image: url(" + selectedImgSrc + ")'>");
				}
			}
			$('.home_slide').first().addClass('active');
		},
	
		buildNav: function(toSlide) {
			//console.log('allow navigation');
			var homeNavBlock = '<div id="home_slide_nav"><button id="home_slide_prev"></button><button id="home_slide_next"></button></div>';
			$('#slider_hero').append(homeNavBlock);
			$('#home_slide_next').on('click', homePageSlides.clickNext);
			$('#home_slide_prev').on('click', homePageSlides.clickPrev);
		},
	
		buildPagers: function(toSlide) {
			//console.log('allow pagers');
			var homePagerBlock = '<div class="home_slide_pagers">';
			for(i = 0; i < toSlide.length; i++) {
				homePagerBlock += '<span id="home_slide_' + i + '"></span>';
			};
			homePagerBlock += "</div>";
			$('#slider_hero').append(homePagerBlock);
			$('.home_slide_pagers span').first().addClass('active');
		},

		buildMobileButton: function() {
			var mobileButtonBlock = '<div id="home_slide_mobile_button_container" class="action">';
			mobileButtonBlock += '<a class="btn" href="#"><span>Read More</span></a>';
			mobileButtonBlock += '</div>';
			$('#slider_hero').append(mobileButtonBlock);
		},
	
		rotateSlides: function() {
			var homeGallery = $('#slider_hero.home_slides');
	
			$(homeGallery).on('mouseenter', function() {
			  clearInterval(homePageSlides.homeInterval);
			});
	
			$(homeGallery).on('mouseleave', function() {
			  homeInterval = setInterval(homePageSlides.autoRotate, 7000);
			});
		},
	
		autoRotate: function() {
			$('#slider_hero.home_slides').find($('#home_slide_next')).trigger('click');
		},
	
		checkForSlides: function(slideBundle) {	
			if(slideBundle.length > 1) {
				$('#slider_hero').addClass('home_slides');
				homePageSlides.slapSomeSlidesTogether(slideBundle);
				homePageSlides.buildNav(slideBundle);
				homePageSlides.buildMobileButton();
				homePageSlides.buildPagers(slideBundle);
			} else {
				$('#slider_hero').addClass('no_slides').addClass('home_slides');
				homePageSlides.slapSomeSlidesTogether(slideBundle);
			}
		},
		clickPrev: function() {
			var theSlides = $('.home_slide');
			theSlides = Array.from(theSlides);
			var root = document.getElementsByTagName('html')[0];
			/* reset the scripted styling */
			$(".home_slide").removeClass('leaving');
			$('.home_slide.active .copy_wrap').removeClass('loaded');
			$(".home_slide").css({left:"", opacity: ""});
			//$('.home_slide_pagers span').removeClass('paused');
	
			var currentSlide = $('.home_slide.active');
			var currentPager = $('.home_slide_pagers span.active');
	
			if(currentSlide) {
				//currentSlide.removeClass('active').removeClass('next').removeClass('prev').addClass('leaving');
				currentSlide.removeClass('active').addClass('leaving');
				currentPager.removeClass('active');
	
				var slideIndex = currentSlide.attr('data-homeslide');
				slideIndex = slideIndex.split("_");
				
				if(parseInt(slideIndex[2] + 1) < theSlides.length) {
					//$('.home_slide').last().addClass('active').addClass('prev');
					$('.home_slide').last().addClass('active');
					$('.home_slide_pagers span').last().addClass('active');
	
					var dupHeroPrev = $('.home_slide').last().css('background-image');
					root.style.setProperty("--main-bg-hero", dupHeroPrev);
	
				//	var dupHeroPrevColorLeft = $('.home_slide').last().attr('data-leftcolor');
				//	root.style.setProperty("--main-bg-hero-color-left", dupHeroPrevColorLeft);
	
				//	var dupHeroPrevColorRight = $('.home_slide').last().attr('data-rightcolor');
				//	root.style.setProperty("--main-bg-hero-color-right", dupHeroPrevColorRight);
	
					// new part 
					var dupHeroPrevColorLeft = $('.home_slide').last().attr('data-leftcolor');
					var dupHeroPrevColorLeftFade = homePageSlides.convertColors(dupHeroPrevColorLeft);
						dupHeroPrevColorLeftFade = 'rgba(' + dupHeroPrevColorLeftFade['r'] + ',' + dupHeroPrevColorLeftFade['g'] + ',' + dupHeroPrevColorLeftFade['b'] + ',0)';
	
					root.style.setProperty("--main-bg-hero-color-left", dupHeroPrevColorLeft);
					root.style.setProperty("--main-bg-hero-color-left-fade", dupHeroPrevColorLeftFade);
	
					var dupHeroPrevColorRight = $('.home_slide').last().attr('data-rightcolor');
					var dupHeroPrevColorRightFade = homePageSlides.convertColors(dupHeroPrevColorRight);
						dupHeroPrevColorRightFade = 'rgba(' + dupHeroPrevColorRightFade['r'] + ',' + dupHeroPrevColorRightFade['g'] + ',' + dupHeroPrevColorRightFade['b'] + ',0)';
					
					root.style.setProperty("--main-bg-hero-color-right", dupHeroPrevColorRight);
					root.style.setProperty("--main-bg-hero-color-right-fade", dupHeroPrevColorRightFade);
					// end new part

					// bind CTA to mobile button
					var btn = $('.home_slide').last().find('.btn');
					var btn_span = btn.find('span');

					$('#home_slide_mobile_button_container .btn').attr('href', btn.attr('href') );
					$('#home_slide_mobile_button_container .btn span').text( btn_span.text() );
	
					$('.home_slide').last().css({left:-50, opacity: 0}).animate({
						"left":"0px", "opacity":"1"
					}, {
						duration: 750,
						complete: function() {
							// animation complete
							$('.home_slide.active .copy_wrap').addClass('loaded');
						}
					}); /// end animate
				} else {
					//currentSlide.prevAll('.home_slide:first').addClass('active').addClass('prev');
					var prev_slide = currentSlide.prevAll('.home_slide:first');
					prev_slide.addClass('active');
					currentPager.prevAll('.home_slide_pagers span:first').addClass('active');
	
					var dupHeroPrev = prev_slide.css('background-image');
					root.style.setProperty("--main-bg-hero", dupHeroPrev);
	
				//	var dupHeroPrevColorLeft = prev_slide.attr('data-leftcolor');
				//	root.style.setProperty("--main-bg-hero-color-left", dupHeroPrevColorLeft);
	
				//	var dupHeroPrevColorRight = prev_slide.attr('data-rightcolor');
				//	root.style.setProperty("--main-bg-hero-color-right", dupHeroPrevColorRight);
	
					// new part 
					var dupHeroPrevColorLeft = prev_slide.attr('data-leftcolor');
					var dupHeroPrevColorLeftFade = homePageSlides.convertColors(dupHeroPrevColorLeft);
						dupHeroPrevColorLeftFade = 'rgba(' + dupHeroPrevColorLeftFade['r'] + ',' + dupHeroPrevColorLeftFade['g'] + ',' + dupHeroPrevColorLeftFade['b'] + ',0)';
	
					root.style.setProperty("--main-bg-hero-color-left", dupHeroPrevColorLeft);
					root.style.setProperty("--main-bg-hero-color-left-fade", dupHeroPrevColorLeftFade);
	
					var dupHeroPrevColorRight = prev_slide.attr('data-rightcolor');
					var dupHeroPrevColorRightFade = homePageSlides.convertColors(dupHeroPrevColorRight);
						dupHeroPrevColorRightFade = 'rgba(' + dupHeroPrevColorRightFade['r'] + ',' + dupHeroPrevColorRightFade['g'] + ',' + dupHeroPrevColorRightFade['b'] + ',0)';
					
					root.style.setProperty("--main-bg-hero-color-right", dupHeroPrevColorRight);
					root.style.setProperty("--main-bg-hero-color-right-fade", dupHeroPrevColorRightFade);
					// end new part

					// bind CTA to mobile button
					var btn = prev_slide.find('.btn');
					var btn_span = btn.find('span');

					$('#home_slide_mobile_button_container .btn').attr('href', btn.attr('href') );
					$('#home_slide_mobile_button_container .btn span').text( btn_span.text() );
	
					prev_slide.css({left:-50, opacity: 0}).animate({
						"left":"0px", "opacity":"1"
					}, {
						duration: 750,
						complete: function() {
							// animation complete
							$('.home_slide.active .copy_wrap').addClass('loaded');
						}
					}); /// end animate
				}
			} else {
				return;
			}
		},
	
		clickNext: function() {
			var theSlides = $('.home_slide');
			theSlides = Array.from(theSlides);
			var root = document.getElementsByTagName('html')[0];
			/* reset the scripted styling */
				$(".home_slide").removeClass('leaving');
				$('.home_slide.active .copy_wrap').removeClass('loaded');
				$(".home_slide").css({left:"", opacity: ""});
				//$('.home_slide_pagers span').removeClass('paused');
	
				var currentSlide = $('.home_slide.active');
				var currentPager = $('.home_slide_pagers span.active');
	
				if(currentSlide) {
					//currentSlide.removeClass('active').removeClass('next').removeClass('prev').addClass('leaving');
					currentSlide.removeClass('active').addClass('leaving');
					currentPager.removeClass('active');
				
					var slideIndex = currentSlide.attr('data-homeslide');
					slideIndex = slideIndex.split("_");
	
					if(parseInt(slideIndex[2]) + 1 >= theSlides.length) {
						//$('.home_slide').first().addClass('active').addClass('next');
						$('.home_slide').first().addClass('active');
						$('.home_slide_pagers span').first().addClass('active');
						
						var dupHeroNext = $('.home_slide').first().css('background-image');
						root.style.setProperty("--main-bg-hero", dupHeroNext);
	
						/*var dupHeroNextColorLeft = $('.home_slide').first().attr('data-leftcolor');
						root.style.setProperty("--main-bg-hero-color-left", dupHeroNextColorLeft);
	
						var dupHeroNextColorRight = $('.home_slide').first().attr('data-rightcolor');
						root.style.setProperty("--main-bg-hero-color-right", dupHeroNextColorRight);*/
	
	
						// new part 
						var dupHeroNextColorLeft = $('.home_slide').first().attr('data-leftcolor');
						var dupHeroNextColorLeftFade = homePageSlides.convertColors(dupHeroNextColorLeft);
							dupHeroNextColorLeftFade = 'rgba(' + dupHeroNextColorLeftFade['r'] + ',' + dupHeroNextColorLeftFade['g'] + ',' + dupHeroNextColorLeftFade['b'] + ',0)';
	
						root.style.setProperty("--main-bg-hero-color-left", dupHeroNextColorLeft);
						root.style.setProperty("--main-bg-hero-color-left-fade", dupHeroNextColorLeftFade);
	
						var dupHeroNextColorRight = $('.home_slide').first().attr('data-rightcolor');
						var dupHeroNextColorRightFade = homePageSlides.convertColors(dupHeroNextColorRight);
							dupHeroNextColorRightFade = 'rgba(' + dupHeroNextColorRightFade['r'] + ',' + dupHeroNextColorRightFade['g'] + ',' + dupHeroNextColorRightFade['b'] + ',0)';
						
						root.style.setProperty("--main-bg-hero-color-right", dupHeroNextColorRight);
						root.style.setProperty("--main-bg-hero-color-right-fade", dupHeroNextColorRightFade);
						// end new part
	
						// bind CTA to mobile button
						var btn = $('.home_slide').first().find('.btn');
						var btn_span = btn.find('span');

						$('#home_slide_mobile_button_container .btn').attr('href', btn.attr('href') );
						$('#home_slide_mobile_button_container .btn span').text( btn_span.text() );
	
						$('.home_slide').first().css({"left":"50px", "opacity":"0"}).animate({
							"left":"0px", "opacity":"1"
						}, {
							duration: 750,
							complete: function() {
								// animation complete
								$('.home_slide.active .copy_wrap').addClass('loaded');
							}
						}); /// end animate
					} else {
						//currentSlide.siblings(".home_slide").eq(parseInt(slideIndex[2])).addClass('active').addClass('next');
						var next_slide = currentSlide.siblings(".home_slide").eq(parseInt(slideIndex[2]));
						next_slide.addClass('active');
						currentPager.siblings(".home_slide_pagers span").eq(parseInt(slideIndex[2])).addClass('active');
	
						var dupHeroNext = next_slide.css('background-image');
						root.style.setProperty("--main-bg-hero", dupHeroNext);
	
						/*var dupHeroNextColorLeft = next_slide.attr('data-leftcolor');
						root.style.setProperty("--main-bg-hero-color-left", dupHeroNextColorLeft);
	
						var dupHeroNextColorRight = next_slide.attr('data-rightcolor');
						root.style.setProperty("--main-bg-hero-color-right", dupHeroNextColorRight);*/
	
	
						// new part 
						var dupHeroNextColorLeft = next_slide.attr('data-leftcolor');
						var dupHeroNextColorLeftFade = homePageSlides.convertColors(dupHeroNextColorLeft);
							dupHeroNextColorLeftFade = 'rgba(' + dupHeroNextColorLeftFade['r'] + ',' + dupHeroNextColorLeftFade['g'] + ',' + dupHeroNextColorLeftFade['b'] + ',0)';
	
						root.style.setProperty("--main-bg-hero-color-left", dupHeroNextColorLeft);
						root.style.setProperty("--main-bg-hero-color-left-fade", dupHeroNextColorLeftFade);
	
						var dupHeroNextColorRight = next_slide.attr('data-rightcolor');
						var dupHeroNextColorRightFade = homePageSlides.convertColors(dupHeroNextColorRight);
							dupHeroNextColorRightFade = 'rgba(' + dupHeroNextColorRightFade['r'] + ',' + dupHeroNextColorRightFade['g'] + ',' + dupHeroNextColorRightFade['b'] + ',0)';
						
						root.style.setProperty("--main-bg-hero-color-right", dupHeroNextColorRight);
						root.style.setProperty("--main-bg-hero-color-right-fade", dupHeroNextColorRightFade);
						// end new part


						// bind CTA to mobile button
						var btn = next_slide.find('.btn');
						var btn_span = btn.find('span');

						$('#home_slide_mobile_button_container .btn').attr('href', btn.attr('href') );
						$('#home_slide_mobile_button_container .btn span').text( btn_span.text() );
	
						next_slide.css({"left":"50px", "opacity":"0"}).animate({
							"left":"0px", "opacity":"1"
						}, {
							duration: 750,
							complete: function() {
								// animation complete
								$('.home_slide.active .copy_wrap').addClass('loaded');
							}
						}); /// end animate
	
	
						
		
					}
	
				} else {
					return;
				}
		},
	
		filterSlides: function() {
			/*var slidesToFilter = $('#slider_hero').children();*/
			/* alteration for builtin apostrophe cms slideshow */
			var slidesToFilter = $('#slider_hero').find('.inner');
	
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
			if($('#slider_hero.home_slides')) {
				$('#home_slide_nav').empty().remove();
				$('.home_slide_pagers').empty().remove();
				$('.home_slide').replaceWith(function () {
					return this.childNodes;
				});
			}
			homePageSlides.filterSlides();
		},
	
		convertColors: function(convertThisColor) {
			var colorToConvert = convertThisColor  || '#0a1528';
	
			var convertedColor = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorToConvert);
				  return convertedColor ? { 
					r: parseInt(convertedColor[1], 16),
					g: parseInt(convertedColor[2], 16),
					b: parseInt(convertedColor[3], 16)
				  } : null;
			
		},
	
		setFirstLoad: function() {
			$('.home_slide.active').show();
			var root = document.getElementsByTagName('html')[0];
			var dupHero = $('.home_slide.active').css('background-image');
			root.style.setProperty("--main-bg-hero", dupHero);
	
			var dupHeroColorLeft = $('.home_slide.active').attr('data-leftcolor');
			var dupHeroColorLeftFade = homePageSlides.convertColors(dupHeroColorLeft);
				dupHeroColorLeftFade = 'rgba(' + dupHeroColorLeftFade['r'] + ',' + dupHeroColorLeftFade['g'] + ',' + dupHeroColorLeftFade['b'] + ',0)';
	
			root.style.setProperty("--main-bg-hero-color-left", dupHeroColorLeft);
			root.style.setProperty("--main-bg-hero-color-left-fade", dupHeroColorLeftFade);
	
			var dupHeroColorRight = $('.home_slide.active').attr('data-rightcolor');
			var dupHeroColorRightFade = homePageSlides.convertColors(dupHeroColorRight);
				dupHeroColorRightFade = 'rgba(' + dupHeroColorRightFade['r'] + ',' + dupHeroColorRightFade['g'] + ',' + dupHeroColorRightFade['b'] + ',0)';
			
			root.style.setProperty("--main-bg-hero-color-right", dupHeroColorRight);
			root.style.setProperty("--main-bg-hero-color-right-fade", dupHeroColorRightFade);

			// bind CTA to mobile button
			var btn = $('.home_slide.active').find('.btn');
			var btn_span = btn.find('span');

			$('#home_slide_mobile_button_container .btn').attr('href', btn.attr('href') );
			$('#home_slide_mobile_button_container .btn span').text( btn_span.text() );
	
	
			firstLoadInterval = setInterval(function() {
			// off for dev
				$('.home_slide.active .copy_wrap').addClass('loaded');
			}, 750);
		},
	
		  delay: (function(){
			var timer = 0;
			return function(callback, ms){
			  clearTimeout (timer);
			  timer = setTimeout(callback, ms);
			};
		  })()
	};
	
		homeInterval = setInterval(function() {
			// off for dev
		  homePageSlides.autoRotate();
		}, 7000);
	
	
		$('body').on('click', '.home_slide_pagers span', function() {
			var naturalLast = $('.home_slide_pagers span').length;
			var wasActivePager = $('.home_slide_pagers span.active').attr('id');
			var selectedSlideByPager = $(this).attr('id');
	
			naturalLast = naturalLast - 1;
	
			wasActivePager = wasActivePager.split("_");
			wasActivePager = wasActivePager.pop();
	
			selectedSlideByPagerInt = selectedSlideByPager.split("_");
			selectedSlideByPagerInt = selectedSlideByPagerInt.pop();
	
			if(wasActivePager == naturalLast && selectedSlideByPagerInt == 0) {
				//console.log('next');
				homePageSlides.clickNext();
			} else if(selectedSlideByPagerInt == naturalLast && wasActivePager == 0) {
				//console.log('prev');
				homePageSlides.clickPrev();
			} else if(wasActivePager > selectedSlideByPagerInt) {
				//console.log('prev');
				homePageSlides.clickPrev();
			} else if (selectedSlideByPagerInt > wasActivePager) {
				//console.log('next');
				homePageSlides.clickNext();
			} else {
				//console.log('undefined');
			}
	
	
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			//$('.home_slide').removeClass('active');
			//$('[data-homeslide="' + selectedSlideByPager + '"]').addClass('active');
		});
	
		$('body').on('data-filter-change', function() {
			homePageSlides.cleanSlides();
		});
	
	
	
	
		$(document).ready(function() {
			homePageSlides.cleanSlides();
	
			var win_outer_width = window.outerWidth;
			var endWidth = window.outerWidth;
	
			homePageSlides.setFirstLoad();
	
			/* not serving alternate images based on display size */
			/*$(window).resize(function() {
			  homePageSlides.delay(function() {
					  
				  clearInterval(homeInterval);
				  endWidth = window.outerWidth;
	
				if(win_outer_width > 1000 && endWidth < 1000) {
					//console.log('moved desktop to device, reload');
					// off for dev
					homePageSlides.cleanSlides();
					homeInterval = setInterval(homePageSlides.autoRotate, 7000);
				} else if(win_outer_width < 1000 && endWidth > 1000) {
					//console.log('moved device to desktop, reload');
					// off for dev
					homePageSlides.cleanSlides();
					homeInterval = setInterval(homePageSlides.autoRotate, 7000);
				} else {
					//console.log('didnt cross a threshold');
					// off for dev
					homeInterval = setInterval(homePageSlides.autoRotate, 7000);
				}
			  }, 400);
			  win_outer_width = endWidth;
			});*/
	
	
			$('#slider_hero.home_slides').on('mouseenter', function() {
				// off for dev
			  clearInterval(homeInterval);
			  $("#hero section.home_slides .home_slide_pagers span.active").addClass('paused');
			});
	
	
			$('#slider_hero.home_slides').on('mouseleave', function() {
				// off for dev
			  homeInterval = setInterval(homePageSlides.autoRotate, 7000);
			  $("#hero section.home_slides .home_slide_pagers span.active").removeClass('paused');
			});
		});
		
	}