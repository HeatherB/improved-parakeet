import YouTubePlayer from 'youtube-player';

export default class Video {

  constructor () {
    this._init()
  }

  _init(){
    let player;
    let self = this;
    this.player = YouTubePlayer('youtube_video_source', {
      height: '100%',
      width: '100%',
      videoId: '',
      playerVars: {'controls': 1, 'theme':'light', 'showinfo':0, 'rel':0 },
    });

    this._loadById();

    this.player.on('ready', (event) => {
      $('.reveal-overlay').on('click', function(){
        event.target.pauseVideo();
        $('#video_modal').foundation('close');
      });
    });

    this.player.playVideo();

    this.player.on('stateChange', (event) => {
      if(event.data === 0) {
        $('#video_modal').foundation('close');
      }
    });
  }

  _loadById(){
    let self = this;
    this.ui = {
      $container: $('.js-videoContainer'),
    }
    this.ui.$container.on("click", '.video', function(e){
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      //console.log("you clikced the play button")
      let videoId = $(this).attr('data-video-id');
      $('#video_modal').foundation('open');
      self.player.loadVideoById({'videoId': videoId, 'startSeconds': 0});
    });
  }
}