document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded

	var lang_locales = document.querySelectorAll('#locale span');
	var selected_locale = document.querySelectorAll('#locale span.selected');


	/* english stays first, others sohw abd hide */
	if(selected_locale.length > 0) {
		selected_locale[0].addEventListener('click', function() {
			for(i = 0; i < lang_locales.length; i++) {
				if(lang_locales[i].style.display == 'block' && !lang_locales[i].classList.contains('selected')) {
		          lang_locales[i].style.display = 'none';
				}
		       else {
		          lang_locales[i].style.display = 'block';
		       }
		     
			}
		});
	};
}); /* end javascript version of document ready */