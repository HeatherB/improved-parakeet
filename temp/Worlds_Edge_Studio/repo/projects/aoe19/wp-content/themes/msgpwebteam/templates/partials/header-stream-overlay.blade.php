
<div class="stream-overlay" data-channel-type="{{$streamData['channelType']}}" data-channel-name="{{$streamData['channel']}}">
        
    <div class="stream">
        <span class="stream__close"></span>

        <div class="stream__frame">
            <a class="stream__thumb" target="_blank" href="https://beam.pro/{{$streamData['channel']}}">
                <img src="{{$streamData['thumbUrl']}}" alt="{{$streamData['channel']}} Thumbnail" />
            </a>
            <div class="stream__embed"></div>
            <div class="stream__info">
                <span><a href="{{$streamData['channelUrl']}}" target="_blank">{{$streamData['channel']}}</a> is now streaming {{$streamData['game']}}.</span>
                <a class="stream__cta" href="{{$streamData['channelUrl']}}" target="_blank">View on Twitch</a>
            </div>
        </div>
    </div>
</div>
   
