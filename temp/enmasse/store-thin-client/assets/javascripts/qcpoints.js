$(document).ready(function() {
    if($('#qcpoints-purchase').length > 0) {

        var qcpoints_product_id;

        /* qc points page */
        $('#qcpoints-purchase .purchase_initiate_button').on('click', function(event) {
            event.preventDefault();
            qcpoints_product_id = $(this).closest('li').data('product-id');
            $("#purchase_initiate_form #product_id").val(qcpoints_product_id);
            $("#purchase_initiate_form").submit();
        });

    
    } /* end qc points page restriction */

    if($('#breach-shop-fp').length > 0) {

        var qcpoints_product_id;

        /* breach founders packs page */
        $('#breach-shop-fp .purchase_initiate_button').on('click', function(event) {
            event.preventDefault();
            qcpoints_product_id = $(this).closest('.purchase_block').data('product-id');
            $("#purchase_initiate_form #product_id").val(qcpoints_product_id);
            $("#purchase_initiate_form").submit();
        });

    
    } /* end breach founders packs restriction */


    if($('#breach-shop').length > 0) {

        var qcpoints_product_id;

        /* breach founders packs page */
        $('#breach-shop .purchase_initiate_button').on('click', function(event) {
            event.preventDefault();
            qcpoints_product_id = $(this).closest('.purchase_block').data('product-id');
            $("#shop_initiate_form #product_id").val(qcpoints_product_id);
            $("#shop_initiate_form").submit();
        });

    
    } /* end breach founders packs restriction */

    

    // scripts for purchase confirmation page
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
            // redirect to the first page of the store
            window.location.href = window.location.protocol + "//" + window.location.host + "/" + self.gameName
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

    $('#purchase-confirmation .confirm').bind('click', function (event) {
      // show button as processing for slow loads
      event.preventDefault();

      this.value = "Processing...";
      this.classList += " disabled";
      this.disabled = true;

      $.get('/breach/payment', function (data) {
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
