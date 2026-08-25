import * as lottie from 'lottie-web';
import ctaButtonAnimFile from '../../images/anims/cta-button-animation.json';

export default class ButtonAnimation {
    constructor() { 

        this.ctaButton = {
            element: '.js-cta-button',
            animContainerClass: {
                css: 'button-animation',
                js: 'js-button-animation',
            },
        }

        this.init();
    }

    init() {
        let self = this;

        let $animContainer = $('<div>', {'class' : self.ctaButton.animContainerClass.css + ' ' + self.ctaButton.animContainerClass.js});

        // prepend the animation container on all cta buttons
        $(self.ctaButton.element).prepend($animContainer);

        // apply animation object and hover effect to each button on the page
        $(self.ctaButton.element).each(function() {
            const $thisAnimContainer = $(this).children()[0];

            // init the animation
            let ctaButtonAnimation = lottie.loadAnimation({
                container: $thisAnimContainer,
                renderer: 'svg',
                loop: true,
                autoplay: false,
                animationData: ctaButtonAnimFile,
                rendererSettings: { 
                    preserveAspectRatio:'xMidYMid slice', 
                },
            })

            // define handlers
            function handleMouseIn() {
                // plays through intro once, then loops
                ctaButtonAnimation.playSegments([[1,1440],[1441,2879]],true);
            }

            function handleMouseOut() {
                // if the intro has finished playing, just pause
                if(ctaButtonAnimation.currentFrame > 45) {
                    ctaButtonAnimation.pause();
                // if the intro is still playing, go to the end and stop
                } else {
                    ctaButtonAnimation.goToAndStop(46,1);
                }
            }

            // apply handlers on hover
            $(this).hover(handleMouseIn, handleMouseOut);
        });
    }
}