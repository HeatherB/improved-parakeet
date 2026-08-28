$(function() {

    var bgs = document.getElementsByClassName('youtube-bg');
    for (var i = 0; i < bgs.length; i++) {
        var youtubeID = youtube_parser($(bgs[i].getElementsByClassName('youtube-data')[0]).data('video'));
        bgs[i].style.backgroundImage = "url('https://img.youtube.com/vi/" + youtubeID + "/hqdefault.jpg')";
    }

    function youtube_parser(url){
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[2].length==11){
            return match[2];
        }
        else{
            //error
        }
    }
});