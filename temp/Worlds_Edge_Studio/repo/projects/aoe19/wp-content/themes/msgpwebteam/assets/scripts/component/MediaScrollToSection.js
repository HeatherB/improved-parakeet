/* eslint-disable */

function scrollToMediaSection(){

    function checkForUrlParam(urlParamName){
        var currentUrl = window.location.href;
        if(currentUrl.indexOf('?' + urlParamName + '=') != -1)
            return true;
        else if(currentUrl.indexOf('&' + urlParamName + '=') != -1)
            return true;
        return false
    }

    var urlParamName = 'section';
    var urlParamPresent = checkForUrlParam(urlParamName);

    if(urlParamPresent === true){

        var urlParamValue = new RegExp('[\?&]' + urlParamName + '=([^&#]*)').exec(window.location.href);

        var mediaScrollToSection = urlParamValue[1];

        // Scroll to section
        var mediaSection = document.getElementById(mediaScrollToSection);
        mediaSection.scrollIntoView({
            behavior: 'smooth'
        });

    }



}


$(document).ready(function(){
    scrollToMediaSection();
});


/* eslint-enable */