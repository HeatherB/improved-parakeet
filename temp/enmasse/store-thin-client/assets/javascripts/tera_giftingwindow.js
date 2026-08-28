(function() {
/* EDITABLE PRODUCT IDS FOR EDGE/LIVE */
/* The item id corresponds to the Game ExternalOfferID in payletter */
var product_ids = {
    1: "2018goldengiftbox1",
    2: "2018goldengiftbox2",
    5: "2018goldengiftbox5"
};

/* Rewards Tabs */
var rewardTabs = function() {
    var tab = 1;
    var giftImg = $("#gift-img");
    var text = $("#preview-window .text");
    var rightArrow = $("#preview-window #right-arrow");
    var leftArrow = $("#preview-window #left-arrow");
    var descriptions = {
        1: "<h2>1 Gift Sent: Santa Suit and Santa Cap</h2><p>If you’re going to play Santa Claus, why not look the part?</p>",
        2: "<h2>5 Gifts Sent: Skull Santa Hat and Winter Wonder Footsteps</h2><p>You’ll be walking in a winter wonderland with these brand-new holiday-themed footsteps…and also bringing the kids a surprise they’ll never forget.</p>",
        3: "<h2>10 Gifts Sent: Pale Writer Dress (elin-only, account-bound), Chilly Little Cloud, Snowy Winter Scarf, and Apothecary Dye</h2><p>Get a handle on the winter blues with a new wardrobe, including a brand-new costume for elin characters!</p>",
        4: "<h2>15 Gifts Sent: Glitterclaw dragon mount (account-bound), Cheery Winter Scarf, Glowing Skull Santa Hat</h2><p>Who needs reindeer, when you can ride a dragon right through the heart of the season?</p>",
        5: "<h2>20 Gifts Sent: Elite Status Game Time (366 days), Spirit of the Season title (delivered via token), Snowflake Flurry</h2><p>Send 20 gifts and you get elite status for a year, plus a title to identify you as a generous gift-giver!</p>"
    };
    var images = {
        1: "https://eme01.enmasse-game.com/store/tera/2018-gifting/Rewards/ingame_window_reward_1.jpg",
        2: "https://eme01.enmasse-game.com/store/tera/2018-gifting/Rewards/ingame_window_reward_5.jpg",
        3: "https://eme01.enmasse-game.com/store/tera/2018-gifting/Rewards/ingame_window_reward_10.jpg",
        4: "https://eme01.enmasse-game.com/store/tera/2018-gifting/Rewards/ingame_window_reward_15.jpg",
        5: "https://eme01.enmasse-game.com/store/tera/2018-gifting/Rewards/ingame_window_reward_20.jpg"
    };

    this.updateTabs = function(newTab) {
        text.html(descriptions[newTab]);
        giftImg.attr("src", images[newTab]);
    };

    rightArrow.on("click", function() {
        if (tab < 5) {
            tab++;
        } else {
            tab = 1;
        }
        this.updateTabs(tab);
    }.bind(this));

    leftArrow.on("click", function() {
        if (tab > 1) {
            tab--;
        } else {
            tab = 5;
        }
        this.updateTabs(tab);
    }.bind(this));

    this.updateTabs(1);
};

var previews = new rewardTabs();

function toggleModal(i) {
    var modal = $("#modal" + i);
    $("#overlay").toggleClass("open");
    modal.toggleClass("open");
};

$(".close-modal").on("click", function() {
    var modals = $(".modal");
    for (var i = 1; i <= modals.length; i++) {
        if (modals[i - 1].classList.contains("open")) {
            toggleModal(i);
        }
    }
});

$("#learn-more").on("click", function() {
    toggleModal(1);
});

$("#gifts-to-open").on("click", function() {
    if (parseInt(this.getAttribute('data-received')) > 0) {
        toggleModal(2);
    }
});

$(".whats-in-the-box").on("click", function() {
    toggleModal(5);
});

var box_num = 1;
var emp_cost = 2495;
var game_account = document.getElementById("user-info").getAttribute('data-account');

$(".buy-selection").on("click", function() {
    var nodes = $(".buy-selection");
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].classList.remove("selected");
    }
    this.classList.add("selected");
    box_num = parseInt(this.getAttribute('data-num'));
    switch (box_num) {
        case 1:
            emp_cost = 2495;
            break;
        case 2:
            emp_cost = 4495;
            break;
        case 5:
            emp_cost = 9995;
            break;
        default:
            emp_cost = 2495;
    }
    $("#box-price").text(emp_cost);
});

$("#buy-btn").on("click", function() {
    // add code for dealing with which box is selected, price, not popping up if a box isn't selected, etc
    $("#modal3 p").html("<strong style='font-size: 16px;'>Confirm Purchase</strong><br /><br />You are about to purchase <strong>" + box_num + " Golden Gift Box(s)</strong> for <strong>" + emp_cost + " EMP</strong>");
    $("#modal3 #welcome-emp").text(emp_cost);
    toggleModal(3);
});

$("#buy-now").on("click", function() {
    toggleModal(3);
    $.post("/tera/buy-item", {item_id: product_ids[box_num], item_price: emp_cost, game_account_id: game_account, game_id: "Tera"}, function(data){
        data = JSON.parse(data);
        if (data.error) {
            $("#modal5 p").html("Purchase Error: " + data.message);
            toggleModal(5);
        } else {
            $("#modal4 p").html("You have successfully purchased <strong>" + box_num + " GOLDEN GIFT BOXES</strong> from the <em>TERA</em> Web Store.<br /><br /> Continue shopping or go to the gifting center to open your gifts or send it to a friend for rewards.");
            toggleModal(4);
        }
    }.bind(this));
});

var products = [
    {title: "50,000 EMP", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/50kEMP.jpg"},
    {title: "100,000 EMP", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/100kEMP.jpg"},
    {title: "Smart Dyad Niveot Structure x8", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Smart_Dyad_Niveat.jpg"},
    {title: "Dyad Niveot Structure x20", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Dyad_niveat.jpg"},
    {title: "Silver Talent x1,000", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Silver_Talent.jpg"},
    {title: "Golden Talent x4000", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Gold_Talent.jpg"},
    {title: "Pteryx Phoenix", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Pteryx_mount.jpg"},
    {title: "Gloomscale", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Gloom.jpg"},
    {title: "Duskscale", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Dusk.jpg"},
    {title: "Battle Canary", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/battle_canary.jpg"},
    {title: "Battle Thrush", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/battle_thrush.jpg"},
    {title: "Azure Phoenix", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Azure_pheonix.jpg"},
    {title: "Ghost Dragon", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Ghost_Dragon.jpg"},
    {title: "Heaven or Hell Costume Bundle", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/HeavenORHell.jpg"},
    {title: "Dyeable Flight Suit Smart Box", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Turbo_Flight.jpg"},
    {title: "Empowered Catnap Innerwear", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Empowered_catnap.jpg"},
    {title: "Fortified Catnap Innerwear", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Fortified_catnap.jpg"},
    {title: "Deus Irae Smart Box", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Deus_Irae.jpg"},
    {title: "Hellsworn Smart Box", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Hellsworn.jpg"},
    {title: "Arcane Afterglow Smart Box", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Arcane_afterglow.jpg"},
    {title: "Tempered-Spell Smart Box", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Tempered_Spell.jpg"},
    {title: "Spellweave Costume Box", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Spellweave.jpg"},
    {title: "Metamorphic Emblem Chest x100", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Emblem_Chest.jpg"},
    {title: "Spellsilk Costume Box", src: "https://eme01.enmasse-game.com/images/tera/news/2018-golden-giftboxes/rewards/Spellsilk.jpg"}
];

for (var i = 0; i < products.length; i++) {
    var product = products[i];
    $("#modal5 #products").append("<div class='product'><h5>" + product.title + "</h5><div class='product-img' style='background-image: url(" + product.src + ")'></div></div>");
}



(function(){
    window.onload = function() {
      function loadLink(id) {
        try {
          _tera_client_proxy_;
        }
        catch(err) {
          _tera_client_proxy_ = null;
        }
        if (_tera_client_proxy_) {
          _tera_client_proxy_.invoke_menu(id);
        }
      };
  
      function listen(e) {
        e.stopPropagation();
        $('#tera_giftingwindow').unbind('click');
        $('.buy-emp').bind('click', buyEmp);
        
      };
  
      function buyEmp(e) {
        e.stopPropagation();
        e.preventDefault();
        $('.buy-emp').unbind('click');
        loadLink(130);
        $('.buy-emp').bind('click', buyEmp);
      };
      $('.buy-emp').bind('click', buyEmp);
  
      function goToGiftingCenter(e) {
        e.stopPropagation();
        e.preventDefault();
        $('.gifting-center-link').unbind('click');
        loadLink(166);
        $('.gifting-center-link').bind('click', goToGiftingCenter);
      };
      $('.gifting-center-link').bind('click', goToGiftingCenter);
    };
  })();
})();