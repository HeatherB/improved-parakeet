$(document).ready(function() {
    if ($('body').hasClass('extralife')) {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = s.src = "//static.xsolla.com/embed/pay2play/2.1.2/widget.min.js";
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(s);

        var nodes = document.getElementsByClassName("xsolla");
        var xsollawidgets = [];
        for (var i = 0; i < nodes.length; i++) {
            var info = {};
            info.element = nodes[i];
            info.project_id = $(info.element).data('projectid');
            info.product_id = $(info.element).data('productid') + "";
            info.options = {
                access_data: {"settings":{"project_id": info.project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": info.product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: '#' + info.element.id
            };

            xsollawidgets[i] = info;
        } 

        s.addEventListener("load", function (e) {
            var widgets = [];
            for (var i = 0; i < xsollawidgets.length; i++) {
                widgets[i] = XPay2PlayWidget.create(xsollawidgets[i].options);
            }
        }, false);
    }

    var selects = document.getElementsByClassName("xsolla-select");
    for (var j = 0; j < selects.length; j++) {
        $(selects[j]).on("change", function() {
            var container = $(this).parent().parent();
            var buttons = container.find(".button");
            for (var k = 0; k < buttons.length; k++) {
                buttons[k].classList.remove("disabled");
                buttons[k].classList.add("hidden");
                if ($(buttons[k]).hasClass(this.value)) {
                    buttons[k].classList.remove("hidden");
                }
            }

        });
    }
});

