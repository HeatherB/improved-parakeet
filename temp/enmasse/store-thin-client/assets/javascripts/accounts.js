$(function() {
    // Elite Status cancelation modal
    $('#cancel').bind('click', function(event){
        event.preventDefault();
        $('#cancelModal').reveal({close: modal.close });
    })
})