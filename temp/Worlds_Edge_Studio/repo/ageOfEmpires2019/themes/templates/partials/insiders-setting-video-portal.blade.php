<div id="video_player" class="insider_block video_media">
    <div id="video-main">
        <h3>Insider Videos</h3>
        <div class="video_wrapper" id="insider_video_wrapper">
            <video id="azuremediaplayer" class="azuremediaplayer amp-default-skin amp-big-play-centered" tabindex="0">
                <p class="amp-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a web browser that supports
                    HTML5 video
                </p>
            </video>
        </div><!-- end of canvas wraper -->
        <div id="video-meta">
            <h4></h4>
            <h5></h5>
        </div>
    </div>

    <div id="video-sidebar" class="frame-box">
        <div class="frame-box__inner frame-box__inner--light frame-box__inner--padding">
            <label>
                <span>Group</span>
                <select id="flight-selector">
                    @if($flights->flight_terms)
                        @foreach($flights->flight_terms as $flight_vid)
                            @if(in_array($flight_vid->slug,$flights->flight_enrolled))
                                <option data-flightid="{!! $flight_vid->term_id !!}" value="{{$flight_vid->name}}">{{$flight_vid->name}}</option>
                            @endif
                        @endforeach
                    @endif
                </select>
            </label>
            <label>
                <span>Category</span>
                <select id="cat-selector">
                    @if($flights->flight_cats)
                        @foreach($flights->flight_cats as $flight_cat)
                            <option data-catid="{!! $flight_cat->term_id !!}" value="{{$flight_cat->term_id}}">{{$flight_cat->name}}</option>
                        @endforeach
                    @endif
                </select>
            </label>
            <div id="video-btns">
            </div>
        </div>
    </div>

</div>