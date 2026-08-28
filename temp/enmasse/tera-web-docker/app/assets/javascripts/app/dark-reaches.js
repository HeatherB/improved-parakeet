document.addEventListener("DOMContentLoaded", function(event) {
    if($('body.dark-reaches').length > 0) {
        var checkScroll = function(element) {
            var scrollPoint = element.offset().top + element.height();
            return $(window).scrollTop() > (scrollPoint);
        }
        var adjustClassToElement = function(checked, adjusted) {
            if (checkScroll(checked)) {
                adjusted.addClass("fixed");
            } else {
                adjusted.removeClass("fixed");
            }
        }

        var checked = $("#header-img");
        var adjusted = $("#dark-nav");

        $(window).scroll(function(){
            adjustClassToElement(checked, adjusted);
        });

        adjustClassToElement(checked, adjusted);

        $("#dark-nav #close").on("click", function() {
            adjusted.addClass("closed");
        });
    }
});