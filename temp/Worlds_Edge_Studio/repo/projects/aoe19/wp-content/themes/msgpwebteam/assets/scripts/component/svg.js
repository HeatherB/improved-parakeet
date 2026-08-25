export default class SVGconverter {
    constructor(){
        $('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            if ( imgURL.indexOf('.svg') >= 1 ){
                jQuery.get(imgURL, function(data){
                    var $svg = jQuery(data).find('svg'); //Get the SVG tag, ignore the rest

                    if ( typeof imgID !== 'undefined' ){
                        $svg = $svg.attr('id', imgID); //Add replaced image's ID to the new SVG
                    }

                    if ( typeof imgClass !== 'undefined' ){
                        $svg = $svg.attr('class', imgClass + ' replaced-svg'); //Add replaced image's classes to the new SVG
                    }

                    $svg = $svg.removeAttr('xmlns:a'); //Remove any invalid XML tags as per http://validator.w3.org

                    $img.replaceWith($svg); //Replace image with new SVG
                }, 'xml');
            }
        });
    }
}