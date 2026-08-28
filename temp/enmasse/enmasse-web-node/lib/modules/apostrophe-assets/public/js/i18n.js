$(function() {
   // some functionality related to switching locals / languages
   var locale_picker_container = $('.locale_picker');
   var locale_picker = $(locale_picker_container).find('.locale_picker_list');
   var locale_selected = $(locale_picker_container).find('.locale_selected');
  
    $(document).ready(function() {
        var selected = locale_picker.find('.selected');
        if ( selected.length ) {
            hoistSelectedToTop( selected );
        }
    });
  
    function hoistSelectedToTop( selected ){
        locale_picker.find('li').removeClass('selected');
        locale_selected.html( selected.html() );
        selected.remove();
    }

    $('.locale_arrow_down, .locale_arrow_up, .locale_icon, .locale_selected, .locale_selected a').on('click', function(e) {
        e.preventDefault();
        if ( $('.locale_picker').hasClass( 'closed' ) ) {
            $('.locale_picker').removeClass('closed');
        }
        else {
            $('.locale_picker').addClass('closed');
        }
    });

    $('.locale_picker_list .locale a').on('click', function(e) {
        var focus = $(this);
        // expand menu if clicked
        if ( locale_picker_container.hasClass('closed') ){
            e.preventDefault();
            locale_picker_container.removeClass('closed');
        }
        // close menu if already selected locale and open menu
        else if ( focus.parent().hasClass('selected') && !locale_picker_container.hasClass('closed') ) {
            e.preventDefault();
            locale_picker_container.addClass('closed')
        }
        // else make selection
        else {
            hoistSelectedToTop( focus.parent() )
            locale_picker_container.addClass('closed')
        }
    });

    $(document).mouseup(function (e) { 
        var locale_picker_container = $('.locale_picker');
        if ($(e.target).closest( locale_picker_container ).length === 0) { 
            locale_picker_container.addClass('closed');
        } 
    }); 
   
  });