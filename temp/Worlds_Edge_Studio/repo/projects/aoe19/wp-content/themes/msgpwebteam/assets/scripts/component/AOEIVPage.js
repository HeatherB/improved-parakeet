export default class AOEIVPage {
   
   constructor() {
      this.init();
   }

   init() {
      setTimeout(function() {
         $('.background--smoke video').each(function () {
                    this.play();
                });
      }, 500);

      this._events();
   } 

   _events() {
      $('.btn-novis').on('mouseenter', function(e) {
        let associated_iframe = $(this).prev('.video_iframe');
        $(associated_iframe).css('border', "2px solid #cda351");
      });
      $('.btn-novis').on('mouseleave', function(e) {
        let associated_iframe = $(this).prev('.video_iframe');
        $(associated_iframe).css('border', "none");
      });
   } 
}