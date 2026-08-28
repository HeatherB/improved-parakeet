$(document).ready(function() {
    /*if($('body.receipt').length > 0) {
         special receipt instructions 
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
        var isFree = getParameterByName('code');
        if (isFree == "freepack") {
            $('.redeemTitle').html('Thank you for ordering your Free Elite Pack!');
            $('.redeemInstruct').html('Elite Pack Code: <b>FreeKOElitePack</b>. <br /><br />You can redeem your code by clicking the "Redeem a code" button in the <em>Kritika Online</em> game launcher and entering your code there, or you can redeem your code on our website by following these steps:');
        }
    }*/
    if($('body.shopping').length > 0 || $('body.bundles').length > 0) {
        /* script for nav bar */
        window.addEventListener('scroll', function() {
            togglePositionForNav();
            toggleSelection();
        });

        togglePositionForNav();
        toggleSelection();

        function togglePositionForNav() {
            if (document.querySelector("html").scrollTop != 0) {
                this.document.querySelector("#content_article_header").classList.add("scrolled");
            } else {
                this.document.querySelector("#content_article_header").classList.remove("scrolled");
            }
        }

        function toggleSelection() {
            var bundles = this.document.querySelectorAll(".bundle");
            var anchors = this.document.querySelectorAll("#packs-nav li");
            for (var i = 0; i < anchors.length; i++) {
                anchors[i].classList.remove("selected");
                var bundle = findBundleByHref(bundles, anchors[i].querySelector("a").href.split("#")[1]);
                if (bundle) {
                    if ($(window).scrollTop() + 20 > $(bundle).offset().top) {
                        removeSelectedFromAllAnchors(anchors);
                        anchors[i].classList.add("selected");
                    }
                }
            }
        }

        function removeSelectedFromAllAnchors(anchors) {
            for (var i = 0; i < anchors.length; i++) {
                anchors[i].classList.remove("selected");
            }
        }

        function findBundleByHref(bundles, href) {
            for (var i = 0; i < bundles.length; i++) {
                var bundle = $("#" + href);
                if (bundle) {
                    return bundle;
                }
            }
            return false;
        }
        
        if ($('body.shopping').length > 0) {
            document.querySelector("#packs-nav-close").addEventListener("click", function() {
                document.querySelector("#content_article_header").classList.remove("unhidden");
                document.querySelector("main").style.paddingTop = "40px";
            });
        }

        function loadNav() {
            document.querySelector("main").style.paddingTop = "158px";
            document.querySelector("#content_article_header").classList.add("unhidden");
        }

        loadNav();
        /* we are on a shopping page */
        
    /* new part */
    /*var options = {
        access_data: {"settings":{"project_id":21259},"purchase":{"pin_codes":{"codes":[{"digital_content":"3464"}]}}},
        theme : {
            foreground: "green",
            background: "light"
        },
        target_element: "#XS-pay2play-widget-1"
    };
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";
    s.addEventListener("load", function (e) {
        var widgetInstance = XPay2PlayWidget.create(options);
    }, false);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(s);*/

        /* end new part */
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";
        /*s.addEventListener("load", function (e) {
            var widgetInstance = XPay2PlayWidget.create(options);
        }, false);*/
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(s);

        $(".bundle_button").on('mouseenter', function() {
            $(this).nextAll('.btn-plate').addClass('hover');
        });
        $(".bundle_button").on('mouseleave', function() {
            $(this).nextAll('.btn-plate').removeClass('hover');
        });


        /*
        Xsolla project ID: 24179 

        Trainee Bundle ID: 3833 
        Agent Bundle ID: 3834 
        UNION hero bundle id: 3836 
        Ace Closer bundle id: 3837
        */


        /* Ace Closer bundle */
        if($("#XS-pay2play-widget-1").length) {
            var widget = $('#XS-pay2play-widget-1');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options1 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-1"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance1 = XPay2PlayWidget.create(options1);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        /* UNION hero bundle */
        if($("#XS-pay2play-widget-2").length) {
            var widget = $('#XS-pay2play-widget-2');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options2 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-2"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance2 = XPay2PlayWidget.create(options2);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        /* Agent bundle */
        if($("#XS-pay2play-widget-3").length) {
            var widget = $('#XS-pay2play-widget-3');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options3 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-3"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance3 = XPay2PlayWidget.create(options3);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        /* Trainee bundle */
        if($("#XS-pay2play-widget-4").length) {
            var widget = $('#XS-pay2play-widget-4');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options4 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-4"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance4 = XPay2PlayWidget.create(options4);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        /* Operator Bundle */
        if($("#XS-pay2play-widget-5").length) {
            var widget = $('#XS-pay2play-widget-5');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options5 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-5"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance5 = XPay2PlayWidget.create(options5);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        /* Operator Bundle */
        if($("#XS-pay2play-widget-6").length) {
            var widget = $('#XS-pay2play-widget-6');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options6 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-6"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance6 = XPay2PlayWidget.create(options6);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };
        if($("#XS-pay2play-widget-7").length) {
            var widget = $('#XS-pay2play-widget-7');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options7 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-7"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance7 = XPay2PlayWidget.create(options7);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        if($("#XS-pay2play-widget-8").length) {
            var widget = $('#XS-pay2play-widget-8');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options8 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-8"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance8 = XPay2PlayWidget.create(options8);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        if($("#XS-pay2play-widget-9").length) {
            var widget = $('#XS-pay2play-widget-9');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options9 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-9"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance8 = XPay2PlayWidget.create(options9);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };

        if($("#XS-pay2play-widget-10").length) {
            var widget = $('#XS-pay2play-widget-10');
            var project_id = widget.data('project_id');
            var product_id = "" + widget.data('id');
            var options10 = {
                access_data: {"settings":{"project_id": project_id},"purchase":{"pin_codes":{"codes":[{"digital_content": product_id}]}}},
                theme : {
                    foreground: "green",
                    background: "light"
                },
                lightbox: {
                    overlayOpacity: '.8',
                    spinner: 'round'
                },
                target_element: "#XS-pay2play-widget-10"
            };
            /*var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = "//static.xsolla.com/embed/pay2play/2.1.0/widget.min.js";*/
            s.addEventListener("load", function (e) {
                var widgetInstance8 = XPay2PlayWidget.create(options10);
            }, false);
            /*var head = document.getElementsByTagName("head")[0];
            head.appendChild(s);*/
            $(".xpay2Play-widget-payment-button").on('click', function() {
                //console.log('hovered no 2');
                $(this).toggleClass('hover');
            });
        };


        
    } /* end shopping page restriction */

});
