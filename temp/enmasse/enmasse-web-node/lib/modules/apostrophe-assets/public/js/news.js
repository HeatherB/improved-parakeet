;(function($) {  
   
    var self = this;
    var apiUrl = '/api/v1/';
    var loadMoreSelector = '#blog-load-more';
    var loadedPageQuery = window.location.search;
    var gridSelector = '#news .grid';
    var pagerFallbackSelector = '#blog-pager-container';
    var featuredImageSelector = '#featured-content-image';
    var firstLoad = true;
    
    /**
     * Check for pager query var
     * If exists disable infinite scroll
    */
    self.checkPagerStatus = function() {
        var pager = self.getUrlParameter('pager');
        if ( loadedPageQuery != '' && pager && pager == '1' ) {
            self.disableInfiniteScroll();
        }
    }

    /**
     * Disable infinite scroll, show pagination
     */
    self.disableInfiniteScroll = function() {
        $( loadMoreSelector ).hide();
        
        $( pagerFallbackSelector ).find('a').each(function(){
            var link = $(this).attr('href');
            var add_pager_link = self.setUrlParameter( link, 'pager', '1' );
            $(this).attr('href', add_pager_link);
        });
        $( pagerFallbackSelector ).show();
    }


    /**
     * We layer the featured post on top of placeholders due to how the grid is structured
     * On Resize we set the height to keep the grid intact, then copy the featured HTML for mobile
     * Everything is handlded via CSS, here we're just juggling content
     */
    self.setFeaturedHeightAndCloneInnerHTML = function( offsetHeight ) {
        var featured_blog_article = document.getElementById('featured_content');
        if ( !offsetHeight ) {
            offsetHeight = 0;
        }
        if ( featured_blog_article ) {
            var featured_content = featured_blog_article.innerHTML;
            var featured_height = featured_blog_article.scrollHeight;
            var featured_placeholders = document.getElementsByClassName('featured');
            for( var i = 0; i < featured_placeholders.length; i++ ) {
                // offset height accounts for hidden content that shows on hover
                featured_placeholders[i].style.height = Math.floor( featured_height - offsetHeight ) + 'px';
                // placeholder shows content on mobile because featured absolute box isn't necessary for a 1 column layout
                if ( featured_placeholders[i].classList.contains('placeholder') ) {
                    featured_placeholders[i].innerHTML = featured_content;
                }
            }
            $(gridSelector).addClass('active');
        }
    }

    /**
     * Bootstraps on all images loaded to set correct heights
     */
    self.initSetCalcHeights = function() {
        self.setCalcHeights();
    }

    /**
     * Sets correct heights
     */
    self.setCalcHeights = function() {
        //var setHiddenOffset = self.calculateIrregularBoxHeights();
        var setHiddenOffset = 0;
        self.setFeaturedHeightAndCloneInnerHTML( setHiddenOffset );
        if ( firstLoad == true ) {
            $('#news').addClass('loaded');
            firstLoad = false;
        } 
    }

    /**
     *  to make loading a bit smoother for images and have less grid loading jank
     *  Currently disabled beacuase each element now needs extra TLC for dynamic hover state action.
    */ 
    self.setFeaturedHeightAndCloneInnerHTMLInit = function() {
        if ( $(featuredImageSelector).length ) {
            $(featuredImageSelector).one("load", function() {
            }).each(function() {
                // helps mitigate unpredictable behavior on cached image
                if(this.complete) {
                    $(this).trigger('load');
                }
            });
        }
        else {
            self.setCalcHeights();
            var resizeEvent = window.document.createEvent('UIEvents'); 
            resizeEvent.initUIEvent('resize', true, false, window, 0); 
            window.dispatchEvent(resizeEvent);
        }
    }

    /**
     * Throttling resize events for performance
     */
    self.throttleResizeInit = function() {
        var eventTimeout; // Set timeout variable

        /**
         * The function that runs the event actions
         */
        var actualEventHandler = function () {
            // resize elements for reveal box content structure
            self.setCalcHeights();
            
        };

        /**
         * Throttle events
         */
        var eventThrottler = function () {
            // ignore resize events as long as an actualResizeHandler execution is in the queue
            if ( !eventTimeout ) {
                eventTimeout = setTimeout(function() {
                    eventTimeout = null;
                    actualEventHandler();
                }, 100 );
            }
        };

        // Run the event listener
        window.addEventListener( 'resize', eventThrottler, false );
    };

    /**
     * get query string vars
     */ 
    self.getUrlParameter = function( name ) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    /**
     * set query string vars
     */ 
    self.setUrlParameter = function(url, key, value) {
        var key = encodeURIComponent(key),
            value = encodeURIComponent(value);
    
        var baseUrl = url.split('?')[0],
            newParam = key + '=' + value,
            params = '?' + newParam;
    
        if (url.split('?')[1] === undefined){ // if there are no query strings, make urlQueryString empty
            urlQueryString = '';
        } else {
            urlQueryString = '?' + url.split('?')[1];
        }
    
        // If the "search" string exists, then build params from it
        if (urlQueryString) {
            var updateRegex = new RegExp('([\?&])' + key + '[^&]*');
            var removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');
    
            if (value === undefined || value === null || value === '') { // Remove param if value is empty
                params = urlQueryString.replace(removeRegex, "$1");
                params = params.replace(/[&;]$/, "");
                
            } else if (urlQueryString.match(updateRegex) !== null) { // If param exists already, update it
                params = urlQueryString.replace(updateRegex, "$1" + newParam);
                
            } else if (urlQueryString == '') { // If there are no query strings
                params = '?' + newParam;
            } else { // Otherwise, add it to end of query string
                params = urlQueryString + '&' + newParam;
            }
        }
    
        // no parameter was set so we don't need the question mark
        params = params === '?' ? '' : params;
    
        return baseUrl + params;
    }
    
    /**
     * initialize infinite scroll
     */ 
    self.loadMoreInit = function() {

        $(document).on('click touch', loadMoreSelector, function( event ) {
            event.preventDefault();
            // check for disable for last page
            if ( !$(this).is('[disabled=disabled]') ) {
                var reqs = self.loadMorePrepare( $(this) );
                if ( reqs ) {
                    self.loadMoreAction ( reqs );
                }
            }
        });

    }

    /**
     * prepare query for pagination, tags
     */ 
    self.loadMorePrepare = function( el ) {
        var reqs = {};
        
        var button = el;
        var currentPage = button.attr('data-current-page');
        var totalPages = button.attr('data-total-pages');
        var apiModule = button.attr('data-piece');
        var qs = {};
        var newPage;

        if ( currentPage < totalPages ) {
            newPage = parseInt(currentPage, 10) + 1;
        }

        var tags = self.getUrlParameter('tag');
        if ( loadedPageQuery != '' && tags ) {
            qs.tags = tags;
        }
    
        qs.page = newPage;
        reqs.el = el;

        reqs.url = window.location.origin + apiUrl + apiModule
        reqs.url = reqs.url + '?' + jQuery.param( qs );
        return reqs;
    }

    /**
     * Getting more news posts
     */
    self.loadMoreAction = function( reqs ) {
        $.ajax({
            beforeSend: function() { self.toggleLoadingAnimation( reqs.el ) },
            url: reqs.url,
            type: 'GET',
            success: function(res) {
                //console.log(properWordingArr);
                self.toggleLoadingAnimation( reqs.el );
                self.loadMorePopulate( res );
                self.updateLoadMoreButton( res, reqs.el );
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                self.toggleLoadingAnimation( reqs.el );
                self.disableInfiniteScroll();
                console.log("Status: " + textStatus); console.log("Error: " + errorThrown); 
            }    
        });
    }

    /**
     * Toggling loading animation
     */
    self.toggleLoadingAnimation = function( element ) {
        element.toggleClass('loading');
    }

    /**
     * populates grid with items
     */ 
    self.loadMorePopulate = function( payload ) {
        if ( payload ) {
            var grid = $(gridSelector);
            var items = [];
            // creates new grid items from payload
            // pushed to array for salvattore
            for( var i = 0; i < payload['results'].length; i++ ) {
                var content = payload['results'][i];
                var domString = self.loadMorePopulateTemplateReturn( content );
                var item = document.createElement('div');
                item.className="box loading-image loaded-blog-post-preview " + content['articleType'];
                item.innerHTML = domString;
                items.push(item);
            }
            // salvattore appends them and bootstraps column layout
            salvattore.appendElements( grid[0], items );
            // jquery sets correct heights when all images have loaded
            $(items).imagesLoaded().then(function(){
                self.setCalcHeights();
                $(items).each(function(){ $(this).removeClass('loading-image').addClass('loaded-image') } );
            });
           
        }
    }

    /**
     * prepares load more button for next query
     */ 
    self.updateLoadMoreButton = function( payload, loadMoreDOM ){
        var button = loadMoreDOM;
        button.attr('data-current-page', payload.currentPage );
        button.attr('data-total-pages', payload.pages);
        // no more pages, disable button
        if ( parseInt(payload.currentPage, 10) === parseInt( payload.pages, 10 ) ) {
            button.attr('disabled', true ).addClass('disabled');
        }
    }

    /**
     * digs into API response for featuredImages - more performant than another api call
     */ 
    self.findNestedImageURL = function( obj, size ) {
        var imgURL = null;
        var hasImage = ( obj.hasOwnProperty( 'featuredImageList' ) && obj[ 'featuredImageList' ]  );
        if ( hasImage ) {
            var featuredImage = obj[ 'featuredImageList' ];
            var items = featuredImage['items'];
            if ( items.length > 0 ) {
                var firstFeatured = items[0];
                var image = ( firstFeatured.hasOwnProperty( 'type' ) && firstFeatured[ 'type' ] == 'apostrophe-images'  );
                if ( image ) {
                    imgURL = firstFeatured['_pieces'][0]['item']['attachment']['_urls'][size];
                }
            }
        }
        return imgURL;
    }

    /**
     * renders part of html based on articleType
     */ 
    self.delegateArticleTypeInfo = function( obj ) {
        var hasArticleType = ( obj.hasOwnProperty( 'articleType' ) && obj[ 'articleType' ]  );
        var origin = window.location.origin;
        var boxCalloutHtml = '';
        var calloutLinkHtml = '';
        if ( hasArticleType ) {
            var articleType = obj[ 'articleType' ];
            var articleText = 'Read More';

            calloutLinkHtml += '<div class="action">';

            if ( articleType == 'link' ) {
                var linkText = ( obj[ 'externalLinkText' ] ) ? obj[ 'externalLinkText' ] : 'Learn More';
                boxCalloutHtml += '<a class="link box-link" target="' + obj['externalLinkBehavior'] + '" href="' + obj['externalLink'] + '"></a>';
                calloutLinkHtml += '<a class="link btn" target="' + obj['externalLinkBehavior'] + '" href="' + obj['externalLink'] + '"><span>' + linkText + '</span></a>';
            }
            else if ( articleType == 'video' ) {
                var linkText = ( obj[ 'videoText' ] ) ? obj[ 'videoText' ] : 'Play';
                boxCalloutHtml += '<a data-lity class="video link box-link" href="' + obj['featuredVideoID'] + '" target="_self"></a>';
                calloutLinkHtml += '<a data-lity class="video btn" href="' + obj['featuredVideoID'] + '" target="_self"><span>' + linkText + '</span></a>';
            }
            else {
                boxCalloutHtml += '<a class="article link box-link" href="' + origin + obj['_url'] + '"></a>';
                calloutLinkHtml += '<a class="article btn" href="' + origin + obj['_url'] + '"><span>Read More</span></a>';
            }

            calloutLinkHtml += '</div>';
        }
        return { 'box': boxCalloutHtml, 'callout': calloutLinkHtml };
    }
    
    /**
     * renders HTML
     */ 
    self.loadMorePopulateTemplateReturn = function( obj ) {
        var html = '';
        var origin = window.location.origin;
        var hasImage = ( obj.hasOwnProperty( 'featuredImage' ) && obj[ 'featuredImage' ]  );
        var hasTags = ( obj.hasOwnProperty( 'tags' ) && obj[ 'tags' ] );
        var imageURL = self.findNestedImageURL( obj, 'two-thirds' );
        
        var articleHTML = self.delegateArticleTypeInfo( obj );

        html += '<div class="box-animate">';

            if ( hasImage && imageURL ) {
                html += '<div class="featured-image-container">';
                html += '<img class="featured-image" src="' + imageURL + '" alt="' + obj.title + '" />';
                html += '<div class="hover-state"></div>';
                html += '</div>';
            }
            html += articleHTML.box;
            html += '<div class="blog-post-content">';
                html += '<div class="blog-post-calc-container">';
                    html += '<div class="blog-post-meta">';
                    html += '<h6 class="blog-post-date">' + self.formatArticleDate( obj.publishedAt ) + '</h6>';
                    if ( hasTags ) {
                        var tagClasses = 'article-tag-container';
                        html += '<div class="' + tagClasses + '">';
                        for( var j = 0; j < obj['tags'].length; j++ ) {
                            var tag = obj['tags'][j];
                            var tagTitle = self.parseTag( tag );
                            html +=  '<a class="article-tag" data-label="' + tag + '" href="/news?tags=' + tag + '" title="' + tagTitle + '">' + tagTitle + '</a>'
                        }
                        html += '</div>';
                    }
                    
                    html += '</div>';
                html += '<h2 class="blog-post-title">' + obj.title + '</h2>';
                html += '</div>';
                html += '<div class="blog-post-sub-content">';
               
                html += '<p class="blog-post-excerpt">' + obj.excerpt + '</p>';
                html += articleHTML.callout;
                html += '</div>';
            html += '</div>';
        html += '</div>';

        return html;
    }

    self.parseTag = function( tag ){

        var rules = window.enM || {};
        var newStr = tag;
        var properWordingObj = rules;
            
        if ( properWordingObj ) {
            for( var k in properWordingObj ) {
                if ( properWordingObj.hasOwnProperty( k ) ) {
                    if ( newStr.includes( k ) ) {
                        newStr = newStr.replace(new RegExp(k, 'g'), '<span>' + properWordingObj[k] + '</span>');
                    }

                }
            }
        }
        return newStr
    }

    /**
     * reformats article date to design spec
     */ 
    self.formatArticleDate = function(date) {
        var options = { year: 'numeric', month: 'short', day: 'numeric' };
        var dateObj = new Date(date + 'T00:00:00');
        return dateObj.toLocaleDateString( 'en-US', options );
    }

    /**
     * calculate heights for irregular card reveal animation
     */ 
    self.calculateIrregularBoxHeights = function() {
       
        var boxes = $('.box');
        var returnOffset = 0;
        if ( boxes.length > 0 ) {
            boxes.each(function(){
                var content = $(this).find('.blog-post-content');
                if ( content.length > 0 ) {
                    var calcHeight = 0;
                    var img = $(this).find('.featured-image');
                    if ( img.length ) {
                        calcHeight += img.outerHeight();
                    }
                    var contentContainer = $(this).find('.blog-post-calc-container');
                    var contentContainerHeight = contentContainer.outerHeight();
                    calcHeight += contentContainerHeight + 25;
                    $(this).height( calcHeight + 40 );
                    returnOffset = content.outerHeight() - ( contentContainerHeight + 70 )
                    $(this).attr('data-transform-y', returnOffset );
                }
            });
        }
        return returnOffset;
    }

    /**
     * init hover state for irregular card content reveal
     */
    self.initIrregularCardHoverReveal = function() {

        $(document).on('mouseenter touchenter', '.box', function(){
            if ( $(window).width() > 1 ) {
                self.onHOverRevealOn( $(this) )
            }
        });
        $(document).on('mouseleave touchleave', '.box', function(){
            if ( $(window).width() > 1 ) {
                self.onHOverRevealOff( $(this) )
            }
        });
    }

    /**
     * Hover state on
     */
    self.onHOverRevealOn = function( dom ) {
        dom.addClass('hover');
        var translateVal = dom.attr('data-transform-y');
        if ( translateVal && translateVal > 0 ) {
        dom.find('.blog-post-content').css({
            '-webkit-transform' : 'translateY(' + ( parseInt(translateVal) * -1 ) + 'px)',
            '-moz-transform'    : 'translateY(' + ( parseInt(translateVal) * -1 ) + 'px)',
            '-ms-transform'     : 'translateY(' + ( parseInt(translateVal) * -1 ) + 'px)',
            '-o-transform'      : 'translateY(' + ( parseInt(translateVal) * -1 ) + 'px)',
            'transform'         : 'translateY(' + ( parseInt(translateVal) * -1 ) + 'px)'
          });
        }
    }

    /**
     * Hover state off
     */
    self.onHOverRevealOff = function( dom ) {
        dom.removeClass('hover');
        var translateVal = dom.attr('data-transform-y');
        if ( translateVal && translateVal > 0 ) {
        dom.find('.blog-post-content').css({
            '-webkit-transform' : 'translateY(0px)',
            '-moz-transform'    : 'translateY(0px)',
            '-ms-transform'     : 'translateY(0px)',
            '-o-transform'      : 'translateY(0px)',
            'transform'         : 'translateY(0px)'
          });
        }
    }

    /**
     * triggers everything, loads events
     */ 
    $(document).ready( function() {
        if ( $( '#news' ).length ) {
            self.checkPagerStatus();
            self.throttleResizeInit();
            self.loadMoreInit();
            self.initIrregularCardHoverReveal();
        }
    });
    $(window).on('load', function(){
        if ( $( '#news' ).length ) {
            //self.setFeaturedHeightAndCloneInnerHTMLInit();
            self.initSetCalcHeights();
        }
    });
 
})(jQuery);