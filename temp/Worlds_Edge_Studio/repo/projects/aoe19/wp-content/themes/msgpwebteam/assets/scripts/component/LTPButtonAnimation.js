import * as lottieWeb from 'lottie-web';

export default class LTPButtonAnimation {
    firstBuild() {
          let ltp_btn_point_animationPath = window.wp_ltp_object.ltp_btn_point_animationurl;
          let ltp_btn_magin_animationPath = window.wp_ltp_object.ltp_btn_magin_animationurl;
          let ltp_btn_magout_animationPath = window.wp_ltp_object.ltp_btn_magout_animationurl;
          let ltp_btn_prev_animationPath = window.wp_ltp_object.ltp_btn_prev_animationurl;
          let ltp_btn_next_animationPath = window.wp_ltp_object.ltp_btn_next_animationurl;
          let ltp_btn_minus_animationPath = window.wp_ltp_object.ltp_btn_minus_animationurl;
          let ltp_btn_plus_animationPath = window.wp_ltp_object.ltp_btn_plus_animationurl;


            $.getJSON( ltp_btn_point_animationPath, function( data ) {
              let anim_btns = $('body').find('.mobile_wrapper button.js-mapTrigger');
              let anim_labels = $('body').find('.js-pointsWrapper > li:not(.js-mark_self_complete)');
              let anim_nav_labels = $('body').find('.js-alphaQuicknav li a');
              let video_stamps = $('body').find('.js-timeTrigger');
              loadAnimation(data, anim_btns);
              loadAnimation(data, anim_labels);
              loadAnimation(data, anim_nav_labels);
              loadAnimation(data, video_stamps);
            });
          

          $.getJSON( ltp_btn_magin_animationPath, function( data ) {
            let anim_zoomin_btns = $('body').find('.js-btnZoom .zoom_in ');
            loadAnimation(data, anim_zoomin_btns);
          });

          $.getJSON( ltp_btn_magout_animationPath, function( data ) {
            let anim_zoomout_btns = $('body').find('.js-btnZoom .zoom_out');
            loadAnimation(data, anim_zoomout_btns);
          });

          $.getJSON( ltp_btn_prev_animationPath, function( data ) {
            let anim_prev_btns = $('body').find('.js-btnPrev');
            loadAnimation(data, anim_prev_btns);
          });

          $.getJSON( ltp_btn_next_animationPath, function( data ) {
            let anim_next_btns = $('body').find('.js-btnNext');
            loadAnimation(data, anim_next_btns);
          });

        function loadAnimation(animationObject, btns) {
          btns.each(function(){
              $(this).prepend('<div class="anim-map-point"></div>');
              var icon = $(this).find('.anim-map-point');

              var animBtnPoint = lottieWeb.loadAnimation({
                  container: icon[0],
                  renderer: 'svg',
                  loop: true,
                  autoplay: false,
                  animationData: animationObject,
                  rendererSettings: {
                      preserveAspectRatio: 'xMinYMin slice',
                  },
              });


              $(this).hover(function(){
                  animBtnPoint.playSegments([[1,269],[23,269]],true);
              },function(){
                  animBtnPoint.playSegments([[270,290],[0,1]],true);
              });

          }); 
        }
    }
}