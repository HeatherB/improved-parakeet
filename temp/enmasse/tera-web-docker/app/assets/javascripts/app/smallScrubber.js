var SmallScrubber = {
	smallScrubberR: $('.smallScrubberR'),
  	smallScrubberL: $('.smallScrubberL'),

	init: function() {
	    SmallScrubber.smallScrubberR.on('click', null, SmallScrubber.scrollSmallR);
	    SmallScrubber.smallScrubberL.on('click', null, SmallScrubber.scrollSmallL);
	},
	scrollSmallR: function(e) {
	    e.preventDefault();
	    var scrollSmallRTarget = $(this).parent().parent().siblings('.smallScrubberT');
	    var scrollSmallRBall = $(this).parent().parent().find('.scroller-ball');
	    //SmallScrubber.checkNavBtn('right', scrollSmallRTarget);
	    $(scrollSmallRTarget).animate({scrollLeft:'+=100'}, 200);
	    var rightLftMrgin = parseInt($(scrollSmallRBall).css('margin-left'));
	    

	    var tableWrapper = scrollSmallRTarget.children().outerWidth();
	    //console.log('tableWrapper ', tableWrapper);
	    var howObscured = scrollSmallRTarget.outerWidth() - tableWrapper;
	    var howFarScrolled = scrollSmallRTarget.scrollLeft();
	    //console.log('howObscured ', howObscured);
	    //console.log('howFarScrolled ', howFarScrolled);
	    //console.log('(howObscured * -1) - howFarScrolled) ', ((howObscured * -1) - howFarScrolled));

	    if  (((howObscured * -1) - howFarScrolled) >= 100) {
	    	$(scrollSmallRBall).animate({marginLeft:'+=100'}, 200);
	    }

	    /*if (howObscured > 0) {
	    	console.log('table shows full');
	    } else {
	    	console.log('table partial hidden');
	    	$(scrollSmallRBall).animate({marginLeft:'+=100'}, 200);
	    }*/
	    /*var moveCount = tableWrapper / 200;
	    console.log('moveCount ', moveCount);*/

	    /*var justMoved = parseInt($(scrollSmallRTarget).scrollLeft() + 100);
	    console.log('justMoved ', justMoved);

	    var smallerMove = tableWrapper - justMoved;
	    console.log('smallerMove ', smallerMove);

	    if(justMoved < tableWrapper) {
	    	if (smallerMove <= 100) {
	    		$(scrollSmallRBall).animate({marginLeft:'+=', smallerMove}, 200);
	    	} else {
	    		$(scrollSmallRBall).animate({marginLeft:'+=100'}, 200);
	    	}
	    	
	    }*/


	},

	scrollSmallL: function(e) {
	    e.preventDefault();
	    var scrollSmallLTarget = $(this).parent().parent().siblings('.smallScrubberT');
	    //SmallScrubber.checkNavBtn('left', scrollSmallLTarget);
	    var scrollSmallLBall = $(this).parent().parent().find('.scroller-ball');
	    $(scrollSmallLTarget).animate({scrollLeft:'-=100'}, 200);

	    var leftLftMrgin = parseInt($(scrollSmallLBall).css('margin-left'));
	    if(leftLftMrgin > 0) {
	    	$(scrollSmallLBall).animate({marginLeft:'-=100'}, 200);
	    };
	    
	},

	checkNavBtn: function(direction, parentToScroll) {
	    if(direction == 'right') {
	      if($(parentToScroll).scrollLeft() + $(parentToScroll).innerWidth() == $(document).width()) {
	        SmallScrubber.smallScrubberL.show();
	      }
	      if($(parentToScroll).scrollLeft() + $(parentToScroll).innerWidth() >= $(parentToScroll)[0].scrollWidth - 200) {
	        SmallScrubber.smallScrubberR.hide();
	        SmallScrubber.smallScrubberL.show();
	      }
	    }
	    if(direction == 'left') {
	      SmallScrubber.smallScrubberR.show();
	     if($(document).width() >= $(parentToScroll).scrollLeft() + $(parentToScroll).innerWidth() - 200) {
	        SmallScrubber.smallScrubberL.hide();
	      }
	    }
	}

} // SmallScrubber

$(document).ready(function() {
    SmallScrubber.init();
});