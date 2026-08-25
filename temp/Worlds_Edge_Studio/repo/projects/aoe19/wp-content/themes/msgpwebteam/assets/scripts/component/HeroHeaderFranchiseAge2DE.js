import * as lottieWeb from 'lottie-web';
import btnHightlight from '../../images/anims/button-highlight.json';
import btnSheen from '../../images/anims/rect-button-sheen.json';

export default class FranchiseAge2DE {
    constructor() {
        this.init();
    }

    init() {
        this._applyAnims();
        this._events();
    }

    _applyAnims() {
        $('.heronav a').each(function(){
            $(this).prepend('<div class="light"></div>');
            var light = $(this).find('.light');
            var animLight = lottieWeb.loadAnimation({
                container: light[0],
                renderer: 'svg',
                loop: true,
                autoplay: false,
                path: btnHightlight,
                rendererSettings: {
                    preserveAspectRatio: 'none',
                },
            });
            $(this).hover(function(){
                animLight.play();
            },function(){
                animLight.stop();
            });
        });
    }

        _events(){
        let self = this;

        $('#heroselectors path').mouseenter(function(){
            var showClass = $(this).attr('class');
            $('#hero .heronav ul').removeClass('open');
            $('#hero .logo.open').removeClass('open');
            $('#hero .heronav ul.'+showClass).addClass('open');
            $('#hero .logo.'+showClass).addClass('open');
            clearTimeout(window.heroTimer);
        }).mouseleave(function(){
            var showClass = $(this).attr('class');
            window.heroTimer = setTimeout(self._closeHeroNav,500,showClass);
        });

        $('#hero .heronav ul').mouseenter(function(){
            if($(this).hasClass('myth')){
                $('#heroselectors path.myth').addClass('open');
            }
            if($(this).hasClass('age1')){
                $('#heroselectors path.age1').addClass('open');
            }
            if($(this).hasClass('age2')){
                $('#heroselectors path.age2').addClass('open');
            }
            if($(this).hasClass('age3')){
                $('#heroselectors path.age3').addClass('open');
            }
            if($(this).hasClass('age4')){
                $('#heroselectors path.age4').addClass('open');
            }
        }).mouseleave(function(){
            if($(this).hasClass('myth')){
                $('#heroselectors path.myth').removeClass('open');
            }
            if($(this).hasClass('age1')){
                $('#heroselectors path.age1').removeClass('open');
            }
            if($(this).hasClass('age2')){
                $('#heroselectors path.age2').removeClass('open');
            }
            if($(this).hasClass('age3')){
                $('#heroselectors path.age3').removeClass('open');
            }
            if($(this).hasClass('age4')){
                $('#heroselectors path.age4').removeClass('open');
            }
        });
    }

    _closeHeroNav(showClass){
        if($('#heroselectors path.'+showClass).hasClass('open') == false){
            $('#hero .heronav ul.'+showClass).removeClass('open');
            $('#hero .logo.'+showClass).removeClass('open');
        }
    }

}