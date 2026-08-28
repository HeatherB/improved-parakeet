$(document).ready(function() {
    if ($('body').hasClass("firstabout")) {
        var navigation = document.getElementById("navigation");
        var navTop = 510; //navigation.getBoundingClientRect().top;
        $('body').addClass("nav-style");
        checkScroll();

        document.addEventListener('scroll', function() {
        checkScroll();
        });

        function checkScroll() {
            var scroll = window.scrollY;
            if (scroll >= navTop) {
                $('body').removeClass("nav-style");
            } else {
                $('body').addClass("nav-style");
            }
        }
    }
});