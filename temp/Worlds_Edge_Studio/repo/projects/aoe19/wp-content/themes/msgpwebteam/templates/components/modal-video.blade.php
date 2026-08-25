<div class="reveal modal" id="video-modal" data-show_intro="{{$show_intro}}" data-reveal >
    <div class="background--paper" style="position: relative">

        <video id="azuremediaplayer" data-nonce="{{wp_create_nonce('video_nonce')}}" data-video="{{$video_id}}" class="azuremediaplayer amp-default-skin amp-big-play-centered" tabindex="0" style="overflow: hidden;">
            <p class="amp-no-js">
                To view this video please enable JavaScript, and consider upgrading to a web browser that supports
                HTML5 video
            </p>
        </video>

        <button class="close-button btn-close close-video" data-close aria-label="Close modal" type="button">
        </button>
    </div>
</div>
