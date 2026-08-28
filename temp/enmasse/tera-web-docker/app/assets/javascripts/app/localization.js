function setLocalization() {
    // var language = navigator.languages && navigator.languages[0] || // Chrome / Firefox
    //     navigator.language ||   // All browsers
    //     navigator.userLanguage; // IE <= 10
    var region_language = window.navigator.userLanguage || window.navigator.language;

    if($('.packs-layout')) {
        if (region_language == "en-US") {
            //console.log('american english ', region_language);
            $('.packs-layout li[data-ps="ps-na"]').css('display','inline-block');
            $('.packs-layout li[data-ps="ps-eu"]').hide();
        } else if (region_language == "en-GB") {
            //console.log('great britian english ', region_language);
            $('.packs-layout li[data-ps="ps-na"]').hide();
            $('.packs-layout li[data-ps="ps-eu"]').css('display','inline-block');
        } else {
            //console.log(region_language);
        }
    }


   // document.cookie = "eme_localization=" +  region_language.substr(0,2);
}

setLocalization();