$(function() {

    //var arr = [createNodeArray("scroll-popup"), createNodeArray("scroll-popout")];
    var classes = ["scroll-popup", "scroll-popout"];
    var arr = createNodeArray(classes);

    loadClassStyles(arr);

    setTimeout(function(){ 
        for (var i = 0; i < arr.length; i++) {
            if (checkIfElementIsInView(arr[i])) {
                arr[i].node.style.transform = animations(arr[i].type, "finish");
            }
        }
        /*arr.forEach(function(value) {
            if (checkIfElementIsInView(value)) {
                value.node.style.transform = animations(value.type, "finish");
            }
        });*/
    }, 500); // run animations after page load if they're in view

    document.addEventListener("scroll", function() {
        arr.forEach(function(value) {
            if (checkIfElementIsInView(value)) {
                value.node.style.transform = animations(value.type, "finish");
            }
        });
    });

    function createNodeArray(classes) {
        var arr = [];
        classes.forEach(function(name) {
            var nodes = document.getElementsByClassName(name);
            Array.prototype.forEach.call(nodes, function(node){
                arr.push({"node": node, "type": name});
            });
        });

        return arr;
    }
    
    function loadClassStyles(arr) {
        arr.forEach(function(value) {
            //if (!checkIfElementIsInView(value)) {
                value.node.style.transform = animations(value.type, "start");
                value.node.style.transition = "500ms";
            //}
        });
    }
    
    function checkIfElementIsInView(value) {
        var position = value.node.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;

        if (value.type == "scroll-popup") {
            windowHeight += 600;
        } else if (value.type == "scroll-popout") {
            windowHeight -= 100;
        }

        return (position < windowHeight) ? true : false;
    }

    function animations(animation, type) {
        if (animation == "scroll-popup") {
            if (type == "start") {
                return "translateY(800px)";
            } else if (type == "finish") {
                return "translateY(0px)";
            }
        } else if (animation == "scroll-popout") {
            if (type == "start") {
                return "scale(0)";
            } else if (type == "finish") {
                return "scale(1)";
            }
        }
    }
});