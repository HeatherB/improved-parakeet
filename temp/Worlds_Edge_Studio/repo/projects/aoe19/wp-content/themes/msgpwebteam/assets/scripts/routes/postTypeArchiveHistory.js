export default {
 init() {
   // $(window).on('load', function() {
   //   $('.scroll_container').slideToggle(200)
   //   $('.timeline_button').toggleClass('buttonshow')
   //   $( '.cultures' ).fadeToggle( 'slow' )
   // })
   // $('.timeline_button').click(function(){
   //   // console.log("timeline_button has been clicked")
   //   $('html, body').animate({
   //     scrollTop: $('.timeline-wrapper').height(),
   //   }, 500);
   //   $('.scroll_container').slideToggle(200);
   //   $(this).toggleClass('buttonshow');
   //   $(this).text(function(i,text) {
   //     return text === "Show Timeline" ? "Timeline" : "Show Timeline";
   //   })
   //   $( '.cultures' ).fadeToggle( 'slow' );
   // });
   $('.coming-soon').on('click', function(e){
     e.preventDefault();
      e.stopImmediatePropagation();
   });
 },
}