// There are 2 ways to do show hide divs, this need to be cleaned up!

$(document).ready(function(){
  //collapse-expand flair boxes ( legacy support for CBT boxes )
    if ($('div.cbt-page-entry, .flair-box').length) {
      $('a.cbt-expand-button, a.toggle').click(function() {
        if ($(this).parents('div.cbt-page-entry, .flair-box').hasClass('collapsed')) {
          // show collapse copy
          $(this).html('Collapse Entry');
          // Expand
          $(this).prev('div').slideDown(400); // Show content section
          $(this).animate({ // Slide button to open position
            'bottom': '-28px',
            'border-bottom-left-radius': '5px',
            'border-top-left-radius': 0
          }, 350);
          $(this).parents('div.cbt-page-entry, .flair-box').animate({ // Adjust margin and corners of parent container
            'margin-bottom': '40px',
            'border-bottom-right-radius': 0
          }).removeClass('collapsed');
        } else { 
          // show expand copy
          $(this).html('Expand Entry');
          // Collapse
          $(this).prev('div').slideUp(400); // Hide content section
          $(this).animate({ // Slide button to closed position
            'bottom': 0,
            'border-bottom-left-radius': 0,
            'border-top-left-radius': '5px'
          }, 350);
          $(this).parents('div.cbt-page-entry, .flair-box').animate({ // Adjust margin and corners of parent container
            'margin-bottom': '20px',
            'border-bottom-right-radius': '5px'
          }).addClass('collapsed');
        }
      });
    };
});

$(document).ready(function(){
    if ( $('.show-hide-trigger') ) {
    $('.show-hide-trigger').bind('click', function(){
      $(this).text( ($(this).text() == '+ More Info') ? '- Less Info' : '+ More Info' );
      $('.show-hide-content').toggleClass('showing');
    })
  }
});
