$(document).ready(function() {
    if ($(document.body).hasClass("characters") || $(document.body).hasClass("wolf") || $(document.body).hasClass("wildhunter")) {

        $('a.character').on('click', function(e) {
            e.preventDefault();
            var selectedProfile = $(this).data('profile');
            if(selectedProfile) {
                $('.profile').removeClass('meetMe');
                $('.profile#' + selectedProfile).addClass('meetMe');
            }
        })

        /*$(window).on("hashchange", function (e) {
            var chars = document.getElementsByClassName('profile');
            for (var i = 0; i < chars.length; i++) {
                chars[i].style.display = "none";
            }

            if ($(document.body).hasClass("characters")) {
                switch(location.hash) {
                    case '#Sylvi':
                        document.getElementById('Sylvi').style.display = "block";
                        break;
                    case '#Yuri':
                        document.getElementById('Yuri').style.display = "block";
                        break;
                    case '#Misteltein':
                        document.getElementById('Misteltein').style.display = "block";
                        break;
                    case '#J':
                        document.getElementById('J').style.display = "block";
                        break;
                    default:
                        document.getElementById('Seha').style.display = "block";
                }
            } else if ($(document.body).hasClass("wolf")) {
                switch(location.hash) {
                    case '#Levia':
                        document.getElementById('Levia').style.display = "block";
                        break;
                    case '#Nata':
                        document.getElementById('Nata').style.display= "block";
                        break;
                    case '#Tina':
                        document.getElementById('Tina').style.display= "block";
                        break;
                    case '#Harpy':
                        document.getElementById('Harpy').style.display= "block";
                        break;
                    case '#Violet':
                        document.getElementById('Violet').style.display= "block";
                        break;
                    default:
                        document.getElementById('Levia').style.display = "block";
                }
            } else if ($(document.body).hasClass("wildhunter")) {
                switch(location.hash) {
                    case '#Wolfgang':
                        document.getElementById('Wolfgang').style.display = "block";
                        break;
                    case '#Soma':
                        document.getElementById('Soma').style.display = "block";
                        break;
                    case '#Luna':
                        document.getElementById('Luna').style.display = "block";
                        break;
                    case '#Bai':
                        document.getElementById('Bai').style.display = "block";
                        break;
                    default:
                        document.getElementById('Wolfgang').style.display = "block";
                }
            }
        });

        $(document).ready(function () {
            var hash = location.hash;
            $(window).trigger('hashchange');

            var tabs = document.getElementsByClassName('character');

            for (var i = 0; i < tabs.length; i++) {
                if (!$(tabs[i]).hasClass("inactive")) {
                    tabs[i].addEventListener('click', function(e) {
                        location.hash = $(e.target).data("profile");
                    });
                }
            }
        });*/

        /*var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
        
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
        
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            }
        };

        var character = getUrlParameter("character");
        console.log("the character is: " + character);*/

        // Little hack to fix About page not highlighting on Wolf dogs page
       // $(".nav .first").addClass("selected");
    }
});