jQuery(document).ready(function($){
	let delete_mod = $('.delete_mod');
	let unflag_mod = $('.unflag_mod');
	$(delete_mod).click(function(e){
		e.preventDefault();
		let id = $(this).parents('tr').data('modid');
		let data = {
			"modid": id,
			"action": "delete_mod"
		}
		send_action(data);	
	});
	$(unflag_mod).click(function(e){
		e.preventDefault();
		let id = $(this).parents('tr').data('modid');
		let data = {
			"modid": id,
			"action": "unflag_mod"
		}
		send_action(data);
	});
	function send_action(data){
    $.ajax({
      url : './admin-ajax.php',
      type : 'POST',
      dataType: 'json',
      data : data,
      success : function( response ) {
        if(response.successful && data.action == 'delete_mod'){
          $("[data-modid='"+ data.modid +"']").fadeOut();
        } else if(response.successful && data.action == 'unflag_mod'){ 
          $("[data-modid='"+ data.modid +"']").fadeOut();
        } else {
          console.log(response);
          alert(response.error);
        }
      }
    });
	}
});