if ($("body").hasClass("closersstore") || $("body").hasClass("kritikastore")) {

    if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Loaded in Browser', '/closers/items'])};

    // STORE COUNTDOWN
    var salecountdown = new Timer($('#timer-section'));

    function Timer(node) {
        this.startHour = 10; // 10am
        this.endHour = 34; // 10am the following day
        
        this.updateTime = function() {
            this.date = new Date();
            //this.now = new Date((this.date.getTime() + this.date.getTimezoneOffset() * 60000) - (480 * 60000)); // daylight savings time
            this.now = new Date((this.date.getTime() + this.date.getTimezoneOffset() * 60000) - (420 * 60000)); // Local Time to UTC time with Pacific Timezone offset (add user's local timezone to get to UTC time, then subtract Pacific timezone amount to get to Pacific)
            this.hours = this.now.getHours();
            this.minutes = this.now.getMinutes();
            this.seconds = this.now.getSeconds();
        }

        this.checkHours = function() {
            if (this.hours >= this.startHour && this.hours <= this.endHour) {
                return true;
            }
            return false;
        }

        this.updateUI = function() {
            this.updateTime();
            if (this.hours < 10) { // less than 10am add 24 hours
                this.hours += 24;
            }
            if (this.checkHours()) {
                node.find("#hours").text(this.endHour - this.hours - 1);
                node.find("#minutes").text(60 - this.minutes - 1);
                node.find("#seconds").text(60 - this.seconds - 1);
            } else {
                node.find("#hours").text('0');
                node.find("#minutes").text('0');
                node.find("#seconds").text('0');
            }
        }

        this.interval = setInterval(function() { this.updateUI(); }.bind(this), 1000);

    }
    // END STORE COUNTDOWN

    // STORE ITEMS
    $(".buy-item").on('click', function() {
        new item(this);
    });
    function item(node) {
        this.node = node;
        this.price = $(node).data("price");
        this.discount = $(node).data("discount");
        this.amount = $(node).data("amount");
        this.image = $(node).data("image");
        this.game = $(node).data("game");
        this.name = $(node).data("name");
        this.id = $(node).data("id");
        this.user = $(node).data("user");
        this.overlay = $("#confirmation");
        this.confirm = $("#confirmation #confirm");
        this.succeeded = false;
        this.free = $(node).hasClass("free");

        if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'View Product Details', this.name])}; 

        if ($('body').hasClass("kritika")) {
            this.game = "Kritika Online";
            this.gamename = "kritika";
        } else if ($('body').hasClass("closers")) {
            this.game = "Closers";
            this.gamename = "closers";
        }
        this.confirmationText = "You are about to purchase a " + this.name + " from the <i>" + this.game + " Web Store</i> for " + this.price + " EMP. Please confirm that you wish to purchase and apply this item to your account at this time. This product is for <i>" + this.game + " PC</i> only.";

        this.setPricingDisplay = function() {
            $("#original").html(this.price + this.discount);
            $("#discount").html(this.discount * -1);
            $("#total").html(this.price);
        }
        this.showError = function(message, title) {
            this.overlay.show();
            $("#confirm").hide();
            $("#failed").show();
            $("#failed").find(".text").html(message);
            $("#failed").find(".title").html(title);
            $("#failed").find(".thumb").attr("src", this.image);
        }
        this.showLoginError = function(message) {
            this.overlay.show();
            $("#confirm").hide();
            $("#loginfailed").show();
            $("#loginfailed").find(".text").html(message);
            $("#loginfailed").find(".thumb").attr("src", this.image);
            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Login Error Triggered', '/closers/items'])}; 
        }
        this.showSuccess = function(message) {
            message = message || 'You successfully purchased a ' + this.name + ' from the <i>' + this.game + ' Web Store</i>. Your item will be delivered to you in-game!';
            var title = this.free ? 'Free Code Claimed' : 'Purchase Successful';
            this.overlay.show();
            $("#confirm").hide();
            $("#purchase").show();
            $("#purchase").find("h3 .title").html(title);
            $("#purchase").find(".text").html(message);
            $("#purchase").find(".thumb").attr("src", this.image);
        }
        this.showConfirmation = function() {
            this.setupForm();
            this.confirm.find(".text").html(this.confirmationText);
            this.confirm.find(".thumb").attr("src", this.image);
            this.overlay.show();
            this.confirm.show();
            $('#buynow').removeAttr("disabled");
            $('#buynow').removeClass("disabled");
            $('#buynow').html("Buy now");
            $('#buynow').click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (this.user != 0) {
                    $('#buyitem').submit();
                    $('#buynow').attr('disabled', 'true');
                    $('#buynow').toggleClass("disabled");
                    $('#buynow').html("Processing...");
                } else {
                    this.showLoginError('You must log in to your <i>' + this.game + '</i> account before purchasing any items in the <i>' + this.game + '</i> Web Store. You can log in to your <i>' + this.game + '</i> account here: <a href="#" class="sign-in login-popup-link">Log in to my account</a>.');
                }
            }.bind(this));
        }
        this.hideAll = function() {
            this.overlay.hide();
            this.confirm.hide();
            $("#failed").hide();
            $("#loginfailed").hide();
            $("#purchase").hide();
            $("#buyitem").unbind();
            $("#buynow").unbind();
            $(".close").unbind();
        }
        this.overlay.find(".close").on("click", function() {
            if (_gaq && !this.succeeded) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Click Cancel Purchase', this.name])};
            this.hideAll();
        }.bind(this));

        this.setupForm = function() {
            $("#buyitem").remove();
            $('body').append("<form onsubmit='return false' id='buyitem'><input type='hidden' value='" + this.id + "' id='item-id' name='item_id'><input type='hidden' value='" + this.price + "' id='item-price' name='item_price'><input type='hidden' value='" + this.user + "' id='game_account_id' name='game_account_id'></form>");
            this.addSubmit();
        }

        this.addSubmit = function() {
            $('#buyitem').submit(function(e){
                e.preventDefault();
                e.stopPropagation();
                if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Click Confirm Purchase', this.name])};
                $.post("/" + this.game + "/buy-item", $("#buyitem").serialize(), function(data){
                    data = JSON.parse(data);
                    //console.log('data ', data);
                    if (data.error) {
                        if(data.message.includes('3102-Exceeded')) {
                            this.showError('You have reached the maximum number of purchases/redemptions for <b>' + this.name + '</b>. You are not able to purchase/redeem any more of <b>' + this.name + '</b>.', 'Purchase/Redemption Maximum Reached');
                            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Purchase Maximum Reached', this.name])};
                            console.log("Purchase Error: " + data.message);
                        } else if(data.message.includes('5105-Exceeded')) {
                            this.showError('You have reached the maximum number of purchases/redemptions for <b>' + this.name + '</b>. You are not able to purchase/redeem any more of <b>' + this.name + '</b>.', 'Purchase/Redemption Maximum Reached');
                            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Purchase Maximum Reached', this.name])};
                            console.log("Purchase Error: " + data.message);
                        } else {
                            this.showError('You do not have enough EMP to successfully purchase <b>' + this.name + ' </b> from the <i>' + this.game + ' Web Store</i>. Click the button below to buy more EMP and try again.', 'Purchase Failed');
                            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Purchase Error: Not Enough EMP', this.name])};
                            console.log("Purchase Error: " + data.message);
                        }
                    } else {
                        this.succeeded = true;
                        if (this.free) {
                            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Code Claimed', this.name])}; 
                            this.showSuccess('You have claimed your free ' + this.name + ', come back tomorrow to get another free prize!');
                        } else {
                            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Purchase Success', this.price + ' EMP (' + this.name + ')'])}; 
                            this.showSuccess();
                        }
                    }
                }.bind(this));
            }.bind(this));
        }

        $(".buyemp").click(function() {
            if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Buy EMP Clicked', '/closers/items'])};
            window.open('/enmasse/emp', '_blank');
        });

        if (this.free) {
            if (this.user != 0) {
                this.setupForm();
                $('#buyitem').submit();
            } else {
                this.showLoginError('You must log in to your <i>' + this.game + '</i> account before purchasing any items in the <i>' + this.game + '</i> Web Store. You can log in to your <i>' + this.game + '</i> account here: <a href="#" class="sign-in login-popup-link">Log in to my account</a>.');
            }
        } else {
            this.setPricingDisplay();
            this.showConfirmation();
        }
    }

    $("#scissors").on("click", function(e) {
        var code = document.getElementById("free-code");
        if (_gaq) {_gaq.push(['_trackEvent', 'Closers Daily Deals', 'Free Code Copied', code])}; 
        window.prompt("Copy to clipboard: Ctrl+C, Enter", code.textContent);
    });

}