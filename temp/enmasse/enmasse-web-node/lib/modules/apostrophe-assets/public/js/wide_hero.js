if($('#wide_hero').length > 0) {

	var wideHero = {
		loadHero: function() {
			var capturedHero = $('#hero img').attr('src') || "https://eme04.enmasse-game.com/images/enm/hero/default_hero.jpg";
			$("#wide_hero").css('background-image', 'url(' + capturedHero + ')');
		}
	}

	$(document).ready(function() {
		wideHero.loadHero();
	});
	
}