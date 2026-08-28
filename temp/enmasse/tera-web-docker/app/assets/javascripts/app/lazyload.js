document.addEventListener("DOMContentLoaded", function() {
  var lazyloadImages;
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazyVideo"));

  if ("IntersectionObserver" in window) {
    lazyloadImages = document.querySelectorAll(".lazy");
    var imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove("lazy");
          imageObserver.unobserve(image);
        }
      });
    });

    lazyloadImages.forEach(function(image) {
      imageObserver.observe(image);
    });


    // video portion
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }
          video.target.classList.remove("lazyVideo");
          video.target.load();

          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  } else {  
    var lazyloadThrottleTimeout;
    lazyloadImages = document.querySelectorAll(".lazy");


    /* video portion */

        var JPcharacterClick = document.querySelectorAll('.character_icon');
        var JPcharacterReveal = document.querySelectorAll('.character_reveal');
        JPcharacterClick.forEach(function(jpclickChar) {
           jpclickChar.addEventListener("touchstart", function(event) {
            var thisVideo = event.currentTarget.dataset.characterreveal;
            

            JPcharacterReveal.forEach(function(jpcr) {
              if(jpcr.dataset.characterabout == thisVideo) {
                //jpcr.classList.add('HERERHEREHEREEHERER');
                var loadVid = jpcr.querySelector("video.lazyVideo");
                var selectVid = loadVid.querySelectorAll("source");

                //console.log('selectVid ', selectVid);
                selectVid.forEach(function(sv) {
                  sv.src = sv.dataset.src + '#t=0.5';
                });
                loadVid.classList.remove("lazyVideo");
                loadVid.load();
                loadVid.addEventListener('touchstart', function() {
                  loadVid.play();
                });
              }
            });
            /*lazyVideos.forEach(function(vid) {
              console.log('video vid ', vid);
              if(vid )
              vid.src = vid.dataset.src;
              vid.classList.remove("lazyVideo");
              //vid.target.load();

             
            
            });*/



           });
        });
        

        
        /* end video portion */





    function lazyload () {
      if(lazyloadThrottleTimeout) {
        clearTimeout(lazyloadThrottleTimeout);
      }    

      lazyloadThrottleTimeout = setTimeout(function() {
        var scrollTop = window.pageYOffset;
        lazyloadImages.forEach(function(img) {
            if(img.offsetTop < (window.innerHeight + scrollTop)) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
        });
        
        if(lazyloadImages.length == 0) { 
          document.removeEventListener("scroll", lazyload);
          document.removeEventListener("touchstart", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }

        
      }, 20);
    }

    document.addEventListener("scroll", lazyload);
    document.addEventListener("touchstart", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);
  }

});

/* 
currently setup to work with scolling to images
need to alter for popup use
*/


/* <!-- https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/ --> */

/*
<!-- https://css-tricks.com/the-complete-guide-to-lazy-loading-images/#more-276700 -->
*/
/* example usage */
/*
<img class="lazy" data-src="https://ik.imagekit.io/demo/img/image4.jpeg?tr=w-400,h-300" />
*/

/* bg image example usageg */
/*
#bg-image.lazy {
   background-image: none;
   background-color: #F1F1FA;
}
#bg-image {
  background-image: url("https://ik.imagekit.io/demo/img/image10.jpeg?tr=w-600,h-400");
  max-width: 600px;
  height: 400px;
}
*/