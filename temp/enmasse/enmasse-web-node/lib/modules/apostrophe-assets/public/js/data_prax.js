if($('.data-prax').length > 0) {
    var lastScrollTop = window.pageYOffset;
    var layers = document.querySelectorAll('[data-type=\'parallax\']');
    var vw = window.innerWidth;
    var upMovement = false;
    
    window.addEventListener('scroll', function (event) {
        var depth, rotate_x, rotate_y, i, ri, layer, len, rlen, movement, x_movement, y_movement, topDistance, translate3d, r_translate3d;
        topDistance = this.pageYOffset;

        for (i = 0, len = layers.length; i < len; i++) {
            layer = layers[i];
            depth = layer.getAttribute('data-depth');
            movement = -(topDistance * depth);
            translate3d = 'translate3d(0, ' + movement + 'px, 0)';
            layer.style['-webkit-transform'] = translate3d;
            layer.style['-moz-transform'] = translate3d;
            layer.style['-ms-transform'] = translate3d;
            layer.style['-o-transform'] = translate3d;
            layer.style.transform = translate3d;
        }

        

        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop){
           // downscroll code
           upMovement = false;
        } else {
          // upscroll code
          upMovement = true;
        }
        lastScrollTop = st;
    });
}