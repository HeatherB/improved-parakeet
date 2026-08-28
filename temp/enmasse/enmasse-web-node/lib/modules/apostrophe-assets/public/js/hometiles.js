var hometiles = {

	allowBTN: function() {
		$('#tile-ctrl').show();
		//$('#tile-ctrl button.expand').show();

		/* show hide more game tiles */
		$(document).on('click', '#tile-ctrl button.expand', function(e) {
			e.preventDefault();

			var tilebodyHeight = $('.game-tiles').outerHeight();
			$('#game-tiles_wrapper').animate({
				height: "+=377"
			}, {
				duration: 150,
				complete: function() {
					// animation complete
					var resetHeight = $('#game-tiles_wrapper').outerHeight();
					if(resetHeight >= tilebodyHeight) {
						$('#tile-ctrl button').removeClass('expand').addClass('collapse');
					} else {
						//$('#tile-ctrl button').removeClass('expand');
						//$('#tile-ctrl button').addClass('collapse');
					}
				}
			}); /// end animate
		});

		$(document).on('click', '#tile-ctrl button.collapse', function(e) {
			e.preventDefault();

			$('#game-tiles_wrapper').animate({
				height: "387"
			}, {
				duration: 150,
				complete: function() {
					// animation complete
					$('#tile-ctrl button').removeClass('collapse').addClass('expand');
				}
			}); /// end animate
		});
	}
	
};

if($('.game-tiles')) {
	var tilebodyHeight = $('.game-tiles').outerHeight();
	var resetHeight = $('#game-tiles_wrapper').outerHeight();


	if(tilebodyHeight >= resetHeight) {
		hometiles.allowBTN();
	}
};