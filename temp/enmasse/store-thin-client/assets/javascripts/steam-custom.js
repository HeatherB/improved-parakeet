$(function(){
  $('#steam #emp-submit-btn').on('click', function(e){
    e.preventDefault();

    if ($('input[name=amount_id]').hasClass('selected') ){
      $('#steam #purchase').submit();
    } else {
      $('#steam .alert').show();
    }
  });

  $('#steam input[name=amount_id]').on('change', function(){
    $('#steam .alert').hide();
    $(this).addClass('selected');
  })
});
