
export default class FixedSidebar {
    constructor() {
        this.init();
    }
    init() {
        let $sidebar = $('.js-fixedSidebar');

        this.ui = {
            $container : $('.js-mainContent'),
            $sidebar   : $sidebar,
            $window    : $(window),
            $sidebarPosParent : this._getSidebarPosParent($sidebar),
            $comments   : $('.js-join-discussion'),
            $header     : $('#stickyHeader'),
            $tocInner  : $('.frame-box--toc .frame-box__inner'),
            $tocListItems : $('#toc').children(),
        }

        this._getElementSizes();

        this.ui.$tocInner.css('max-height', this.sidebarMaxHeight);

        this.lastScrollTop = 0;
        this._setPositions();
        this._addEventListeners();  

        /* mark elements that have  a child to show/hide */
        this.ui.$tocListItems.each(function(){
            var self = $(this);
            if((self).find('ol.toc__list--sub').length > 0) {
                self.addClass('toc__list__sub__exists');
                self.addClass('toc__list__can__show__more');
                self.addClass('toc__list__is__show__more');
            }
        });

        let self = this; 

        $(window).resize(function() {
            self._getElementSizes();
            self.ui.$tocInner.css('max-height', self.sidebarMaxHeight);
            self._setPositions();
            self._addEventListeners();
        });
    }
    _getElementSizes() {
        this.headerHeight = this.ui.$header.outerHeight();
        this.sidebarMaxHeight = "calc(95vh - " + this.headerHeight + "px)";
    }
    _getSidebarPosParent($sidebar) {
        let posParent = null;

        $sidebar.parents().each(function() {
             if ( $(this).css('position').length > 0 && $(this).css('position') != "static") {
                posParent = $(this);
                return false;
            }
        });

        return posParent;
    }
    _setPositions() {
        let containerTop    = this.ui.$container.offset().top - parseInt(this.ui.$container.css('marginTop'), 10),
            containerBottom = this.ui.$container.offset().top + this.ui.$container.outerHeight(true),
            sidebarParentOffset = this.ui.$sidebarPosParent ? this.ui.$sidebarPosParent.offset().top : 0;

        this.position = {
            window              : $(window).scrollTop(),                        // current position of the window
            windowBottom        : $(window).scrollTop() + $(window).height(),
            containerTop        : containerTop,                                 // position of the top of the main container
            containerBottom     : containerBottom,                              //position of the bottom of the main container
            sidebarTop          : this.ui.$sidebar.offset().top,
            sidebarBottom       : this.ui.$sidebar.offset().top + this.ui.$sidebar.outerHeight(true),
            sidebarParentOffset : sidebarParentOffset,
            sidebarAbsPosTop    : containerBottom - this.ui.$sidebar.outerHeight(true) - sidebarParentOffset, // the top pos of the sidebar that will align it the bottom of the main container
            //commentsTop         : this.ui.$comments.offset().top - this.headerHeight,
        }
    }
    _resizeSidebar() {
        let parentWidth = this.ui.$sidebar.parent().width();
        this.ui.$sidebar.css('width', parentWidth + 'px');
    }
    _onScroll() {
        this._setPositions();
        let toc = this.ui.$sidebar;
        let st = $(window).scrollTop();
        let scrollingOffset = Math.ceil(this.headerHeight) + 10;

        let setCss = (state) => {
            switch(state) {
                case 'mobile-sticky':
                    this.ui.$sidebar.css('top', '100px')
                        .css('position','fixed')
                        .css('width', '94%');
                    break;
                case 'mobile-at-top':
                    this.ui.$sidebar.css('position', 'static')
                        .css('width', '100%');
                    break;
                case 'sticky':
                    this.ui.$sidebar.css('top', scrollingOffset + 'px')
                        .css('position','fixed');
                    break;
                case 'at-bottom':
                    this.ui.$sidebar.css('top', this.position.sidebarAbsPosTop)
                        .css('position', 'absolute');
                    break;
                case 'at-top':
                    this.ui.$sidebar.css('position', 'static');
                    break;
            }  
        }

        if( $(window).width() >= 720) {

            this.lastScrollTop = st;

            if (this.position.window > this.position.containerTop && this.position.window < (this.position.sidebarAbsPosTop + this.position.sidebarParentOffset)) {
                this._resizeSidebar();
                setCss('sticky');

            } else if (this.position.window >= (this.position.sidebarAbsPosTop + this.position.sidebarParentOffset)) {
                setCss('at-bottom');
            } else {
                setCss('at-top');
            }
        } else {
            if (this.position.window + 100 > this.position.containerTop && this.position.window < (this.position.sidebarAbsPosTop + this.position.sidebarParentOffset)) {
                setCss('mobile-sticky');
            } else {
                setCss('mobile-at-top');
            }
        }
    }

    _addEventListeners() {
        let self = this;
                
        this.ui.$window.on('resize', this._resizeSidebar.bind(this))
        this.ui.$window.on('scroll', this._onScroll.bind(this))
        
        $('.js-toTop').off('click').on('click', function(e){
            e.preventDefault();
            $('html,body').animate({ scrollTop: 0 }, 'slow');
            $('#toc').children('.toc__list__sub__exists').attr('class','toc__list__item toc__list__sub__exists toc__list__can__show__more toc__list__is__show__more');
            return false;
        });

        $('.js-toDiscussion').off('click').on('click', function(e){
            e.preventDefault();
            $('html,body').animate({ scrollTop: self.ui.$comments.offset().top - self.headerHeight }, 'slow');
            $('#toc').children('.toc__list__sub__exists').attr('class','toc__list__item toc__list__sub__exists toc__list__can__show__more toc__list__is__show__more');
            return false;
        });

        
        $('.toc__list__item').off('click').on('click', function(e) {
            if ($(this).hasClass('toc__list__sub__exists')) {
                $(this).toggleClass('toc__list__can__show__more');

                if($(this).siblings('.toc__list__is__show__more').length) {
                    $(this).siblings('.toc__list__is__show__more').addClass('toc__list__can__show__more');
                }
            }
        }).children().click(function(e) {
            return false;
        });

        $('.toc__list__item a').on('click', function(e) {
            /* clicked anchor */
            if ($(this).parent().hasClass('toc__list__sub__exists')) {
                if($(this).parent().hasClass('toc__list__can__show__more')) {
                    $(this).parent().removeClass('toc__list__can__show__more');
                }
            }
            if($(this).parent().siblings('.toc__list__is__show__more').length) {
                $(this).parent().siblings('.toc__list__is__show__more').addClass('toc__list__can__show__more');
            }
        });

        /* toc reveal */
        $('.js-toggleSubNavigation').off('click').on('click', function(e) {
            if(self.ui.$sidebar.hasClass('mobile_hide_topics')) {
                $('.toggle_sub_navigation').html('Hide Topics');
                self.ui.$sidebar.removeClass('mobile_hide_topics');
            } else {
                $('.toggle_sub_navigation').html('Show Topics');
                self.ui.$sidebar.addClass('mobile_hide_topics');
            }
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