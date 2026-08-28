function trigger_revs() {
	var rev_triggers = document.querySelectorAll('.reveal_more_trigger');

	rev_triggers.forEach(function(rev_trig) {
		rev_trig.addEventListener("click", rev_reveal, false);
	});
};

function rev_reveal() {
	event.preventDefault();
    event.stopPropagation();

    var to_reveal = event.target.getAttribute("data-reveal");
    document.querySelector("[data-revealed=" + to_reveal + "]").classList.toggle('revealed');
};


function blog_slides() {
	var blog_slides = document.querySelectorAll('.blog_slide');

	blog_slides.forEach(function(blog_slide) {
		blog_slide.addEventListener('click', blog_slide_selected, false);
	});
};

function blog_slide_selected() {
	event.preventDefault();
    event.stopPropagation();

    var selected_large = event.target.getAttribute('data-large') || event.target.parentNode.getAttribute('data-large');
    //var selected_slide_about = event.target || event.target.parentNode;
    var slide_loaded = document.getElementById('slide_loaded');
    //var gridAbout = document.getElementById('gridabout');

    //selected_slide_about = selected_slide_about.querySelector('.about').cloneNode(true); //false will ignore the children
    //gridAbout.innerHTML = "";
    
    var subloading = slide_loaded.animate([
      // keyframes
      { opacity: 1 }, 
      { opacity: 0 }
    ], { 
      // timing options
      duration: 250,
      fill: 'forwards'
    });

    subloading.onfinish = function() {
        slide_loaded.src = selected_large;
        slide_loaded.animate([
          // keyframes
          { opacity: 0, transform: 'translateX(100%)' },
          { opacity: 1, transform: 'translateX(0%)' }
        ], { 
          // timing options
          duration: 250,
          fill: 'forwards'
        });
        //gridAbout.appendChild(selected_slide_about);
    }
};

window.addEventListener("load",function(a){
	/* button or link to show hide further content */
    trigger_revs();
    /* embedded slideshow, click thumbs roll in larger */
    blog_slides();
});