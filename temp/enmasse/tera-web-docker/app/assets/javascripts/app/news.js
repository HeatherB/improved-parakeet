if($('.news').length > 0) {
    $('.tabs .tab').click(function(event) {
        $('.tabs .tab').removeClass('selected');
        $(this).addClass('selected');

        $('.tabbed').removeClass('selected');
        $('#tabbed-' + event.target.id).addClass('selected');
    });
}