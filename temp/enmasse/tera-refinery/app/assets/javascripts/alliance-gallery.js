//= require vendor/waypoints.js
//= require vendor/velocity.min.js
//= require vendor/konami.js
//= require vendor/snow.js

$(document).ready(function() {
  if ($('#panel-wrapper').length) {


            var cur, flipping = false, 
                panelHeight = 619,
                wrapperHeight = $('#panel-wrapper').height();

            function panelDown(){
                cur = parseInt($('#panel-wrapper').css('top'));
                if (cur >= ((wrapperHeight - wrapperHeight * 2) + (panelHeight * 2))) {
                    flipping = true;
                    $('#panel-wrapper').animate({
                        top: (cur - panelHeight) + 'px'
                    }, 500, function(){
                        flipping = false;
                    })
                }
            }

            function panelUp(){
                cur = parseInt($('#panel-wrapper').css('top'));
                if (cur < 0) {
                    flipping = true;
                    $('#panel-wrapper').animate({
                        top: (cur + panelHeight) + 'px'
                    }, 500, function(){
                        flipping = false;
                    })
                }
            }

            $('.content-wrapper').bind('hover', function(){
                
                $('#a-content').bind('mousewheel DOMMouseScroll', function(e){
                    e.preventDefault();
                    if(!flipping){
                        if (e.type == 'mousewheel') {
                            (e.originalEvent.wheelDelta > 0) ? panelUp() : panelDown();
                        } else if (e.type =='DOMMouseScroll') {
                            (e.originalEvent.detail > 0) ? panelDown() : panelUp();
                        }
                    }
                });
            })
            $('#panel-wrapper').click(function(){
                panelDown();
            })
        
      }
  
});