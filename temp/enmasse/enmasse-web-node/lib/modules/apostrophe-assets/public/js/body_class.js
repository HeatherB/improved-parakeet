if($('#page_layout_name').length > 0) {
	var layout_name = $('#page_layout_name').val();

	var page_layout_name = "pagelayout_" + layout_name;
	$('body').addClass(page_layout_name);
}

function link_is_external(link_element) {
    return (link_element.host !== window.location.host);
}
if($("#news").length > 0) {
	$("a.btn").each(function() {
	    if(link_is_external(this)) {
	        $(this).addClass('external');
	    }
	});
}