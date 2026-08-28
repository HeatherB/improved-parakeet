$(document).ready(function() {
    if ($('body').hasClass("giftingfront")) {
        var buttons = document.getElementsByClassName("buygift");
        $(".buygift").on('click', function() {
            new gift(this);
        });
        function gift(node) {
            this.node = node;
            this.price = $(node).data("price");
            this.discount = $(node).data("discount");
            this.amount = $(node).data("amount");
            this.id = $(node).data("id");
            this.user = $(node).data("user");
            this.overlay = $("#confirmation");
            this.confirm = $("#confirmation #confirm");
            if ($('body').hasClass("kritika")) {
                this.game = "Kritika Online";
                this.gamename = "kritika";
            } else if ($('body').hasClass("closers")) {
                this.game = "Closers";
                this.gamename = "closers";
            }
            this.confirmationText = "You are about to purchase " + this.amount + " <b>" + this.game + " Golden Gift Box</b> from the <i>" + this.game + " </i> Web store for " + this.price + " EMP. Please confirm that you wish to purchase and apply this item to your account at this time. This product is for <i>" + this.game + "</i> PC only.";

            this.setPricingDisplay = function() {
                $("#original").html(this.price + this.discount);
                $("#discount").html(this.discount * -1);
                $("#total").html(this.price);
            }
            this.showError = function(message) {
                $("#confirm").hide();
                $("#failed").show();
                $("#failed").find(".text").html(message);
            }
            this.showLoginError = function(message) {
                $("#confirm").hide();
                $("#loginfailed").show();
                $("#loginfailed").find(".text").html(message);
            }
            this.showSuccess = function() {
                $("#confirm").hide();
                $("#purchase").show();
                $("#purchase").find(".text").html('You successfully purchased ' + this.amount + ' <b>' + this.game + ' Golden Giftbox</b> from the <i>' + this.game + '</i> Web store. Go to the <a href="/' + this.game + '/gifts">' + this.game + '</a> gifting center to send or open your gift.');
            }
            this.showConfirmation = function() {
                console.log("test");
                $("#buygift").remove();
                this.confirm.append("<form id='buygift'><input type='hidden' value='" + this.id + "' id='item-id' name='item_id'><input type='hidden' value='" + this.price + "' id='item-price' name='item_price'><input type='hidden' value='" + this.user + "' id='game_account_id' name='game_account_id'></form>");
                this.confirm.find(".text").html(this.confirmationText);
                this.overlay.show();
                this.confirm.show();
                console.log("confirm");
                $('#buynow').removeAttr("disabled");
                $('#buynow').removeClass("disabled");
                $('#buynow').html("Buy now");
                $('#buynow').click(function (e) {
                    e.preventDefault();
                    if (this.user != 0) {
                        $('#buygift').submit();
                        $('#buynow').attr('disabled', 'true');
                        $('#buynow').toggleClass("disabled");
                        $('#buynow').html("Processing...");
                    } else {
                        this.showLoginError('You must log in and have a <i>' + this.game + '</i> account before purchasing <b>' + this.game + ' Golden Gift Boxes</b> from the <i>' + this.game + '</i> Web Store. You can add ' + this.game + ' to your account at <a href="https://account.enmasse.com/users/account">Add ' + this.game + ' to my account</a>.');
                    }
                }.bind(this));
                $('#buygift').submit(function(e){
                    e.preventDefault();
                    $.post("/" + this.gamename + "/buy-item", $("#buygift").serialize(), function(data){
                        data = JSON.parse(data);
                        if (data.error == true) {
                            this.showError('You do not have enough EMP to successfully purchase ' + this.amount + ' <b>' + this.game + ' Golden Giftbox</b> from the <i>' + this.game + '</i> Web store. Click the button below to buy more EMP and try again.');
                            console.log("Purchase Error: " + data.message);
                        } else {
                            this.showSuccess();
                        }
                    }.bind(this));
                }.bind(this));
            }
            this.hideAll = function() {
                this.overlay.hide();
                this.confirm.hide();
                $("#failed").hide();
                $("#loginfailed").hide();
                $("#purchase").hide();
                $("#buygift").unbind();
                $("#buynow").unbind();
            }
            this.overlay.find(".close").on("click", function() {
                this.hideAll();
            }.bind(this));
            $(".buyemp").click(function() {
                window.open('/enmasse/emp', '_blank');
            });

            this.setPricingDisplay();
            this.showConfirmation();
        }
    }
});