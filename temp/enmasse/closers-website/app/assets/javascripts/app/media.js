$(function() {
    
    var downloads = document.getElementsByClassName("downloads");
    for (var i = 0; i < downloads.length; i++) {
        var links = downloads[i].getElementsByTagName("a");
        for (var j = 0; j < links.length; j++) {
            links[j].setAttribute("download", "Closers_Wallpaper");
        }
    }

});