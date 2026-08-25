import * as lottieWeb from 'lottie-web';
import ctaButtonAnimFile from '../../images/anims/sandbutton.json';

export default class SandButton {
    constructor() {
        this.init();
    }

    init() {

        // Sandbutton animation JS created by Sam Bragg on March 5, 2021
        var sandBtnElem = $('.sandbutton');
        
        if (sandBtnElem.length && ctaButtonAnimFile) {            
            // Loaded lottie JSON file once in line below then use
            // JSONdata callback function param to pass into data object
            // which in turn is passed into method shown further below:
            // var animIntro = lottieWeb.loadAnimation(data);            
            
            sandBtnElem.each(function(){

                $(this).wrapInner('<div class="sandbutton-text"></div>');
                $(this).prepend('<div class="anim-sandbutton"></div>');
                var icon = $(this).find('.anim-sandbutton');
    
                var data = {
                    container: icon[0],
                    renderer: 'svg',
                    loop: true,
                    autoplay: false,
                    animationData: ctaButtonAnimFile,
                    rendererSettings:{ preserveAspectRatio:'xMidYMid slice' },
                };
    
                var animIntro = lottieWeb.loadAnimation(data);
    
                $(this).on('mouseenter', function(){
                    //plays through intro once, then loops
                    animIntro.playSegments([[1,1440],[1441,2879]],true);
                }).on('mouseleave', function(){
                    //if the intro has finished playing, just pause
                    if(animIntro.currentFrame > 45) {
                        animIntro.pause();
                    //if the intro is still playing, goto the end of the intro and stop
                    } else {
                        animIntro.goToAndStop(46,1);
                    }
                });
    
            });

        }

    }
}
