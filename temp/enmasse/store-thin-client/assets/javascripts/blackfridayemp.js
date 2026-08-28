$(document).ready(function() {
    var deals = document.getElementsByClassName("deal");
    Array.from(deals).forEach(function(deal) {
        $(deal).find(".show-btn").on("click", function() {
            $(this).toggleClass("hidden");
            if ($(this).hasClass("hidden")) {
                this.innerHTML = "<div class='before-arrow down'></div>Show Gift Details<div class='after-arrow down'>";
            } else {
                this.innerHTML = "<div class='before-arrow'></div>Hide Gift Details<div class='after-arrow'>";
            }
            $(deal).find(".deals").toggleClass("hidden");
        });
    });
});