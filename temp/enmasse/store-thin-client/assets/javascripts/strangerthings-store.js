$(document).ready(function() {

    if ($('#strangerthings-shop')) {

        /* clicked login link */
        $('.login-popup-link').on('click', function(e) {
            if (_gaq) {_gaq.push(['_trackEvent', 'Stranger Things 3 The Game', 'Login clicked', '/strangerthings3thegame'])};
        });

        /* stranger things store page */
        $('.purchase_initiate_button').on('click', function(event) {
            event.preventDefault();
            var st3_product_id = $(this).data('product-id');
            if (_gaq) {_gaq.push(['_trackEvent', 'Stranger Things 3 The Game', 'Purchase button', '/strangerthings3thegame'])};
            $("#shop_initiate_form #product_id").val(st3_product_id);
            $("#shop_initiate_form").submit();
        });

        // scripts for purchase confirmation page - provided for already on billing scripts
        if ($('#purchase-confirmation').length > 0) {
            var xsolla_payment_ui = {
            eventObject: $({}),
            paymentDone: false,
            paymentInfo: null,
            gameName: 'tera',
            init: function () {
                self = this;

                matches = /^\/(\w+)\/.*$/.exec(window.location.pathname);
                if (matches != null) {
                self.gameName = matches[1];
                }
                // install event listener to listen events from Xsolla PayStation
                window.addEventListener("message", function (event) {
                if ($('#gofillup-iframe')[0] && event.source !== $('#gofillup-iframe')[0].contentWindow) {
                    return;
                }
                var message = {};
                try {
                    message = JSON.parse(event.data);
                } catch (e) {
                }
                if (message.command) {
                    self.eventObject.trigger(message.command, message.data);
                }
                });

                // bind close button of the xsolla iframe window
                $('#gofillup-screen-close').click(function () {
                    self.hide();
                    var resultcode = 0;
                    var resultmsg = '';
                    var tid = 0;
                    var email = '';
                    if (self.paymentDone === false) {
                        resultcode = 301;   // payment cancel
                    } else {
                        resultcode = 0;
                        resultmsg = self.paymentInfo.status;
                        tid = self.paymentInfo.invoice;
                        email = self.paymentInfo.email;
                    }
                    // redirect to confirmation page
                    $.ajax({
                        type: 'POST',
                        url: '/' + self.gameName + '/xsolla-payment-confirmation',
                        data: {
                        resultcode: resultcode,
                        resultmsg: resultmsg,
                        tid: tid,
                        email: email
                        }
                    }).done(function (data) {
                        window.location.href = window.location.protocol + "//" + window.location.host + "/" + self.gameName + "/payment-confirmation";
                    }).fail(function (xhr, textStatus, errorThrown) {
                        //console.log('POST xsolla-payment-confirmation fail');
                        //console.log(textStatus);
                        if (_gaq) {_gaq.push(['_trackEvent', 'Stranger Things 3 The Game', 'Purchase failed', textStatus])};
                        // redirect to the first page of the store
                        //window.location.href = window.location.protocol + "//" + window.location.host + "/" + self.gameName
                        window.location.href = window.location.protocol + "//" + window.location.host + "/strangerthings3thegame"
                    });
                    });

                    // bind events from PayStation
                    self.on('widget-detection', function (event, data) {
                    // PayStation initialized
                    self.paymentDone = false;
                    });

                    self.on('status', function (event, data) {
                    if (data.paymentInfo.status == 'done') {
                        // Payment was completed
                        if (_gaq) {_gaq.push(['_trackEvent', 'Stranger Things 3 The Game', 'Purchase completed', '/strangerthings3thegame'])};
                        self.paymentDone = true;
                        self.paymentInfo = data.paymentInfo;
                    }
                    });
                },
                show: function () {
                    $('#gofillup-screen').show();
                },
                hide: function () {
                    $('#gofillup-screen').hide();
                    $('#gofillup-iframe').attr("src", "about:blank"); // clear iframe content
                },
                on: function () {
                    this.eventObject.on.apply(this.eventObject, arguments);
                },
                off: function () {
                    this.eventObject.off.apply(this.eventObject, arguments);
                }
            };
        };

        $('#purchase-confirmation .confirm').bind('click', function (event) {
            // show button as processing for slow loads
            event.preventDefault();

            this.value = "Processing...";
            this.classList += " disabled";
            this.disabled = true;

            $.get('/ST3/payment', function (data) {
                $('#hidden-fields').hide();
                $('#hidden-fields').html(data);
                //console.log(data);
                xsolla_payment_ui.init();
                xsolla_payment_ui.show();
                document.payform.target = "gofillup-iframe";
                document.payform.action = $('#hidden-fields').data('action-url');
                document.payform.method = "post";
                document.payform.submit();
            });
        });
    }
});