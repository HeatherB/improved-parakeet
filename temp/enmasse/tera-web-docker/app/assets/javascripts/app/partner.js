$(function() {
    /* provide correction for missing array, from in most all version of IE */
    if (!Array.from) {
      Array.from = (function () {
        var toStr = Object.prototype.toString;
        var isCallable = function (fn) {
          return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
        };
        var toInteger = function (value) {
          var number = Number(value);
          if (isNaN(number)) { return 0; }
          if (number === 0 || !isFinite(number)) { return number; }
          return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
        };
        var maxSafeInteger = Math.pow(2, 53) - 1;
        var toLength = function (value) {
          var len = toInteger(value);
          return Math.min(Math.max(len, 0), maxSafeInteger);
        };

        // The length property of the from method is 1.
        return function from(arrayLike/*, mapFn, thisArg */) {
          // 1. Let C be the this value.
          var C = this;

          // 2. Let items be ToObject(arrayLike).
          var items = Object(arrayLike);

          // 3. ReturnIfAbrupt(items).
          if (arrayLike == null) {
            throw new TypeError("Array.from requires an array-like object - not null or undefined");
          }

          // 4. If mapfn is undefined, then let mapping be false.
          var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
          var T;
          if (typeof mapFn !== 'undefined') {
            // 5. else
            // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
            if (!isCallable(mapFn)) {
              throw new TypeError('Array.from: when provided, the second argument must be a function');
            }

            // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 2) {
              T = arguments[2];
            }
          }

          // 10. Let lenValue be Get(items, "length").
          // 11. Let len be ToLength(lenValue).
          var len = toLength(items.length);

          // 13. If IsConstructor(C) is true, then
          // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
          // 14. a. Else, Let A be ArrayCreate(len).
          var A = isCallable(C) ? Object(new C(len)) : new Array(len);

          // 16. Let k be 0.
          var k = 0;
          // 17. Repeat, while k < len… (also steps a - h)
          var kValue;
          while (k < len) {
            kValue = items[k];
            if (mapFn) {
              A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
            } else {
              A[k] = kValue;
            }
            k += 1;
          }
          // 18. Let putStatus be Put(A, "length", len, true).
          A.length = len;
          // 20. Return A.
          return A;
        };
      }());
    }
    /* end correction for IE */


    $("#partnerApplication").submit(function(){
        var flag = true;
        var inputs = this.querySelectorAll("input, textarea");

        $("input[type=submit]").attr('disabled','disabled');

        var required = Array.from(inputs).filter(function(node) {
            return $(node).hasClass("required") && node.value == "";
        });

        var numbers = this.querySelectorAll("input[number]");
        
        for (var i = 0; i < inputs.length; i++) {
            $(inputs[i]).removeClass("error");
            $(inputs[i]).parent().find(".message").remove();
        }

        for (var i = 0; i < required.length; i++) {
            var errorNode = required[i];
            errorNode.className += " error";
            addError(errorNode, "Oh no! This field has been left empty");
        }

        for (var i = 0; i < numbers.length; i++) {
            var errorNode = numbers[i];
            if (!parseInt(errorNode[i])) {
                errorNode.className += " error";
                addError(errorNode, "Oh no! You have not entered a valid number into this field");
            }
        }

        validateEmail();

        submitForm();

        return false; // prevents regular form submission

        function submitForm() {
            if (flag == true) {
                var url="/partner/create"

                $.ajax({
                    type: "POST",                    
                    url: url,
                    data: $("#partnerApplication").serialize(),
                    success: function(data, textStatus)
                    {
                        $("input[type=submit]").removeAttr('disabled');
                        success();
                    },
                    error: function(XMLHttpRequest) {
                        alert("Your application was unable to be processed at this time. Please try again later.")
                        $("input[type=submit]").removeAttr('disabled');
                    }
                });
            } else {
                $("input[type=submit]").removeAttr('disabled');
            }
        }

        function success() {
            $("#success").css("display", "block");
            $("#fields").css("display", "none");
            $("#submit").css("display", "none");
            $("#partnerApplication").toggleClass('success');

            var url = location.href; 
            location.href = "#applyform";     
            history.replaceState(null,null,url);
        }

        function addError(node, message) {
            node.className += " error";
            addMessage(node, message);
            flag = false;
        }

        function addMessage(node, message) {
            if ($(node).parent().find(".message").length == 0) {
                $(node).parent().append("<div class='message'><span>X</span> " + message + "</div>");
            }
        }

        function validateEmail() {
            var email = $("form #email");
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (!reg.test(email.val())) { addError(email, "Oh no! You have entered an invalid email address") };
        }

    });

    // randomize partner page streamers
    function randomizePartners() {
        var ul = document.querySelector('.full-list #community_streamers');
        if (ul) {
            for (var i = ul.children.length; i >= 0; i--) {
                ul.appendChild(ul.children[Math.random() * i | 0]);
            }
            //$(".full-list #community_streamers").css("display", "grid");
        }
    }
    
    // check which streamers are live
    function checkIfLive() {
        var ul = document.querySelector('#community_streamers');
        var twitchStreams = [];
        if (ul) {
            // Get all Partners Twitch Stream Names
            for (var i = 0; i < ul.children.length; i++) {
                var profile = $(ul.children[i]);
                var twitch = profile.find(".twitch");
                if (twitch.length != 0) {
                    twitchStreams.push($(ul.children[i]).find(".partner_socials").find(".twitch")[0].pathname.replace("/", ""));
                }
            }
            // AJAX request to get cached list of Live streamers using IDs
            $.ajax({
                type: "POST",
                data: {twitchStreams: twitchStreams},
                url: "/live-partners",
                success: function(streams){
                    jQuery.expr[':'].contains = function(a, i, m) { // Make jquery contains case insensitive
                        return jQuery(a).text().toUpperCase()
                            .indexOf(m[3].toUpperCase()) >= 0;
                    };
                    for (var i = streams.length - 1; i >= 0; i--) {
                        var streamer = streams[i];
                        if (streamer.game_id == "26476") {
                            var begin = streamer.thumbnail_url.indexOf('live_user_') + 10; //10 is the length of 'live_user_'
                            var end = streamer.thumbnail_url.lastIndexOf('-\{width\}');
                            var username = streamer.thumbnail_url.slice(begin, end); // stripped Username
    
                            var node = $("li:contains('" + username + "')");
                            if (node) {
                                $(node).addClass("Live");
                                $(node).find(".twitch").append("<span></span>"); // append span for css animation
                                var ul = document.querySelector('#community_streamers'); // append the streamer to the beginning of the list
                                $("#community_streamers").prepend(node);
                            }
                        }
                    }
                },
                error: function(msg){
                    console.log("Failed to fetch Twitch Live Streamers, returned error:");
                    console.log(msg);
                }
            });
        }

         // https://twitch.tv/streams/:stream.id/channel/:stream.user_id
    }

    randomizePartners();
    checkIfLive();

});