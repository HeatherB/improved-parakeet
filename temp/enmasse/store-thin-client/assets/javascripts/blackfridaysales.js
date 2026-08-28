$(document).ready(function() {

    if ($('body').hasClass('blackfridaysales')) {
        var salesCont = $('#sales-container');
        var tabs = $('#sales-tabs');
        var tab = $('#sales-tabs .tab')
        var sales = $('#sales .sale-section');

        tab.on('click', function() {
            changeTabs(this);
        });

        function changeTabs(tab) {
            var day = $(tab).data("tab");
            $('#sales-tabs .tab').removeClass("selected");
            $(tab).addClass("selected");

            $(sales).removeClass("selected");
            $(sales).each(function() {
                if ($(this).hasClass(day)) {
                    $(this).addClass("selected");
                }
            });
        }

        var day1 = new Date("11/24/17");
        var day2 = new Date("11/25/17");
        var day3 = new Date("11/26/17");
        var day4 = new Date("11/27/17");
        var testday = new Date();
        
        var today = new Date();
        
        if (day1.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
            changeTabs(tab[0]);
        } else if (day2.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
            changeTabs(tab[1]);
        } else if (day3.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
            changeTabs(tab[2]);
        } else if (day4.setHours(0,0,0,0) == today.setHours(0,0,0,0)) {
            changeTabs(tab[3]);
        }
    }

});