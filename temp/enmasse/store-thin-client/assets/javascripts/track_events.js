/* a generic file for tracking google analytics things */
$(document).ready(function(){
	$('#homeBTS').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Store homepage', 'Back to School Banner', '/back-to-school'])};
	});
	$('.bts_packs .tera_bundle .btn_blue').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Back to School homepage', 'Tera pack', '/tera/packs'])};
	});
	$('.bts_packs .closers_bundle .btn_blue').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Back to School homepage', 'Closers pack', '/closers/packs#CloserBackSchoolPack'])};
	});
	$('.bts_packs .emp_banner .btn_blue').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Back to School homepage', 'EMP banner', '/enmasse/emp'])};
	});
	$('.bts_packs .game_disco .btn_blue').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Back to School homepage', 'Stranger Things 3 Game', '/strangerthings3thegame'])};
	});

	$('.tera_packs .init_packs_form .btn_blue').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Tera BTS Pack homepage', 'Confirm Purchase', '/tera/packs/confirm'])};
	});
	$('.tera_packs #payform .btn_blue').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Tera BTS Pack confirm', 'Submit Purchase', 'xsolla billing'])};
	});

	$('.closers_packs #CloserBackSchoolPack .init_purchase_btn').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Closers Packs BTS', 'Confirm Purchase', '/closers/packs/confirm'])};
	});
	$('.closers_packs #payform .submitBTN').on('click', function(e) {
        if (_gaq) {_gaq.push(['_trackEvent', 'Closers Packs BTS confirm', 'Submit Purchase', 'xsolla billing'])};
	});
});