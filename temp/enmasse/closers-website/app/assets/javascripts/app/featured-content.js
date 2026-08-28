$(document).ready(function() {
    if ($(document.body).hasClass("home")) {
        var tabs = document.getElementById("featured-content-tabs").getElementsByClassName("tab");
        var currentTab = 0;
        var timeout;
        var flag = true;
        for (var i = 0; i < tabs.length; i++) {
            (function(i) {
                tabs[i].addEventListener("click", function() {
                    flag = false;
                    changeTabs(tabs[i], i);
                });
            })(i);
        }

        function changeTabs(node, index) {
            if (!$(node).hasClass("selected")) {
                // TABS
                for (var x = 0; x < tabs.length; x++) {
                    tabs[x].classList.remove("selected");
                    tabs[x].src = "/assets/icons/pagination-deselected.png";
                }
                node.src = "/assets/icons/pagination-selected.png";
                node.classList.add("selected");

                var container = document.getElementById("featured-content");
                var contentWidth = container.offsetWidth;

                container.children[0].style.marginLeft = contentWidth * index * -1 + "px";

                currentTab = index;
                
                timeChangeTab();
            }
        }

        function timeChangeTab() {
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                if (flag) {
                    if (currentTab != 2) {
                        currentTab++;
                    } else {
                        currentTab = 0;
                    }
                    changeTabs(tabs[currentTab], currentTab);
                }
            }, 8000);
        }

        timeChangeTab();

    }  

});