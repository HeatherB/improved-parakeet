function autoPlayVideo(video_id, width, height){
  var container = $(video_id).parent();
  var autoplaySrc = $(video_id).attr('src').replace('autohide=0', 'autohide=1') + '?&amp;autoplay=1';
  var autoplayHtml = '<iframe id="video_bai" width="' + width + '" height="' + height + '" src="' + autoplaySrc + '" frameborder="0" allowfullscreen></iframe>';
  $(video_id).remove();
  container.prepend(autoplayHtml);
}

function handleVideoOverlayClick() {
  $(this).hide();
  $('#vidPreview').stop().hide();
  var width,
      height,
      page,
      version,
      video = $('#video_bai');
  width = video.attr('width');
  height = video.attr('height');
  page = video.attr('data-page');
  version = video.attr('data-var');
 
  autoPlayVideo('#video_bai', width, height);
}




$(document).ready(function() {
  $("#video-overlay").click(handleVideoOverlayClick);
});

