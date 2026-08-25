export default class FranchiseHero3 {
    constructor() {
        this.init();
    }

    init() {
        this._events();
    }

    _events(){
        let self = this;

        $('#heroselectors polygon').mouseenter(function(){
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

        // $('#heroselectors-m polygon.age2').mouseenter(function(){
        //     if(!$('#hero .heronav-m ul.age2').hasClass('open')) 
        //         $('#hero .heronav-m ul.age2').addClass('open');
        //     if(!$('#hero .logo.age2').hasClass('open')) 
        //         $('#hero .logo.age2').addClass('open');
        //     clearTimeout(window.heroTimer);
        // }).mouseleave(function(){
        //     window.heroTimer = setTimeout(self._closeHeroNavM,500,'age2');
        // });

        // $('#heroselectors-m polygon.age2').on('click',function(){
        //     if(!$('#hero .heronav-m ul.age2').hasClass('open')){
        //         $('#hero .heronav-m ul.age2').addClass('open');
        //         if(!$('#hero .logo.age2').hasClass('open')) $('#hero .logo.age2').addClass('open');
        //         clearTimeout(window.heroTimer);
        //     } else {
        //         window.heroTimer = setTimeout(self._closeHeroNavM,500,'age2');
        //     }
        // });

        $('#hero .heronav ul').mouseenter(function(){
            if($(this).hasClass('myth')){
                $('#heroselectors polygon.myth').addClass('open');
            }
            if($(this).hasClass('age1')){
                $('#heroselectors polygon.age1').addClass('open');
            }
            if($(this).hasClass('age2')){
                $('#heroselectors polygon.age2').addClass('open');
            }
            if($(this).hasClass('age3')){
                $('#heroselectors polygon.age3').addClass('open');
            }
            if($(this).hasClass('age4')){
                $('#heroselectors polygon.age4').addClass('open');
            }
        }).mouseleave(function(){
            if($(this).hasClass('myth')){
                $('#heroselectors polygon.myth').removeClass('open');
            }
            if($(this).hasClass('age1')){
                $('#heroselectors polygon.age1').removeClass('open');
            }
            if($(this).hasClass('age2')){
                $('#heroselectors polygon.age2').removeClass('open');
            }
            if($(this).hasClass('age3')){
                $('#heroselectors polygon.age3').removeClass('open');
            }
            if($(this).hasClass('age4')){
                $('#heroselectors polygon.age4').removeClass('open');
            }
        });

        // $('#hero .heronav-m ul').mouseenter(function(){
        //     if($(this).hasClass('age2')){
        //         $('#heroselectors-m polygon.age2').addClass('open');
        //     }
        // }).mouseleave(function(){
        //     if($(this).hasClass('age2')){
        //         $('#heroselectors-m polygon.age2').removeClass('open');
        //     }
        // });
    }

    _closeHeroNav(showClass){
        if($('#heroselectors polygon.'+showClass).hasClass('open') == false){
            $('#hero .heronav ul.'+showClass).removeClass('open');
            $('#hero .logo.'+showClass).removeClass('open');
        }
    }

    _closeHeroNavM(showClass){
        if($('#heroselectors-m polygon.'+showClass).hasClass('open') == false){
            $('#hero .heronav-m ul.'+showClass).removeClass('open');
            $('#hero .logo.'+showClass).removeClass('open');
        }
    }

}