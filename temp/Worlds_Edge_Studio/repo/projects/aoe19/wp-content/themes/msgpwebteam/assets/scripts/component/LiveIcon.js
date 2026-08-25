import * as lottieWeb from 'lottie-web';

export default class LiveIcon {
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
        this.init();
    }

    init() {

        // As of 2021-03-16 .timeup class added via:
        // templates/partials/hero-franchise.blade.php
        // assets/scripts/component/CountdownTimerFutureDate.js
        if($(this.htmlElement).length) {

            $(this.htmlElement).each(function() {
                
                $(this).prepend('<div class="anim-liveicon"></div>');
                
                var icon = $(this).find('.anim-liveicon');
                var animation = lottieWeb.loadAnimation({
                    container: icon[0],
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: window.wp_object.liveiconurl,
                });
            });
        }

    }
}
