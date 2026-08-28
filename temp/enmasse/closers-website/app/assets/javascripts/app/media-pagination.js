$(document).ready(function() {
    var containers = document.getElementsByClassName("media-section");
    var pageMargin = -567;
    for (var i = 0; i < containers.length; i++) {
        new pagination(containers[i]);
    }

    function pagination(node) {
        this.node = node;
        this.items = node.getElementsByClassName("media-container")[0].getElementsByClassName("item");

        this.init = function() {
            this.createPaginateButtons();
        }

        this.createPaginateButtons = function() {
            var buttonCount = Math.ceil(this.items.length / 6);
            for (var i = 0; i < buttonCount; i++) {
                var selected = "";
                if (i == 0) {
                    var selected = " selected";
                }
                this.node.getElementsByClassName("pagination")[0].innerHTML += "<div class='page" + selected + "'><span>" + (i + 1) + "/" + buttonCount + "</span><button page='" + i + "' class='page-btn'></button></div>";
            }
        }

        this.changePage = function(button) {
            var page = button.getAttribute("page");
            var buttons = this.node.getElementsByClassName("page");

            this.node.getElementsByClassName("media-container")[0].getElementsByClassName("wrapper")[0].style.marginTop = page * pageMargin + "px";
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.remove("selected");
            }
            button.parentElement.classList.add("selected");
        }

        this.init();

        this.node.addEventListener("click", function(){
            if ($(event.target).hasClass("page-btn")) {
                this.changePage(event.target);
            }
        }.bind(this));
    }
});