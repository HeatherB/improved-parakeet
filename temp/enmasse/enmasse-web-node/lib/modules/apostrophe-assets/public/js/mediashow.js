if($('.media-wrapper').length > 0) {


	var mediaWrapperSlides = {
		
		clickPrev: function() {
			var thisMedia = $(this).parent().parent();
			var theMedias = thisMedia.find('.wrap');

			theMedias = Array.from(theMedias);
			$( theMedias ).each(function() {
			  $( this ).removeClass('last').removeClass('first');
			});
			

			var currentMedia = thisMedia.find('.wrap.selected');

			if(currentMedia) {
				currentMedia.removeClass('selected').addClass('last');

				var mediaIndex = currentMedia.attr('data-mediaslide');
				mediaIndex = mediaIndex.split("_");
				var prevMediaCount = parseInt(mediaIndex[2]) - 1;
				var prevMedia = thisMedia.find('[data-mediaslide="media_slide_' + prevMediaCount + '"]');

				if(prevMediaCount == 0) {
					thisMedia.find('.wrap').last().addClass('first');
					thisMedia.find('.wrap').first().addClass('selected');
				}
				if(prevMediaCount == -1) {
					thisMedia.find('.wrap').last().addClass('selected');
					thisMedia.find('.wrap').last().prev().addClass('first');
				}
				
				if(prevMediaCount < theMedias.length) {
					prevMedia.addClass('selected');
					prevMedia.prev('.wrap').addClass('first');
				}
				mediaWrapperSlides.updatePG(theMedias.length, prevMediaCount);
			} else {
				return;
			}
		},

		clickNext: function() {
			var thisMedia = $(this).parent().parent();
			var theMedias = thisMedia.find('.wrap');

			theMedias = Array.from(theMedias);
			$( theMedias ).each(function() {
			  $( this ).removeClass('last').removeClass('first');
			});

			var currentMedia = thisMedia.find('.wrap.selected');

			if(currentMedia) {
				currentMedia.removeClass('selected').addClass('first');
			
				var mediaIndex = currentMedia.attr('data-mediaslide');
				mediaIndex = mediaIndex.split("_");
				var nextMediaCount = parseInt(mediaIndex[2]) + 1;
				var nextMedia = thisMedia.find('[data-mediaslide="media_slide_' + nextMediaCount + '"]');
				var nextNextMediaCount = parseInt(mediaIndex[2]) + 2;
				var nextNextMedia = thisMedia.find('[data-mediaslide="media_slide_' + nextNextMediaCount + '"]');

				if(nextMediaCount + 1 == theMedias.length) {
					thisMedia.find('.wrap').first().addClass('last');
				}
				if(nextMediaCount == theMedias.length) {
					thisMedia.find('.wrap').first().addClass('selected');
					$('[data-mediaslide="media_slide_1"]').addClass('last');
				}

				if(nextMediaCount > theMedias.length) {
					thisMedia.find('.wrap').first().addClass('selected');
					$('[data-mediaslide="media_slide_2"]').addClass('last');
				} else {
					nextMedia.addClass('selected');
					nextNextMedia.addClass('last');
				}
				mediaWrapperSlides.updatePG(theMedias.length, nextMediaCount);
			} else {
				return;
			}
		},

		initLB:function() {
			mediaWrapperSlides.makePG();
			mediaWrapperSlides.checkBTNS();
		},

		makePG:function() {
			var pagerCount = $('.media-wrapper img').length;
			var pagers = '';
			if(pagerCount > 3) {
				for(var p = 0; p < pagerCount; p++) {
					if( p === 1 ) {
						pagers += '<span class="active" data-pagercount="' + p + '">' + p + '</span>';
					} else {
						pagers += '<span data-pagercount="' + p + '">' + p + '</span>';
					}
				}
				$('.media_pagers').append(pagers);
			}
		},

		updatePG:function(pagercount, activated) {
			var pagerCount = pagercount;
			var activatedPager = activated;
			if(activatedPager == pagerCount) {
				activatedPager = 0;
			} else if (activatedPager == -1) {
				activatedPager = (pagerCount - 1);
			}

			$('.media_pagers span.active').removeClass('active');
			$('.media_pagers').find('[data-pagercount="' + activatedPager + '"]').addClass('active')
		},

		checkBTNS:function() {
			var playBTNwraps = $('.media-wrapper .wrap');
			playBTNwraps = Array.from(playBTNwraps);
			$( playBTNwraps ).each(function() {
			  if ($(this).find('img').attr('data-videoid')) {
			  	$(this).find('.action').addClass('playBTN');
			  	$(this).addClass('playBTNButton');
			  } else {
			  	$(this).find('.action').removeClass('playBTN');
			  	$(this).removeClass('playBTNButton');
			  }
			});
		},

		lightbox: function() {
			var pageName = $('main').attr('id')  || 'default';
			var selectedMedia = $(this).closest('.media-wrapper').clone().html();
			var offsetTop = $(window).scrollTop() + 50;

	 		var emelightboxblock = '<div id="emelightbox-wrapper" class="lb_' + pageName + '"><div id="emelightbox" style="top:' + offsetTop + 'px;"><div class="emelightbox-close"><span>X</span></div><div id="emelightbox-content"><div class="media-wrapper">' + selectedMedia + '</div></div></div></div>';
	 		$(document.body).append(emelightboxblock);

	 		var loadedLB = $('#emelightbox-wrapper').find('.wrap img');
		    loadedLB.each(function(i) {
		      var toLoadVideo = $(this).data('videoid');
		      if(toLoadVideo) {
		        var videoBlock = '<iframe width="1100" height="622" allowfullscreen="allowfullscreen" src="https://www.youtube.com/embed/' + toLoadVideo + '?rel=0" frameborder="0"></iframe></div></div></div>';
		        $(this).replaceWith(videoBlock);
		      }
		    });

	 		$(document.body).addClass('emelightbox-open');
	  		$('#blackout').show();
		},

		closeLightBox: function(closeThis) {
	      $(document.body).removeClass('emelightbox-open');
	      $('#blackout').hide();
	      $('#bg_sheer').remove();
	      $('#emelightbox-wrapper').remove();
	      mediaWrapperSlides.resetMediaLB();
	    },

	    resetMediaLB: function() {
	    	var playBTNwraps = $('.media-wrapper .wrap');
			playBTNwraps = Array.from(playBTNwraps);
			$( playBTNwraps ).each(function() {
				$(this).removeClass('selected').removeClass('last').removeClass('first');
			});
			$('.media_pagers span.active').removeClass('active');
			$('.media_pagers span:eq(1)').addClass('active');
			$('.media-wrapper').find('[data-mediaslide="media_slide_0"]').addClass('first');
			$('.media-wrapper').find('[data-mediaslide="media_slide_1"]').addClass('selected');
			$('.media-wrapper').find('[data-mediaslide="media_slide_2"]').addClass('last');
	    }
	  	
	};



	$(document).ready(function() {
		mediaWrapperSlides.initLB();
		$(document).on('click', '.media-prev', mediaWrapperSlides.clickPrev);
		$(document).on('click', '.media-next', mediaWrapperSlides.clickNext);
		$('.media-wrapper .wrap').on('click', mediaWrapperSlides.lightbox);
		$(document).on('click', '.emelightbox-close', mediaWrapperSlides.closeLightBox);
		$(document).on('click', '#blackout', mediaWrapperSlides.closeLightBox);
	});
	
}