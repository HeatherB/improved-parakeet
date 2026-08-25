// -----------------------------------------------------
// Hero Header Stream
// -----------------------------------------------------
// if you do not append the iFrame AFTER the document has loaded
// it will break the layout.

function heroHeaderStream(){
    var $header = $('.hero-header');
    var $headerContent = $('.hero-header__content');
    var streamHeaderSelector = '.stream-overlay';
    var $streamHeader = $(streamHeaderSelector);
    var channelName = $streamHeader.data("channel-name");
    var iframeHTML = '<iframe src="https://player.twitch.tv/?channel=' + channelName + '&parent=' + window.location.host + '" frameborder="0">';
    var $embedContainer = $(streamHeaderSelector + ' .stream__embed');
    var closeButtonSelector = streamHeaderSelector + ' .stream__close';

    $headerContent.hide();
    $streamHeader.hide();

    if($header.hasClass('--streaming')) {
        $streamHeader.show();

        if($(window).width() >= 640) {
            $embedContainer.empty();
            $embedContainer.append(iframeHTML);
        }
    } else {
        $headerContent.show();
    }

    //on resize
    $(window).resize(function() {
        if($(window).width() >= 640){
            $embedContainer.empty();
            $embedContainer.append(iframeHTML);
        } else {
            $embedContainer.empty();
        }
    });

    // on close button click
    $(document).on('touchstart click', closeButtonSelector, function () {        
    
        if($('body').hasClass('home')) {
            $header.fadeOut(250);
            window.setTimeout(function() {
                $header.remove();
            }, 250);
        } else {
            $streamHeader.fadeOut(250);
            window.setTimeout(function() {
                $headerContent.fadeIn();
                $streamHeader.remove();
            }, 250);
        }
    });
}

// on doc ready
$(document).ready(function(){
    heroHeaderStream();
});

/* eslint-enable */