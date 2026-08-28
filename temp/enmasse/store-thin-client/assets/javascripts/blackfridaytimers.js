$(document).ready(function() {
    var path = window.location.pathname;
    var today = new Date();
    var startdate = new Date("11/24/17");
    var enddate = new Date("11/28/17");
    enddate.setHours(9);

    if (enddate > today && startdate <= today) {

        if (path == "/enmasse/emp") {
            var emp = $(".select-emp").find(".currency-by-payment").first();
            emp.toggleClass("blackfriday");
            emp.prepend("<div id='blackfridaytag'><h2>Black Friday Special</h2><h3>Limited Time Only</h3><span>Until Nov. 28 at 9 a.m. PST!</span></div>");
        }

        /*if (path == "/") {
            // header section
            $("#promo-img").attr('src', 'https://static.enmasse.com/images/BlackFriday/Header.jpg');
            $("#promo-heading").text("Black Friday Deals");
            $("#promo-text").text("Friday through Monday, we change our deep discounts (up to 70 percent off) and great deals for all of our games daily!");
            $("#promo-link").attr("href", "/black-friday/sales");

            // EMP section
            $("#emp-img").attr('src', 'https://static.enmasse.com/images/BlackFriday/EMP.jpg');
            $("#emp-text").text("When you buy EMP this weekend, you get free gifts for all En Masse games.");
        }*/

    }

});
