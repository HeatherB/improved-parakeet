$(function() {
  // Start with your project-level client-side javascript here.
  // JQuery and lodash (_) are both included with Apostrophe, so no need to
  // worry about including them on your own.

  $(document).ready(function() {
	  // cleanup animation deferral
	    setTimeout(function(){
	      document.body.classList.remove('preload');
	    },500);
	});

 
});
