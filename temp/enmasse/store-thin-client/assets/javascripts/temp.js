$(function(){
  $('#clear-cache a').click(function(e){
    e.preventDefault();
    $('#clear-cache').text('loading...');
    $.get('/tera/clear-cache', function(data){
      $('#clear-cache').text(data);
    });
  });
});
