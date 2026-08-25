import imageModal           from '../templates/imageModal.html';
import imageCaptionModal    from '../templates/imageCaptionModal.html';

export default class HistoryContent {
    constructor(objOptions = {}) {
        this.init(objOptions);
    }
    init(objOptions) {
        this.options = Object.assign({
            $el         : $('.history-pos'),
            $pos1       : 0,
            $pos2       : typeof $('#js-pos-container').offset() !== 'undefined' ? $('#js-pos-container').offset().top : 0,
            $pos3       : 3,
            $posTime    : $('.timeline-wrapper'),
        }, objOptions);

        this.ui = {
            $sectionImages      : $('.section-image'),
            $container          : $('.js-mainContent'),
            $sidebar            : $('.js-fixedSidebar'),
            $window             : $(window),
            $imageModal         : $('#js-image-caption-modal'),
            $imageModalMount    : $('.js-image-caption-modal-mount'),
        }

        this.lastScrollTop = 0;
        this._setPositions();
        this._historyButton();
        this._addEventListeners();

    }
    _fixModalImg() {
        if($(window).width() >= 720) {

            let img = $('.image-caption-modal__image-inner img')
            let imgSrc = $(img).attr('src');

            $('.image-caption-modal__image-inner img').hide();   
            $('.image-caption-modal__image-inner').css('background-image', 'url(' + imgSrc + ')');   
            $('.image-caption-modal__image-inner').css('background-size', 'contain');   
            $('.image-caption-modal__image-inner').css('background-repeat', 'no-repeat');   
            $('.image-caption-modal__image-inner').css('background-position', 'center center');   
        } else {
            $('.image-caption-modal__image-inner img').show();
            $('.image-caption-modal__image-inner').css('background-image', 'none');                                      
        }
    }
    _setPositions() {
        let containerTop        = this.ui.$container.offset().top - parseInt(this.ui.$container.css('marginTop'), 10),
            containerBottom     = this.ui.$container.offset().top - parseInt(this.ui.$container.css('marginTop'), 10) + this.ui.$container.height() - 40
        ;
        this.position = {
            window          : $(window).scrollTop(),                                                    // current position of the window
            windowBottom    : $(window).scrollTop() + $(window).height(),
            toc             : this.ui.$sidebar.offset().top,                                            // position of table of contents sidebar
            containerTop    : containerTop,                                                             // position of the top of the main container
            containerBottom : containerBottom,                                                          //position of the bottom of the main container
            sidebarTop      : this.ui.$sidebar.offset().top,
            sidebarBottom   : this.ui.$sidebar.offset().top + this.ui.$sidebar.height(),
        }
    }
    _resizeSidebar() {
        let toc         = this.ui.$sidebar,
            parentWidth = toc.parent().width()
        ;
        toc.css('width', parentWidth + 'px');
    }
    _onScroll() {
        this._setPositions();
        let toc = this.ui.$sidebar;
        let st = $(window).scrollTop();
        if($(window).width() >= 720) {
            if (st > this.lastScrollTop) {
                // downscroll code
                this.scrollUp = false;
            } else {
                // upscroll code
                this.scrollUp = true;
                this.ui.$container.offset().top - parseInt(this.ui.$container.css('marginTop'), 10) - 20;
            }
            this.lastScrollTop = st;
            // console.log(this.lastScrollTop)
            // console.log(st)
            if (this.position.window > this.position.containerTop && this.position.window < this.position.containerBottom && parseInt(this.position.sidebarBottom.toFixed()) < parseInt(this.position.containerBottom.toFixed())) {
                // console.log("fixed first")
                // console.log(parseInt(this.position.sidebarBottom.toFixed()))
                // console.log(parseInt(this.position.containerBottom.toFixed()))
                this._resizeSidebar();
                toc.css('top', '10px');
                toc.css('position', 'fixed');
                toc.css('bottom', 'auto')
            } else if (parseInt(this.position.sidebarBottom.toFixed()) >= parseInt(this.position.containerBottom.toFixed())) {
                if (this.scrollUp == true && $(window).scrollTop() < parseInt(this.position.sidebarTop.toFixed())) {
                    // console.log("fixed second")
                    toc.css('top', '10px');
                    toc.css('position', 'fixed');
                    toc.css('bottom', 'auto')
                } else {
                    // console.log("absolute first")
                    toc.css('bottom', '0')
                    toc.css('top', 'auto');
                    toc.css('position', 'absolute');
                }
                // console.log(parseInt(this.position.sidebarBottom.toFixed()))
                // console.log(parseInt(this.position.containerBottom.toFixed()))
            } else {
                toc.css('bottom', 'auto')
                toc.css('top', '0');
                toc.css('position', 'static');
            }
        } else {
            toc.css('bottom', 'auto')
            toc.css('top', '0');
            toc.css('position', 'static');
        }
    }

    _historyButton() {
        $('.timeline_button').click(function(){
            // console.log("timeline_button has been clicked")
            $('html, body').animate({
                scrollTop: $('.timeline-wrapper').height(),
            }, 500);
            $('.scroll_container').slideToggle(200);
            $(this).toggleClass('buttonshow');
            $(this).text(function(i,text) {
                return text === "Show Timeline" ? "Hide Timeline" : "Show Timeline";
            })
            $( '.cultures' ).fadeToggle( 'slow' );
        });
    }
    _addEventListeners() {
        let self = this;
        // this.ui.$sidebar.on('click', 'a', function(){
        //     let id = $(this).attr('href');
        //     let place = $(id).offset().top - 20;
        //     $('html, body').animate({
        //         scrollTop: place,
        //     }, 500);
        //     return false;
        // })
        this.ui.$window.on('resize', this._fixModalImg.bind(this));
        
        this.ui.$window.on('resize', this._resizeSidebar.bind(this))
        this.ui.$window.on('scroll', this._onScroll.bind(this))
        this.ui.$sectionImages.on('click', function () {
            let imageUrl = $(this).find('img').attr('src');
            let caption = $(this).find('.js-caption').html();
            let captionLong = $(this).find('.js-caption-long').html();
            let data = {
                "imageUrl"              : imageUrl,
                "caption"               : caption,
                "captionLong"           : captionLong,
                "isMobile"              : window.wp_object.devices.isMobile,
            };
            //console.log(data.imageSrc);
            self.ui.$imageModalMount.empty();
            self.ui.$imageModalMount.append(imageCaptionModal(data));
            self.ui.$imageModal.foundation('open')
        })
        $('body').on("click",".image-modal-close", function(e){
            $('#image-modal').remove();
        });

        $('body').on("click",".image-modal-shade", function(e){
            $('#image-modal').remove();
        });

        $('#to-top').on('click', function(e){
            e.preventDefault();
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            return false;
        });

        /* in-page anchor links from toc menu */
        $("#toc a").click(function (e) {
          e.preventDefault();
          var id = $(this).attr("data-id");
          var $anchor = $('#' + id);
          var position = $anchor.offset().top - 20;
          
          $('html, body').animate({
            scrollTop: position,
          }, 500);
          return false;
        });
    }
}