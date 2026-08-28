$(window).load(function() {

    function parallax(node) {
        this.init = function() {
            this.offsetTop = $(node).offset().top;
            this.setSettings();
            window.requestAnimationFrame(function() {this.checkScroll() }.bind(this));
        }

        this.checkScroll = function() {
            var scrollTop = $(document).scrollTop();
            var distance = (-scrollTop * this.speed + this.offsetTop * this.speed) - 200 * this.speed;

            /*if (distance < 0) {
                distance = 0; // stops the images from going too far
            }*/

            node.style.transform = "translateY(" + distance + "px)";

            window.requestAnimationFrame(function() {this.checkScroll() }.bind(this));
        }

        this.setSettings = function() {
            this.speed = $(node).data("speed") / 10 || .2;
            node.style.transition = "100ms ease";
        }

        this.init();
    }

    var arr = document.getElementsByClassName("rellax");
    for (var x = 0; x < arr.length; x++) {
        new parallax(arr[x]);
    }

});