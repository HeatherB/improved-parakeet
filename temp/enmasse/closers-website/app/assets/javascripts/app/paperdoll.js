var paperDoll = {

          paper_doll_gallery: function() {
            //launch the thing
            var paperdoll = document.getElementById('paperdoll');
            var doll_nav = document.querySelectorAll('#dressing_room_dolls .thumb');
            var asset_nav = document.getElementById('illus_or_3d');
            var outfit_nav = document.getElementById('outfit_controls');
            var fullscreen_button = document.getElementById('full_screen');

            var costume_set = document.getElementById('paperdoll').getAttribute('data-costume-set'); // name of collection
            var name_of_character = ''; // bai
            
            var name_of_set = document.getElementById('name_of_set');
            var name_of_doll = document.getElementById('name_of_doll');
            var gallery_space = document.querySelector('#doll_dressing_room figure');
            var counter  = 0;
            var blackout = document.getElementById('gallery_blackout');

            // on first load of gallery, construct costume options
            var selected_costume_set_options = paperdoll.getAttribute('data-costume-set-options').split(',');
            outfit_nav.innerHTML = '';
            for(o = 0; o < selected_costume_set_options.length; o++) {
              var outfit_btn = document.createElement('button');
              if(selected_costume_set_options[o].trim() == 'emote') {
                outfit_btn.classList.add('emote_' + selected_costume_set_options[o].trim());
              } else {
                outfit_btn.classList.add('shirt_' + selected_costume_set_options[o].trim());
              }
              outfit_btn.innerHTML = selected_costume_set_options[o];
              outfit_btn.setAttribute('id', 'outfit_' + [o]);
              outfit_btn.setAttribute('type', 'button');
              outfit_nav.append(outfit_btn);
            };
            var outfit_nav_buttons = outfit_nav.querySelectorAll('button');
            var selected_outfit = outfit_nav_buttons[0].className.split('_').pop(); // C, video
            outfit_nav_buttons[0].classList.add('active');

            // on first load of gallery, construct illustration style options
            var selected_costume_set_styles = paperdoll.getAttribute('data-costume-set-styles').split(',');
            asset_nav.innerHTML = '';
            for(a = 0; a < selected_costume_set_styles.length; a++) {
              var asset_button = document.createElement('button');
              asset_button.innerHTML = selected_costume_set_styles[a];
              asset_button.setAttribute('id', 'load_' + selected_costume_set_styles[a].toLowerCase().trim());
              asset_button.setAttribute('type', 'button');
              asset_nav.append(asset_button);
            }
            var asset_nav_buttons = asset_nav.querySelectorAll('button');
            asset_nav_buttons[0].classList.add('active');
            var asset_style = asset_nav_buttons[0].getAttribute('id').split('_').pop(); // illustration or threed

            // on first load of gallery, find active character or set first character to active
            var active_char = document.querySelectorAll('#dressing_room_dolls .thumb.active')
            if(active_char.length > 0) {
              name_of_character = active_char.closest('.thumb').getAttribute('data-doll');
              rebuildAsset('first');
            } else {
              doll_nav[0].classList.add('active');
              name_of_character = doll_nav[0].getAttribute('data-doll');
              rebuildAsset('first');
            }

            // on first load, assign a fake index to each character nav item
            for(d = 0; d < doll_nav.length; d++) {
            	doll_nav[d].setAttribute('data-index', d);
            }

            // create next/prev navigation if it should exist
            if(doll_nav.length > 1) {
              document.getElementById('next_prev_btns').classList.add('activated');
            }
            var prev_btn = document.getElementById('btn_prev');
            prev_btn.addEventListener('click', function() {
              navigate(-1);
            });
            var next_btn = document.getElementById('btn_next');
            next_btn.addEventListener('click', function() {
              navigate(1);
            });

            // allow arrow keys to trigger navigation
            document.onkeydown = checkKey;
            function checkKey(event) {
              if(event.keyCode == '37') {
                // left key press
                navigate(-1);
              } else if(event.keyCode == '39') {
                // right key press
                navigate(1);
              }
            }

            // allow swipe for mobile and tablet
            if(window.outerWidth < 1024) {
              setupSwipe();
            }

            // character clicks
            doll_nav.forEach(function(nav_thumb) {
              // enable character click nav
              nav_thumb.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                name_of_character = event.target.closest('.thumb').getAttribute('data-doll');
                for(t = 0; t < doll_nav.length; t++) {
                  doll_nav[t].classList.remove('active');
                }
                event.target.closest('.thumb').classList.add('active');
                counter = parseInt(event.target.closest('.thumb').getAttribute('data-index'));
                // rebuild asset with this name
                rebuildAsset('character');
              });
            });
            // enable asset style click selection
            asset_nav_buttons.forEach(function(asset_thumb) {
              asset_thumb.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                for(s = 0; s < asset_nav_buttons.length; s++) {
                  asset_nav_buttons[s].classList.remove('active');
                }
                event.target.classList.add('active');
                asset_style = event.target.getAttribute('id').split('_').pop();
                // rebuild asset with this asset style
                rebuildAsset('asset');
              });
            });
            // enable costume click selection
            outfit_nav_buttons.forEach(function(outfit) {
              outfit.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();

                selected_outfit = event.target.className.split('_').pop();
                for(n = 0; n < outfit_nav_buttons.length; n++) {
                  outfit_nav_buttons[n].classList.remove('active');
                }
                event.target.classList.add('active');
                // rebuild asset with this outfit
                rebuildAsset('outfit');
              });
            });

            // construct gallery on page load
            // array of character names already exists
            // if no active character, select the first character
            function rebuildAsset(which_build) {
              var rebuild_set = costume_set;
              var rebuild_name = name_of_character;
              var rebuild_style = asset_style;
              var rebuild_outfit = selected_outfit;
              var builtAsset;
              var currentAsset;

              gallery_space.classList.remove('emoteWrapper');

              if(which_build == 'first') {
                builtAsset = buildImage(rebuild_set, rebuild_name, rebuild_style, rebuild_outfit);
              } else {
                if (rebuild_outfit == 'emote') {
                  builtAsset = buildEmote(rebuild_set, rebuild_name);
                  gallery_space.classList.add('emoteWrapper');
                } else { 
                  builtAsset = buildImage(rebuild_set, rebuild_name, rebuild_style, rebuild_outfit);
                }
              }

              name_of_set.innerHTML = rebuild_set.replace(/_/g, " ");
              name_of_doll.innerHTML = rebuild_name;
              gallery_space.innerHTML = builtAsset;
            };

            function buildImage(rebuild_set, rebuild_name, rebuild_style, rebuild_outfit) {
              return  '<img src="https://eme04.enmasse-game.com/images/closers/doll_gallery/' + rebuild_set.replace("'", "") + '/' + rebuild_name + '/' + rebuild_style + '/' + rebuild_outfit + '.png"  alt="closers costumes" />';
            };

            function buildEmote (rebuild_set, rebuild_name) {
              return  '<video id="illustrated_emote" controls autoplay muted loop><source src="https://eme04.enmasse-game.com/images/closers/doll_gallery/' + rebuild_set.replace("'", "") + '/' + rebuild_name + '/' + 'video.webm" type="video/webm"><source src="https://eme04.enmasse-game.com/images/closers/doll_gallery/' + rebuild_set.replace("'", "") + '/' + rebuild_name + '/' + 'video.mp4" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video>';
            };


            function navigate(direction) {
              var items = doll_nav,
                  amount = items.length,
                  active = active_char;

                for(t = 0; t < doll_nav.length; t++) {
                  	doll_nav[t].classList.remove('active');
                }

                counter = counter + direction;

                if (direction === -1 && counter < 0) { 
                  counter = amount - 1; 
                }
                if (direction === 1 && !items[counter]) { 
                  counter = 0;
                }
                active = items[counter];
                active.classList.add('active');
                name_of_character = active.getAttribute('data-doll');
                rebuildAsset('character');
            };

            function setupSwipe() {
              //var loadedSlides = gallery_space;
              //var popupContainer = $('#emelightbox-content');

            // add generic swipe
              //gallery_space.forEach(function(i) {
                function swipedetect(slide, callback) {

                  var touchsurface = slide,
                    swipedir,
                    startX,
                    startY,
                    distX,
                    distY,
                    threshold = 25, // required min distance traveled to be considered swipe
                    restraint = 300, // maximum distance allowed at the same time in perpendicular direction
                    allowedTime = 300,
                    elapsedTime,
                    startTime,
                    handleswipe = callback || function(swipedir) {}


                  touchsurface.addEventListener('touchstart', function(e) {
                    var touchobj = e.changedTouches[0]
                    swipedir = 'none'
                    dist = 0
                    startX = touchobj.pageX
                    startY = touchobj.pageY
                    startTime = new Date().getTime() // record time when finger first makes contact with surface
                    //e.preventDefault()
                  }, false)

                  touchsurface.addEventListener('touchmove', function(e) {
                    //e.preventDefault() // prevent scrolling when inside DIV
                  }, false)

                  touchsurface.addEventListener('touchend', function(e) {
                    var touchobj = e.changedTouches[0]
                    distX = touchobj.pageX - startX // get horizontal dist traveled by finger whiel in contact with surface
                    distY = touchobj.pageY - startY // get vertical dist traveled by finger whiel in contact wit hsurface
                    elapsedTime = new Date().getTime() - startTime // get time elapsed
                    if (elapsedTime <= allowedTime) { // first condition for swipe met
                      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                        swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indices left swipe
                      } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                        swipedir = (distY < 0)? 'up' : 'down' // id dist traveled is negative, it indicates up swipe
                      }
                    }
                    handleswipe(swipedir)
                    //e.preventDefault()
                  }, false) 
                }

                // usage
                var el = gallery_space;
                swipedetect(el, function(swipedir) {
                  //swipedir contains either "none", "left", "right", "top", "down"
                  if (swipedir == 'left') {
                    navigate(1);
                  } else if (swipedir == 'right') {
                    navigate(-1);
                  } else if (swipedir == 'up') {
                    // dont trigger navigation, allow area to be scrolled
                    //window.scrollBy(0,200)
                  } else if (swipedir == 'down') {
                    // dont trigger navigation, allow area to be scrolled
                    //window.scrollBy(0,-200)
                  } else {
                    //console.log('undetectable swipe');
                  }
                });
              //});
            }; // end of setup swipe

            fullscreen_button.addEventListener('click', function(event) {
              document.body.classList.toggle('fullscreen');
              paperdoll.style.setProperty('top', paperdoll.offsetTop + 'px');
            });
            
            blackout.addEventListener('click', function(event) {
            	document.body.classList.remove('fullscreen');
            });

          }

        } // end paperdoll scripts

document.addEventListener('DOMContentLoaded', function() {
    var is_paper_doll_gallery = document.getElementById('paperdoll');
    if(is_paper_doll_gallery) {
        paperDoll.paper_doll_gallery();
    } else {
        //console.log('no dolls');
    }
}); // end dom load


