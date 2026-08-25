import * as lottieWeb from 'lottie-web';
import animationObject from '../../images/anims/button-highlight4.json';

export default class ButtonAnimation {
    constructor() {
        this.init();
    }

    init() {

        $('.button.cta, .btn-aoe--cta').each(function(){
            $(this).prepend('<div class="cta-anim-left"></div><div class="cta-anim-right"></div>');
            var lightLeft = $(this).find('.cta-anim-left');
            var animLightLeft = lottieWeb.loadAnimation({
                container: lightLeft[0],
                renderer: 'svg',
                loop: true,
                autoplay: false,
                animationData: animationObject,
                rendererSettings: {
                    preserveAspectRatio: 'xMinYMin slice',
                },
            });
            var lightRight = $(this).find('.cta-anim-right');
            var animLightRight = lottieWeb.loadAnimation({
                container: lightRight[0],
                renderer: 'svg',
                loop: true,
                autoplay: false,
                animationData: animationObject,
                rendererSettings: {
                    preserveAspectRatio: 'xMaxYMin slice',
                },
            });
            $(this).hover(function(){
                animLightLeft.play();
                animLightRight.play();
            },function(){
                animLightLeft.stop();
                animLightRight.stop();
            });
        });        
    }
}