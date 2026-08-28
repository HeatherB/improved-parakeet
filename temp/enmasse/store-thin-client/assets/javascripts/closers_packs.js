$(document).ready(function() {
	if($('#nav_packs').length > 0) {

		var vw = $(window).width();
		if(vw >= 1024) {
			$('#nav_packs').addClass('reveal');
		}

		$('#nav_packs li a').on('click', function() {
			$('#nav_packs li a').not($(this)).parent().removeClass('selected');
			$(this).parent().addClass('selected');
		});

		var get_to_here = $('#page-content').offset().top;

		$(window).scroll(function() {
			var already_scrolled = $(this).scrollTop();

			/* adds a fixed class to navigation bar as we scroll over it */
			if(already_scrolled >= get_to_here) {
				$('#nav_packs').addClass('pickup');
			} else {
				$('#nav_packs').removeClass('pickup');
			}

			/* if bundle is scrolled into view */
			var bundles = $('.bundle');

			bundles.each(function(b) {
				var this_bundle_offset = $(this).offset().top;
				var this_bundle_height = $(this).height() + this_bundle_offset;

				if (already_scrolled + 200 >= this_bundle_offset && already_scrolled + 200 < this_bundle_height) {
					var selected_anchor = $(this).attr('id');
					var find_anchor = $('a[href="#' + selected_anchor + '"]');
					$(find_anchor).parent().addClass('selected');
					$('#nav_packs li a').not(find_anchor).parent().removeClass('selected');
				}
			});
		});
	};

	if($('body.closers_packs').length > 0) {
		/* clicked login link */
        $('.login-popup-link').on('click', function(e) {
            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Packs', 'Login clicked', '/closers/packs'])};
        });

        /* store page */
        $('.init_purchase_btn').on('click', function(event) {
            event.preventDefault();
            var closers_packs_product_id = $(this).data('id');
            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Packs', 'Purchase button', '/closers/packs'])};
            $("#init_closers_packs_form #product_id").val(closers_packs_product_id);
            $("#init_closers_packs_form").submit();
        });
        // scripts for purchase confirmation page - provided for already on billing scripts
        if ($('#purchase-confirmation').length > 0) {
            var xsolla_payment_ui = {
            eventObject: $({}),
            paymentDone: false,
            paymentInfo: null,
            gameName: 'closers',
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
                        if (_gaq) {_gaq.push(['_trackEvent', 'Closers Packs', 'Purchase failed', textStatus])};
                        // redirect to the first page of the store
                        //window.location.href = window.location.protocol + "//" + window.location.host + "/" + self.gameName
                        window.location.href = window.location.protocol + "//" + window.location.host + "/closers/packs"
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
                        if (_gaq) {_gaq.push(['_trackEvent', 'Closers Packs', 'Purchase completed', '/closers/packs'])};
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

        $('#purchase-confirmation .submitBTN').bind('click', function (event) {
            // show button as processing for slow loads
            event.preventDefault();

            this.value = "Processing...";
            this.classList += " disabled";
            this.disabled = true;

            $.get('/closers/payment', function (data) {
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
	};

});
