(function($){
  $(".payee").removeClass("disabled"); // enables payment buttons once page has finished loading
  if (!$('body').hasClass('extralife')) {
  $('#purchase').find('#zip').val(''); // clear zipcode/country if page reloads to prevent bug related to browser autofill
  $('#purchase').find('#city').val('');
  $('#purchase').find('select[name=country]').val(0);
  var pass = false,
      // state listings array. -- this should probably be an ajax call instead of listed here.
      areas = {
        USA: [
          { abbr: 'AL', state: 'Alabama' },
          { abbr: 'AK', state: 'Alaska' },
          { abbr: 'AZ', state: 'Arizona' },
          { abbr: 'AR', state: 'Arkansas' },
          { abbr: 'AA', state: 'Armed Forces Americas' },
          { abbr: 'AE', state: 'Armed Forces Europe' },
          { abbr: 'AP', state: 'Armed Forces Pacific' },
          { abbr: 'CA', state: 'California' },
          { abbr: 'CO', state: 'Colorado' },
          { abbr: 'CT', state: 'Connecticut' },
          { abbr: 'DE', state: 'Delaware' },
          { abbr: 'DC', state: 'District Of Columbia (Washington, D.C.)' },
          { abbr: 'FL', state: 'Florida' },
          { abbr: 'GA', state: 'Georgia' },
          { abbr: 'HI', state: 'Hawaii' },
          { abbr: 'ID', state: 'Idaho' },
          { abbr: 'IL', state: 'Illinois' },
          { abbr: 'IN', state: 'Indiana' },
          { abbr: 'IA', state: 'Iowa' },
          { abbr: 'KS', state: 'Kansas' },
          { abbr: 'KY', state: 'Kentucky' },
          { abbr: 'LA', state: 'Louisiana' },
          { abbr: 'ME', state: 'Maine' },
          { abbr: 'MD', state: 'Maryland' },
          { abbr: 'MA', state: 'Massachusetts' },
          { abbr: 'MI', state: 'Michigan' },
          { abbr: 'MN', state: 'Minnesota' },
          { abbr: 'MS', state: 'Mississippi' },
          { abbr: 'MO', state: 'Missouri' },
          { abbr: 'MT', state: 'Montana' },
          { abbr: 'NE', state: 'Nebraska' },
          { abbr: 'NV', state: 'Nevada' },
          { abbr: 'NH', state: 'New Hampshire' },
          { abbr: 'NJ', state: 'New Jersey' },
          { abbr: 'NM', state: 'New Mexico' },
          { abbr: 'NY', state: 'New York' },
          { abbr: 'NC', state: 'North Carolina' },
          { abbr: 'ND', state: 'North Dakota' },
          { abbr: 'OH', state: 'Ohio' },
          { abbr: 'OK', state: 'Oklahoma' },
          { abbr: 'OR', state: 'Oregon' },
          { abbr: 'PA', state: 'Pennsylvania' },
          { abbr: 'PR', state: 'Puerto Rico' },
          { abbr: 'RI', state: 'Rhode Island' },
          { abbr: 'SC', state: 'South Carolina' },
          { abbr: 'SD', state: 'South Dakota' },
          { abbr: 'TN', state: 'Tennessee' },
          { abbr: 'TX', state: 'Texas' },
          { abbr: 'UT', state: 'Utah' },
          { abbr: 'VT', state: 'Vermont' },
          { abbr: 'VA', state: 'Virginia' },
          { abbr: 'WA', state: 'Washington' },
          { abbr: 'WV', state: 'West Virginia' },
          { abbr: 'WI', state: 'Wisconsin' },
          { abbr: 'WY', state: 'Wyoming' }
        ],
        CAN: [
          { abbr: 'AB', state: 'Alberta' },
          { abbr: 'BC', state: 'British Columbia' },
          { abbr: 'MB', state: 'Manitoba' },
          { abbr: 'NB', state: 'New Brunswick' },
          { abbr: 'NL', state: 'Newfoundland and Labrador' },
          { abbr: 'NT', state: 'Northwest Territories' },
          { abbr: 'NS', state: 'Nova Scotia' },
          { abbr: 'NU', state: 'Nunavut' },
          { abbr: 'ON', state: 'Ontario' },
          { abbr: 'PE', state: 'Prince Edward Island' },
          { abbr: 'QC', state: 'Quebec' },
          { abbr: 'SK', state: 'Saskatchewan' },
          { abbr: 'YT', state: 'Yukon' }
        ]
      },
      // Billing form elements
      p = $('#purchase'),
      flow = {
        paymentMethod   :  p.find('input[name=payment_method]'),
        empAmount       :  p.find('input[name=amount_id]') || nil,
        name            :  p.find('input[name=name]') || '',
        address         :  p.find('input[name=address]') || '',
        zip             :  p.find('input[name=zip]'),
        city            :  p.find('input[name=city]'),
        country         :  p.find('select[name=country]'),
        state           :  p.find('input[name=state]'),
        phone           :  p.find('input[name=phone]') || ''
      }

// Show states on country change
  function showStates(selectBox) {
    /*if ( areas[ $(selectBox).val() ] ) {
      var states = "<select name='state' id='state' tabindex='6' autocomplete='false'>";
          states += "<option selected='selected' value=''>Select One</option>"
          $.each(areas[$(selectBox).val()], function(){
            states += "<option value='"+this.abbr+"'>" + this.state + "</option>";
          })
          states += "</select>"; 
      var states = "<input type='text' name='state' id='state' tabindex='6' disabled>"
      $('#state').replaceWith(states);
      if (empFlow) { // emp purchase flow
        console.log('class should have added');
        $('.selectwrapper').addClass('styled-select');
      }
    } else {
      console.log('hidden state passed in');
      $('#state').replaceWith("<input type='hidden' name='state' id='state' value='^' />");
      if (empFlow) { // emp purchase flow
        console.log('remove class');
        $('.selectwrapper').removeClass('styled-select');
      }
    }*/
  }

  var delayedStateCheckPid = null;
  function delayedStateCheck(){
    if(delayedStateCheckPid !== null){
      clearTimeout(delayedStateCheckPid);
    }  // 250 ms wait after typing ends to stateCheck.
    delayedStateCheckPid = setTimeout(stateCheck, 250);
  }

  var currentZipInfo = null;
  function findByZip(zip) {
    currentZipInfo = null;
    var zipcode = zip;
    var country = flow.country.val();
    var url = null;
    if (country == "USA") {
      url = "/usazips";
    } else if (country == "CAN") {
      url = "/canzips";
      zipcode = zip.slice(0, 3);
    }

    if (url != null) {
      $.post(url, {zipcode: zipcode}, function(result, status){
        var city = $("#purchase #city");
        var state = $("#purchase #state");
        result = JSON.parse(result);
        if (result != "false") {
          currentZipInfo = result;
        }
        if (currentZipInfo) {
          city.val(currentZipInfo.city);
          state.val(currentZipInfo.state);
          $("#purchase #zip-error").css("display", "none");
        } else {
          $("#purchase #zip-error").css("display", "block");
        }
        stateCheck();
      });
    }

    /*if (window.usaCodes.hasOwnProperty(zip)) {
      currentZipInfo = window.usaCodes[zip];
    }*/
    /*if (currentZipInfo == null) {
      if (window.canadaCodes.hasOwnProperty(zip)) {
        currentZipInfo = window.canadaCodes[zip];
      }
    }*/
  }

  $('#purchase #zip').change(function() {
    findByZip($(this).val());
  });

  $('#purchase #country').change(function() {
    findByZip($(this).val());
  });

  $('#purchase #country').change(function() {
    document.getElementById('name').value = "DummyName";
    document.getElementById('address').value = "DummyAddress";
    document.getElementById('zip').value = "98101";
    document.getElementById('city').value = "Seattle";
    document.getElementById('state').value = "WA";
    document.getElementById('phone').value = "206-555-5555";
    //console.log("CHANGE");
    //console.log($(this).val());
    if ($(this).val() == "USA" || $(this).val() == "CAN") {
      $("#purchase #form-zipcode").css("display", "inline-block");
      document.getElementById('zip').value = "";
      document.getElementById('city').value = "";
      document.getElementById('state').value = "";
      if ($(this).val() == "CAN") {
        $("#zip").attr("placeholder", "First three digits only, Ex: Y0A");
      } else {
        $("#zip").attr("placeholder", "Ex: 98101");
      }
    } else if ($(this).val() != "") {
      $("#purchase #form-zipcode").css("display", "none");
    } else {
      $("#purchase #form-zipcode").css("display", "none");
    }
  });

  function refreshFlow() {
    flow = {
      paymentMethod   :  p.find('input[name=payment_method]'),
      empAmount       :  p.find('input[name=amount_id]') || nil,
      name            :  p.find('input[name=name]') || '',
      address         :  p.find('input[name=address]') || '',
      zip             :  p.find('input[name=zip]'),
      city            :  p.find('input[name=city]'),
      country         :  p.find('select[name=country]'),
      state           :  p.find('input[name=state]'),
      phone           :  p.find('input[name=phone]') || ''
    }
  }

  function stateCheck(){
    refreshFlow();
    pass = true;
    if (flow.country.val() == "USA" || flow.country.val() == "CAN") {
      $.each(flow, function(){
        if ( $(this).attr('type') === 'radio' ) {
          if (!$(this).is(':checked')) {
            pass = false;
          }
        } else if ( $(this).attr('type') === 'text' ) {
          if ( $(this).val().length == 0 ) {
            pass = false;
          }
        } else if ($(this).is("select")) {
          if ($(this).val() == "") {
            pass = false;
          }
        }
      })
    } else if (flow.country.val() == "" || flow.paymentMethod.val() == "" || !flow.empAmount.is(':checked')) {
      pass = false;
    }

    if ((flow.country.val() === "USA" || flow.country.val() === "CAN") && currentZipInfo === null) {
      pass = false;
    }
    /*if (flow['country'].val() == "USA") { // If USA or Canada is selected check that state is also selected
      if (flow['state'].val() == "") {
        pass = false;
      }
    }*/

    if (pass) {
      $('#purchase .confirm, #activate_elite_status .update').removeClass('disabled')
    } else {
      $('#purchase .confirm, #activate_elite_status .update').addClass('disabled')
    }
    //console.log(pass);
    delayedStateCheckPid = null;
    return pass;
  }

  // continual state check
  setInterval(function(){ stateCheck(); }, 100);

  // REGEX check for form fields
  function regCheck(field){
    // not allowing special chars was cleaner than listing what is allowed
    // Cannot list disallowed unicode characters here, they will break the compiler.
    // You can look them up here though: http://www.fileformat.info/info/unicode/char/search.htm
    var valid = false,
        reg = {
          'alphaNumeric'  : /[\$\%\&\(\)\*\+\/\:\;\<\=\>\?\@\[\\\]\{\|\}\~\^\!\u201C\u201D\u201E\u2020\u2021\u2030\u2039\u203A\u2660\u2663\u2665\u2666\u203E\u2190\u2191\u2192\u2193\u2122\u201C\u00A1\u00A2\u00A3\u00A4\u00A5\u00A6\u00A7\u00A8\u00A9\u00AA\u00AB\u00AC\u00AE\u00AF\u00B0\u00B1\u00B2\u00B3\u00B6\u00B7\u00B9\u00BA\u00BB\u00BC\u00BD\u00BE\u00BF\u00F7]/,
          'zip'           : /[0-9\-\s]/,
          'phone'         : /[0-9\-\s\+\.]/
        }

    if ($(field).attr('type') == 'text'){
      $(field).removeClass('error');
      if ( !reg[$(field).attr('name')] ) {
        valid = (reg['alphaNumeric'].test( $(field).val() )) ? false : true;
      } else {
        valid = reg[$(field).attr('name')].test( $(field).val() );
      }

      if (valid) {
        return true;
      } else {
        $(field).addClass('error');
        return false;
      }
    }
  }
  function setForm(data){
    //console.log('data ', data);
    //console.log('flow ', flow);
    flow.name.val(data.name);
    flow.address.val(data.address);
    flow.zip.val(data.zip);
    flow.city.val(data.city);
    flow.country.val(data.country).trigger('change');
    flow.phone.val(data.phone);
    $('#state').val(data.state);
    $('#activate_elite_status #billing-form').show()
    stateCheck();
  }
  function resetForm(){
    /*if ($('#token').length) {
      $('#purchase').find('#state').replaceWith("<input type='hidden' name='state' id='state' value='^' />");
      $('#purchase').find('input[type=text]').val('');
      $('#purchase').find('select[name=country]').val(0);
    }
    stateCheck();*/
  }

  function payPalModal() {
      $('#warningModal').reveal({close: modal.close });

      $('#warningModal').find('#cancel').on('click', function(e){
        e.preventDefault();
        $('#purchase .confirm, #activate_elite_status .update').addClass('disabled')
        $('#warningModal').trigger('reveal:close');
      });
      $('#warningModal').find('#confirm').on('click', function(e){
        e.preventDefault();
        $('#purchase').submit();
      })
  }

  function countryInteraction() {
    //console.log('country interaction seen');
    $('select[name=country]').on('change', function(){
      //console.log('change in field seen');

      /*if (empFlow) { // emp purchase flow
        //console.log('empflow seen');
        showStates($(this));
      } else {
        //console.log('country but no emp');
        showStates($(this));
      }*/
      //console.log('went straight to state check');
      stateCheck();
    });
  }

  $(document).ready(function(){
    $('select[name=country]').on('mouseup keydown', function() {
      countryInteraction();
    });
    /*$('select[name=country]').on('change', function(){
      console.log('stepped into select country');
      if (empFlow) { // emp purchase flow
        console.log('empflow seen');
        showStates($(this));
      } else {
        console.log('country but no emp');
        showStates($(this));
      }
      console.log('went straight to state check');
      stateCheck();
    });*/

    if ( $('#token').length && $('#token').attr('data-name') != ''  ) {
      setForm( $(flow.paymentMethod).data() );
    }

    if ( flow.paymentMethod.attr('checked') ) {
      if ( $(flow.paymentMethod).val() == 'token' ) {
        $('label[for=' + $(flow.paymentMethod).val() + ']').click().find('.inner').addClass('selected');
      } else {
        $('label[for=cpg' + $(flow.paymentMethod).val() + ']').click().find('.inner').addClass('selected');
      }
    }

    if ( flow.empAmount.attr('checked') ){
      $('label[for=cur-' + $(flow.empAmount).val() + ']').click().find('.inner').addClass('selected');
      $('#purchase #billing-form').show();
    }

    $.each(flow, function(){
      $(this).bind('change', function(){
        stateCheck();
        regCheck( this );
      });
      $(this).bind('keyup', function(){
        delayedStateCheck();
        regCheck( this );
      });
    })

    if ($('#paymentList')) {
      var index = 0, set;

      
      $('input[name=amount_id]').bind('click', function(){
        index = $(this).index();
        payment_type = $(this).attr('payment_type');
        stateCheck();
        $('.select-emp .inner').removeClass('selected');
        $('label[for=' + $(this).attr('id') + ']').find('.inner').attr('class', 'inner selected');
        if (payment_type == "XSOLLA" || payment_type == "XSOLLA_CREDIT") {
          // was xsolla
          $('#activate_elite_status #billing-info').hide();
        } else {
          // was not xsolla
          $('#activate_elite_status #billing-info').show();
        }

        // toggle class for header coloring
        if($('#billing-form')) {
          $('#billing-form').addClass('active');
        }
        $('#billing-info').show();
      })

      $('input[name=payment_method]').bind('change', function(){
        $('.paymentOption .inner').removeClass('selected');
        //$('label[for=' + $(this).attr('id') + ']').find('.inner').attr('class', 'inner selected');
        $("#" + $(this).attr('id')).parent().addClass("selected"); // for subscription
        set = ( $(this).attr('id') == 'token' ) ? $('.select-emp#creditcard') : $('.select-emp#' + $(this).attr('id').replace('cpg', '') );
        $('.select-emp').hide();
        $(set).show();
        if (index != 0) {
          $(set).children().eq(index).prop('checked', true);
          $('.select-emp label .inner').removeAttr('class').attr('class', 'inner');
          $('.select-emp label[for='+ $(set).children().eq(index).attr('id') +'] .inner').attr('class', 'inner selected');
        }

        // toggle class for heading css
        if($('#select-emp')) {
          $('#select-emp').addClass('active');
        }
        // hide form for xsolla
        var id = $(this).attr('id');
        var country = $("#purchase #country").val();
        //console.log(id);
        if (id == 'cpgxsolla' || id == 'cpgxsolla_credit' || id == 'cpgboacompra') {
          $('#billing-info').hide();
          // dummy form submission
          document.getElementById('name').value = "DummyName";
          document.getElementById('address').value = "DummyAddress";
          document.getElementById('zip').value = "98101";
          document.getElementById('city').value = "Seattle";
          document.getElementById('country').value = "GBR"; // can be set to any country except USA for dummy value
          $('select[name=country]').trigger('change');
          document.getElementById('state').value = "WA";
          document.getElementById('phone').value = "206-555-5555";
         } else {
          // clear xsolla info if they change their mind and choose another payment processor
          $('#purchase').find('#state').replaceWith("<input type='hidden' name='state' id='state' value='' />");
          $('#purchase').find('input[type=text]').val('');
          $('#purchase').find('select[name=country]').val(0);
          document.getElementById('name').value = "DummyName";
          document.getElementById('address').value = "DummyAddress";
          document.getElementById('phone').value = "206-555-5555";
          if ($('body').hasClass('tera')) {
            $('#billing-info').show();
          }
         }


        stateCheck();
        // set or unset billing form data
        if ($('#token') && $(this).attr('id') == 'token') {
          setForm( flow.paymentMethod.data() );
          // ensure state shows
          //console.log('token found ' + JSON.stringify(flow.paymentMethod.data()));
          var enteredForm = flow.paymentMethod.data();
          var enteredCountry = enteredForm.country;
          var enteredState = enteredForm.state;
         // console.log('state is ' + enteredCountry);
          // repopulate state as select
      /*    var states = "<select name='state' id='state' tabindex='6'>";
          $.each(areas[enteredCountry], function(){
            states += "<option value='"+this.abbr+"'>" + this.state + "</option>";
          })
          states += "</select>";
          $('#state').replaceWith(states);
          $('#state').val(enteredState);
          $('#state').parent().addClass('styled-select');*/
        }

        $('#purchase #country').trigger("change");

      })
    }

    $('#purchase input[type=submit]').bind('click', function(event){
      event.preventDefault();
      if ( $('input[name=payment_method]:checked').val() == 'subscription_ec' ) {
        payPalModal()
      } else if (stateCheck()) {
        $('#purchase').submit();
      }
    })

    // Sub flow
    if ($('#activate_elite_status')) {
      $('#activate_elite_status input[name=payment_method]').bind('change', function(){
        $('#activate_elite_status input[name=payment_method]').is(':checked') ? $('#activate_elite_status #billing-form').show() : $('#activate_elite_status #billing-form').hide();

        $('#cur' + $(this).attr('id').replace('cpg', '')).prop("checked", true);
        stateCheck();
      })
    }
  })


  // Add message handler for communicating XSOLLA payment iframe
  var whereAreWe = window.location.pathname;
  if(whereAreWe != '/extralife') {
    if(whereAreWe.toLowerCase().indexOf("st3") === -1) {
      if(whereAreWe.toLowerCase().indexOf("closers/packs") === -1) {
        if(whereAreWe.toLowerCase().indexOf("tera/packs") === -1) {

      var xsolla_payment_ui = {
        eventObject: $({}),
        paymentDone: false,
        paymentInfo: null,
        gameName: 'tera',
        init: function() {
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
            }
            catch (e) {
            }
            if (message.command) {
              self.eventObject.trigger(message.command, message.data);
            }
          });

          // bind close button of the xsolla iframe window
          $('#gofillup-screen-close').click(function() {
            self.hide();
            var resultcode = 0;
            var resultmsg = '';
            var tid = 0;
            var email = '';
            if (self.paymentDone === false) {
              resultcode = 301;   // payment cancel
            }
            else {
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
              window.location.href = window.location.protocol + "//" + window.location.host + "/" + self.gameName;
            });
          });

          // bind events from PayStation
          self.on('widget-detection', function(event, data) {
            // PayStation initialized
            self.paymentDone = false;
          });

          self.on('status', function(event, data) {
            if (data.paymentInfo.status == 'done') {
              // Payment was completed
              self.paymentDone = true;
              self.paymentInfo = data.paymentInfo;
            }
          });
        },
        show: function() {
          $('#gofillup-screen').show();
        },
        hide: function() {
          $('#gofillup-screen').hide();
          $('#gofillup-iframe').attr("src", "about:blank"); // clear iframe content
        },
        on: function() {
          this.eventObject.on.apply(this.eventObject, arguments);
        },
        off: function() {
          this.eventObject.off.apply(this.eventObject, arguments);
        }
      };

      xsolla_payment_ui.init();
    

      // Purchase confirmation button
      $("#cbox_AcceptTerms #agreeTerms").bind('change', function(){
        if ($(this).is(":checked")) {
          $("#cbox_AcceptTerms .error").hide();

          if (!$('.processing').is(':visible')) {
            // re-enable confirm button after the check box is checked.
            // (caution: if the form is already processing now, we should not enable the button again.)
            $('#purchase-confirmation .confirm').removeClass("disabled");
          }
        }
        else {
          $("#cbox_AcceptTerms .error").show();
        }
      })

      $('#purchase-confirmation .confirm').bind('click', function(event){
        // show button as processing for slow loads
        event.preventDefault();
        if ($("#cbox_AcceptTerms").length && !$("#agreeTerms").is(":checked") ) {
          $("#cbox_AcceptTerms .error").show();
          this.classList += " disabled";
          return;
        }

        this.value = "Processing...";
        this.classList += " disabled";

        $('.processing').show();
        $.get('/tera/payment', function(data){
          $('#hidden-fields').hide();
          $('#hidden-fields').html(data);
          //console.log(data);
          var pgcode_pattern = /id="pgcode"\s*value="(.+)"/i;
          var m = pgcode_pattern.exec(data);
          var pgcode = null;
          if (m) {
            pgcode = m[1];
          }
          if (pgcode.toUpperCase() == "XSOLLA" || pgcode.toUpperCase() == "XSOLLA_CREDIT") {
            xsolla_payment_ui.show();
            document.payform.target = "gofillup-iframe";
          }
          else {
            window.open("", "gofillup", "width=1200, height=800, scrollbars=yes", true);
            document.payform.target = "gofillup";
          }

          document.payform.action=$('#hidden-fields').data('action-url');
          document.payform.method="post";
          document.payform.submit();
        });
      });
      } // end tera check
    } // end closers check
    }
  } // end extra life check

  // reset the form after on page load
  /*$(document).ready(function () {
    resetForm();
  });*/

}

})(jQuery);