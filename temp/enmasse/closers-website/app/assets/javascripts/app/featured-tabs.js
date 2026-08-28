$(document).ready(function() {
    if ($(document.body).hasClass("home")) {
        var tabs = document.getElementById("featured-tabs").getElementsByClassName("tab");
        for (var i = 0; i < tabs.length; i++) {
            (function(i) {
                tabs[i].addEventListener("click", function() {
                    changeTabs(tabs[i], i);
                    /*if(i == 2) {
                        $('#vid-placehold').get(0).play();
                    } else {
                        $('#vid-placehold').get(0).pause();
                    }*/
                });
            })(i);
        }

        function changeTabs(node, index) {
            if (!$(node).hasClass("selected")) {
                // TABS
                for (var x = 0; x < tabs.length; x++) {
                    tabs[x].classList.remove("selected");
                }
                node.classList.add("selected");

                // CONTAINERS
                var containers = document.getElementById("featured-containers").getElementsByClassName("container");
                for (var i = 0; i < containers.length; i++) {
                    containers[i].classList.remove("selected");
                }
                containers[index].classList.add("selected");
            }
        }
    }
});